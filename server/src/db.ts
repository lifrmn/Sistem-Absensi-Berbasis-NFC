import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { hashPassword } from './auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const dbPath = path.resolve(dataDir, 'app.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  id_number TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('dosen', 'mahasiswa')),
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  class_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'closed')),
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS enrollments (
  session_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (session_id, user_id),
  FOREIGN KEY(session_id) REFERENCES sessions(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('hadir', 'manual')),
  tap_time TEXT,
  manual_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, user_id),
  FOREIGN KEY(session_id) REFERENCES sessions(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

function seedData(): void {
  const hasUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (hasUsers.count > 0) {
    return;
  }

  const insertUser = db.prepare(`
    INSERT INTO users (name, username, email, id_number, role, password_hash)
    VALUES (@name, @username, @email, @idNumber, @role, @passwordHash)
  `);

  const dosenPassword = hashPassword('Dosen@12345');
  const mahasiswaPassword = hashPassword('Mahasiswa@12345');

  insertUser.run({
    name: 'Dosen Unismuh',
    username: 'dosen',
    email: 'dosen@unismuh.ac.id',
    idNumber: 'D001',
    role: 'dosen',
    passwordHash: dosenPassword,
  });

  const students = [
    ['Ahmad Rasyid', 'a001', 'ahmad.a001@student.unismuh.ac.id', 'A001'],
    ['Budi Santoso', 'a002', 'budi.a002@student.unismuh.ac.id', 'A002'],
    ['Citra Dewi', 'a003', 'citra.a003@student.unismuh.ac.id', 'A003'],
    ['Deni Pratama', 'a004', 'deni.a004@student.unismuh.ac.id', 'A004'],
    ['Eka Putri', 'a005', 'eka.a005@student.unismuh.ac.id', 'A005'],
    ['Dinda Fadila', 'a006', 'dinda.a006@student.unismuh.ac.id', 'A006'],
    ['Fajar Ramadhan', 'a007', 'fajar.a007@student.unismuh.ac.id', 'A007'],
    ['Gita Permata', 'a008', 'gita.a008@student.unismuh.ac.id', 'A008']
  ];

  for (const [name, username, email, idNumber] of students) {
    insertUser.run({ name, username, email, idNumber, role: 'mahasiswa', passwordHash: mahasiswaPassword });
  }

  const dosen = db.prepare("SELECT id FROM users WHERE role = 'dosen' LIMIT 1").get() as { id: number };
  const activeSession = db.prepare(`
    INSERT INTO sessions (title, course, class_date, start_time, status, created_by)
    VALUES (?, ?, ?, ?, 'active', ?)
  `).run(
    'Sesi Pemrograman Web',
    'pemrograman-web',
    new Date().toISOString().slice(0, 10),
    '08:30',
    dosen.id,
  );

  const sessionId = Number(activeSession.lastInsertRowid);
  const studentRows = db.prepare("SELECT id FROM users WHERE role = 'mahasiswa' ORDER BY id").all() as Array<{ id: number }>;
  const enrollStmt = db.prepare('INSERT INTO enrollments (session_id, user_id) VALUES (?, ?)');
  const hadirStmt = db.prepare('INSERT INTO attendance (session_id, user_id, status, tap_time) VALUES (?, ?, ?, ?)');

  studentRows.forEach((row, idx) => {
    enrollStmt.run(sessionId, row.id);
    if (idx < 5) {
      const minute = String(35 + idx).padStart(2, '0');
      hadirStmt.run(sessionId, row.id, 'hadir', `08:${minute}`);
    }
  });
}

seedData();
