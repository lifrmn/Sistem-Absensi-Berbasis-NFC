import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { env } from './env';
import { db } from './db';
import { hashPassword, signToken, verifyPassword, verifyToken } from './auth';
import { normalizeIdentifier, sanitizeText } from './security';
import type { AuthUser, UserRole } from './types';

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

const app = express();

// Required when API runs behind nginx/reverse proxy so rate-limit uses real client IP.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: false }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

function asyncHandler<T extends Request>(handler: (req: T, res: Response) => Promise<void>) {
  return (req: T, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };
}

function getUserById(userId: number): AuthUser | null {
  const row = db
    .prepare('SELECT id, name, username, email, id_number as idNumber, role FROM users WHERE id = ?')
    .get(userId) as AuthUser | undefined;

  return row ?? null;
}

function authRequired(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token tidak valid' });
    return;
  }

  try {
    const token = authHeader.slice('Bearer '.length);
    const payload = verifyToken(token);
    const user = getUserById(payload.sub);

    if (!user) {
      res.status(401).json({ message: 'User tidak ditemukan' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Sesi login berakhir' });
  }
}

function requireRole(roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Akses ditolak' });
      return;
    }

    next();
  };
}

const registerSchema = z
  .object({
    nama: z.string().min(2).max(100),
    idNumber: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
    role: z.enum(['dosen', 'mahasiswa']),
    username: z.string().min(3).max(40).optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

app.post(
  '/api/auth/register',
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body);

    const name = sanitizeText(payload.nama);
    const idNumber = normalizeIdentifier(payload.idNumber);
    const email = normalizeIdentifier(payload.email);
    const username = normalizeIdentifier(payload.username || payload.idNumber);

    const existing = db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ? OR id_number = ?')
      .get(email, username, idNumber) as { id: number } | undefined;

    if (existing) {
      res.status(409).json({ message: 'Akun sudah terdaftar' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO users (name, username, email, id_number, role, password_hash)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run(name, username, email, idNumber, payload.role, hashPassword(payload.password));

    res.status(201).json({ message: 'Registrasi berhasil' });
  }),
);

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

app.post(
  '/api/auth/login',
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const identifier = normalizeIdentifier(payload.username);

    const row = db
      .prepare(`
        SELECT id, name, username, email, id_number as idNumber, role, password_hash as passwordHash
        FROM users
        WHERE username = ? OR email = ? OR id_number = ?
        LIMIT 1
      `)
      .get(identifier, identifier, identifier) as (AuthUser & { passwordHash: string }) | undefined;

    if (!row || !verifyPassword(payload.password, row.passwordHash)) {
      res.status(401).json({ message: 'Username atau password salah' });
      return;
    }

    const { passwordHash: _passwordHash, ...user } = row;
    const token = signToken(user);

    res.json({
      token,
      user,
    });
  }),
);

app.get('/api/auth/me', authRequired, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

app.get(
  '/api/dashboard/stats',
  authRequired,
  requireRole(['dosen']),
  (req: AuthenticatedRequest, res) => {
    const activeSession = db
      .prepare("SELECT id FROM sessions WHERE status = 'active' ORDER BY id DESC LIMIT 1")
      .get() as { id: number } | undefined;

    if (!activeSession) {
      res.json({ totalSesiHariIni: 0, totalHadir: 0, totalMahasiswa: 0, persenHadir: 0 });
      return;
    }

    const totalMahasiswa = (
      db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE session_id = ?').get(activeSession.id) as {
        count: number;
      }
    ).count;
    const totalHadir = (
      db.prepare('SELECT COUNT(*) as count FROM attendance WHERE session_id = ?').get(activeSession.id) as {
        count: number;
      }
    ).count;

    res.json({
      totalSesiHariIni: 1,
      totalHadir,
      totalMahasiswa,
      persenHadir: totalMahasiswa > 0 ? Math.round((totalHadir / totalMahasiswa) * 100) : 0,
    });
  },
);

app.get('/api/sessions/active', authRequired, (req: AuthenticatedRequest, res) => {
  const session = db
    .prepare("SELECT id, title, course, class_date as classDate, start_time as startTime FROM sessions WHERE status = 'active' ORDER BY id DESC LIMIT 1")
    .get() as { id: number; title: string; course: string; classDate: string; startTime: string } | undefined;

  if (!session) {
    res.status(404).json({ message: 'Belum ada sesi aktif' });
    return;
  }

  const students = db
    .prepare(`
      SELECT
        u.id,
        u.name as nama,
        u.id_number as nim,
        CASE
          WHEN a.status = 'manual' THEN 'manual'
          WHEN a.status = 'hadir' THEN 'hadir'
          ELSE 'belum-hadir'
        END as status,
        a.tap_time as waktuTap
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      LEFT JOIN attendance a ON a.session_id = e.session_id AND a.user_id = e.user_id
      WHERE e.session_id = ?
      ORDER BY u.name ASC
    `)
    .all(session.id);

  const present = students.filter((item: any) => item.status !== 'belum-hadir');
  const absent = students.filter((item: any) => item.status === 'belum-hadir');

  res.json({
    session,
    present,
    absent,
  });
});

const manualMarkSchema = z.object({
  studentId: z.number().int().positive(),
  reason: z.string().min(3).max(200),
});

app.post(
  '/api/sessions/:sessionId/manual-mark',
  authRequired,
  requireRole(['dosen']),
  asyncHandler(async (req, res) => {
    const sessionId = Number(req.params.sessionId);
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      res.status(400).json({ message: 'ID sesi tidak valid' });
      return;
    }
    const payload = manualMarkSchema.parse(req.body);

    const enrolled = db
      .prepare('SELECT 1 as ok FROM enrollments WHERE session_id = ? AND user_id = ?')
      .get(sessionId, payload.studentId) as { ok: number } | undefined;

    if (!enrolled) {
      res.status(404).json({ message: 'Mahasiswa tidak terdaftar pada sesi ini' });
      return;
    }

    db.prepare(
      `
      INSERT INTO attendance (session_id, user_id, status, tap_time, manual_reason)
      VALUES (?, ?, 'manual', 'Manual', ?)
      ON CONFLICT(session_id, user_id)
      DO UPDATE SET status = 'manual', tap_time = 'Manual', manual_reason = excluded.manual_reason
    `,
    ).run(sessionId, payload.studentId, sanitizeText(payload.reason));

    res.json({ message: 'Kehadiran manual berhasil disimpan' });
  }),
);

app.post(
  '/api/sessions/:sessionId/notify',
  authRequired,
  requireRole(['dosen']),
  (req: AuthenticatedRequest, res) => {
    const sessionId = Number(req.params.sessionId);
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      res.status(400).json({ message: 'ID sesi tidak valid' });
      return;
    }
    const count = (
      db.prepare(
        `
        SELECT COUNT(*) as count
        FROM enrollments e
        LEFT JOIN attendance a ON a.session_id = e.session_id AND a.user_id = e.user_id
        WHERE e.session_id = ? AND a.id IS NULL
      `,
      ).get(sessionId) as { count: number }
    ).count;

    res.json({ message: `Notifikasi terkirim ke ${count} mahasiswa`, count });
  },
);

app.post('/api/attendance/tap', authRequired, requireRole(['mahasiswa']), (req: AuthenticatedRequest, res) => {
  const session = db
    .prepare("SELECT id FROM sessions WHERE status = 'active' ORDER BY id DESC LIMIT 1")
    .get() as { id: number } | undefined;

  if (!session) {
    res.status(404).json({ message: 'Tidak ada sesi aktif' });
    return;
  }

  db.prepare(
    `
    INSERT INTO attendance (session_id, user_id, status, tap_time)
    VALUES (?, ?, 'hadir', ?)
    ON CONFLICT(session_id, user_id)
    DO UPDATE SET status = 'hadir', tap_time = excluded.tap_time, manual_reason = NULL
  `,
  ).run(session.id, req.user!.id, new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

  res.json({ message: 'Absensi berhasil tercatat' });
});

app.get('/api/attendance/me', authRequired, requireRole(['mahasiswa']), (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const todayIsoDate = new Date().toISOString().slice(0, 10);

  const totalSessions = (
    db.prepare(
      `
      SELECT COUNT(*) as count
      FROM enrollments e
      JOIN sessions s ON s.id = e.session_id
      WHERE e.user_id = ?
    `,
    ).get(userId) as { count: number }
  ).count;

  const totalHadir = (
    db.prepare(
      `
      SELECT COUNT(*) as count
      FROM attendance a
      JOIN sessions s ON s.id = a.session_id
      WHERE a.user_id = ? AND a.status IN ('hadir', 'manual')
    `,
    ).get(userId) as { count: number }
  ).count;

  const todayAttendance = db
    .prepare(
      `
      SELECT a.tap_time as tapTime
      FROM attendance a
      JOIN sessions s ON s.id = a.session_id
      WHERE a.user_id = ? AND s.class_date = ?
      ORDER BY a.id DESC
      LIMIT 1
    `,
    )
    .get(userId, todayIsoDate) as { tapTime: string | null } | undefined;

  const history = db
    .prepare(
      `
      SELECT
        s.class_date as classDate,
        s.course as mataKuliah,
        CASE WHEN a.status IN ('hadir', 'manual') THEN 'hadir' ELSE 'tidak-hadir' END as status,
        a.tap_time as waktu
      FROM enrollments e
      JOIN sessions s ON s.id = e.session_id
      LEFT JOIN attendance a ON a.session_id = e.session_id AND a.user_id = e.user_id
      WHERE e.user_id = ?
      ORDER BY s.class_date DESC, s.id DESC
      LIMIT 10
    `,
    )
    .all(userId) as Array<{
      classDate: string;
      mataKuliah: string;
      status: 'hadir' | 'tidak-hadir';
      waktu: string | null;
    }>;

  const formattedHistory = history.map((row) => ({
    date: new Date(row.classDate).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    mataKuliah: row.mataKuliah.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    status: row.status,
    waktu: row.waktu || '-',
  }));

  res.json({
    hasAttendedToday: Boolean(todayAttendance),
    todayAttendanceTime: todayAttendance?.tapTime || null,
    totalHadir,
    persentase: totalSessions > 0 ? Math.round((totalHadir / totalSessions) * 100) : 0,
    history: formattedHistory,
  });
});

app.get('/api/reports/attendance', authRequired, requireRole(['dosen']), (req: AuthenticatedRequest, res) => {
  const course = String(req.query.course || 'pemrograman-web');

  const rows = db
    .prepare(
      `
      SELECT
        u.id,
        u.name as nama,
        u.id_number as nim,
        SUM(CASE WHEN a.status IN ('hadir', 'manual') THEN 1 ELSE 0 END) as totalHadir,
        COUNT(e.session_id) - SUM(CASE WHEN a.status IN ('hadir', 'manual') THEN 1 ELSE 0 END) as totalTidakHadir
      FROM users u
      JOIN enrollments e ON e.user_id = u.id
      JOIN sessions s ON s.id = e.session_id
      LEFT JOIN attendance a ON a.session_id = e.session_id AND a.user_id = e.user_id
      WHERE u.role = 'mahasiswa' AND s.course = ?
      GROUP BY u.id, u.name, u.id_number
      ORDER BY u.name ASC
    `,
    )
    .all(course) as Array<{
      id: number;
      nama: string;
      nim: string;
      totalHadir: number;
      totalTidakHadir: number;
    }>;

  const data = rows.map((item) => {
    const total = item.totalHadir + item.totalTidakHadir;
    const persentase = total > 0 ? Math.round((item.totalHadir / total) * 100) : 0;

    return {
      id: String(item.id),
      nama: item.nama,
      nim: item.nim,
      totalHadir: item.totalHadir,
      totalTidakHadir: item.totalTidakHadir,
      persentase,
      status: persentase >= 75 ? 'hadir' : 'belum-hadir',
    };
  });

  res.json({ data });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// In single-container production, backend serves the built frontend bundle.
const frontendBuildDir = path.resolve(process.cwd(), 'build');
const frontendIndexPath = path.join(frontendBuildDir, 'index.html');

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendBuildDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    res.sendFile(frontendIndexPath);
  });
}

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: 'Validasi gagal', errors: error.flatten().fieldErrors });
    return;
  }

  const message = error instanceof Error ? error.message : 'Terjadi kesalahan server';
  res.status(500).json({ message });
});

export { app };
