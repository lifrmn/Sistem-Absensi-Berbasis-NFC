import { useState } from 'react';
import { GraduationCap, Nfc, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { UserRole } from '../App';
import { login } from '../utils/apiClient';

interface LoginPageProps {
  onLogin: (role: UserRole, name: string, idNumber: string) => void;
  onRegister: () => void;
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(username, password);
      onLogin(user.role, user.name, user.idNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0052CC] via-[#0052CC] to-[#003D99] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl"></div>
        
        <div className="text-center space-y-8 relative z-10">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
              <GraduationCap className="w-28 h-28 text-white drop-shadow-2xl relative z-10" />
              <div className="absolute -bottom-2 -right-2 bg-[#FFC107] rounded-full p-3 shadow-2xl animate-pulse-nfc">
                <Nfc className="w-9 h-9 text-[#0052CC]" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-white text-6xl tracking-tight drop-shadow-lg">UNISMUH</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[#FFC107]"></div>
              <p className="text-white/90 text-2xl tracking-wide">Informatika</p>
              <div className="h-px w-12 bg-[#FFC107]"></div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-white/90 text-xl max-w-md leading-relaxed">
              Sistem Absensi Cerdas Berbasis NFC untuk kemudahan monitoring kehadiran
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Real-time</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Nfc className="w-4 h-4 text-[#FFC107]" />
                <span className="text-white text-sm">Contactless</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-12 h-12 text-[#0052CC]" />
              <Nfc className="w-8 h-8 text-[#FFC107]" />
            </div>
            <h2 className="text-[#0052CC] text-3xl">UNISMUH</h2>
            <p className="text-gray-600">Informatika</p>
          </div>

          <div>
            <h2 className="text-3xl text-gray-900">Masuk ke Akun</h2>
            <p className="text-gray-600 mt-2">Silakan masuk untuk melanjutkan</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username / NIM</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username atau NIM"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#0052CC] hover:bg-[#003D99]"
            >
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <button 
                onClick={onRegister}
                className="text-[#0052CC] hover:underline"
              >
                Daftar di sini
              </button>
            </p>
          </div>

          <div className="text-center text-sm text-gray-500 pt-4">
            <p>Demo Login API:</p>
            <p>Dosen: dosen / Dosen@12345</p>
            <p>Mahasiswa: a001 / Mahasiswa@12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
