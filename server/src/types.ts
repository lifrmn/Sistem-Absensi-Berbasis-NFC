export type UserRole = 'dosen' | 'mahasiswa';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  idNumber: string;
  role: UserRole;
}

export interface SessionStudent {
  id: number;
  nama: string;
  nim: string;
  status: 'hadir' | 'belum-hadir' | 'manual';
  waktuTap?: string;
}
