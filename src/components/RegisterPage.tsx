import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { register } from '../utils/apiClient';

interface RegisterPageProps {
  onBack: () => void;
}

export function RegisterPage({ onBack }: RegisterPageProps) {
  const redirectTimerRef = useRef<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    idNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama || !formData.idNumber || !formData.email || !formData.password || !formData.role) {
      toast.error('Semua field harus diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        nama: formData.nama.trim(),
        idNumber: formData.idNumber.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role as 'dosen' | 'mahasiswa',
      });

      toast.success('Akun berhasil didaftarkan!');

      if (redirectTimerRef.current !== null) {
        clearTimeout(redirectTimerRef.current);
      }

      redirectTimerRef.current = window.setTimeout(() => onBack(), 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registrasi gagal');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_15%_20%,rgba(29,78,216,0.14),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(14,116,144,0.16),transparent_35%),#f4f8ff] p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      <div className="max-w-2xl mx-auto relative z-10">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Login
        </Button>

        <div className="bg-white/80 backdrop-blur-md border border-white/70 rounded-3xl shadow-[0_20px_80px_-20px_rgba(2,6,23,0.45)] p-8">
          <div className="mb-8">
            <h2 className="text-3xl text-slate-900 font-display">Daftar Akun Baru</h2>
            <p className="text-slate-600 mt-2">Lengkapi data untuk membuat akun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="dosen">Dosen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">
                {formData.role === 'dosen' ? 'ID Dosen' : 'NIM'}
              </Label>
              <Input
                id="idNumber"
                type="text"
                placeholder={formData.role === 'dosen' ? 'Masukkan ID Dosen' : 'Masukkan NIM'}
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@unismuh.ac.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Masukkan ulang password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-[#0052CC] to-[#0a3d9c] hover:from-[#0049b7] hover:to-[#07317f] shadow-lg shadow-blue-200/50"
            >
              {isSubmitting ? 'Mendaftarkan...' : 'Daftar Akun'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
