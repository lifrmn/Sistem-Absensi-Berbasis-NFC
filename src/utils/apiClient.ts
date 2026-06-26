import type { Student, UserRole } from '../App';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const AUTH_TOKEN_KEY = 'nfc_absensi_token_v1';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  idNumber: string;
  role: Exclude<UserRole, null>;
}

export interface SessionData {
  id: number;
  title: string;
  course: string;
  classDate: string;
  startTime: string;
}

export interface AttendanceHistoryItem {
  date: string;
  mataKuliah: string;
  status: 'hadir' | 'tidak-hadir';
  waktu: string;
}

export interface MahasiswaAttendanceSummary {
  hasAttendedToday: boolean;
  todayAttendanceTime: string | null;
  totalHadir: number;
  persentase: number;
  history: AttendanceHistoryItem[];
}

interface SessionResponse {
  session: SessionData;
  present: Student[];
  absent: Student[];
}

function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke server API. Pastikan backend berjalan dan URL API benar.');
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || 'Request gagal');
  }

  return payload as T;
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const response = await request<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  setToken(response.token);
  return response.user;
}

export async function register(payload: {
  nama: string;
  idNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Exclude<UserRole, null>;
  username?: string;
}): Promise<void> {
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await request<{ user: AuthUser }>('/auth/me');
  return response.user;
}

export async function getDashboardStats(): Promise<{
  totalSesiHariIni: number;
  totalHadir: number;
  totalMahasiswa: number;
  persenHadir: number;
}> {
  return request('/dashboard/stats');
}

export async function getActiveSession(): Promise<SessionResponse> {
  return request('/sessions/active');
}

export async function markManualAttendance(sessionId: number, studentId: number, reason: string): Promise<void> {
  await request(`/sessions/${sessionId}/manual-mark`, {
    method: 'POST',
    body: JSON.stringify({ studentId, reason }),
  });
}

export async function sendSessionNotification(sessionId: number): Promise<{ count: number }> {
  return request(`/sessions/${sessionId}/notify`, {
    method: 'POST',
  });
}

export async function tapAttendance(): Promise<void> {
  await request('/attendance/tap', { method: 'POST' });
}

export async function getMahasiswaAttendanceSummary(): Promise<MahasiswaAttendanceSummary> {
  return request('/attendance/me');
}

export async function getAttendanceReport(course: string): Promise<Student[]> {
  const response = await request<{ data: Student[] }>(`/reports/attendance?course=${encodeURIComponent(course)}`);
  return response.data;
}

export { AUTH_TOKEN_KEY };
