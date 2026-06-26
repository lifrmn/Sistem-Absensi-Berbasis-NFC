import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from './env';
import type { AuthUser } from './types';

interface JwtPayload {
  sub: number;
  role: AuthUser['role'];
}

const jwtPayloadSchema = z.object({
  sub: z.number().int().positive(),
  role: z.enum(['dosen', 'mahasiswa']),
});

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, role: user.role } satisfies JwtPayload, env.JWT_SECRET, {
    expiresIn: '8h',
  });
}

export function verifyToken(token: string): JwtPayload {
  const rawPayload = jwt.verify(token, env.JWT_SECRET);
  return jwtPayloadSchema.parse(rawPayload);
}
