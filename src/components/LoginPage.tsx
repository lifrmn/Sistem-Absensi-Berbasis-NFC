import { useState } from 'react';
import { Nfc, Eye, EyeOff, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { UserRole } from '../App';
import { login } from '../utils/apiClient';
import { UnismuhLogoWithFallback } from './UnismuhLogo';

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
    <div className="relative min-h-screen flex overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(29,78,216,0.14),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(14,116,144,0.16),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.2),transparent_40%),#f4f8ff]">
      <div className="absolute inset-0 opacity-35 pointer-events-none bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"></div>

      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0b3f99] via-[#0a4ec2] to-[#0d2a66] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-16 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-amber-300/25 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-sky-100/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08)_0%,transparent_46%)]"></div>
        
        <div className="text-center space-y-8 relative z-10">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
              <UnismuhLogoWithFallback size="w-28 h-28" className="relative z-10 drop-shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 bg-[#FACC15] rounded-full p-3 shadow-2xl animate-pulse-nfc">
                <Nfc className="w-9 h-9 text-[#0052CC]" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-white text-6xl tracking-tight drop-shadow-lg">UNISMUH</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[#FFC107]"></div>
              <p className="text-white/90 text-2xl tracking-wide font-semibold">Informatika</p>
              <div className="h-px w-12 bg-[#FFC107]"></div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-white/90 text-xl max-w-md leading-relaxed">
              Sistem Absensi Cerdas Berbasis NFC untuk kemudahan monitoring kehadiran
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Real-time</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Nfc className="w-4 h-4 text-[#FFC107]" />
                <span className="text-white text-sm">Contactless</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <ShieldCheck className="w-4 h-4 text-cyan-200" />
                <span className="text-white text-sm">Secure API</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/70 bg-white/75 shadow-[0_30px_100px_-35px_rgba(2,6,23,0.55)] backdrop-blur-md p-7 sm:p-9 animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <UnismuhLogoWithFallback size="w-12 h-12" fallbackClassName="text-[#0052CC]" />
              <Nfc className="w-8 h-8 text-[#FFC107]" />
            </div>
            <h2 className="text-[#0052CC] text-3xl font-display">UNISMUH</h2>
            <p className="text-gray-600">Informatika</p>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              NFC Attendance Portal
            </div>
            <h2 className="text-3xl text-slate-900 mt-4 font-display">Masuk ke Akun</h2>
            <p className="text-slate-600 mt-2">Silakan masuk untuk melanjutkan</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700">Username / NIM</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username atau NIM"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 bg-white/90 border-slate-200 focus-visible:ring-[#0052CC]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white/90 border-slate-200 focus-visible:ring-[#0052CC]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-[#0052CC] to-[#0a3d9c] hover:from-[#0049b7] hover:to-[#07317f] shadow-lg shadow-blue-200/50"
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

          <div className="text-center text-sm text-gray-500 pt-2 border-t border-slate-200/80">
            <p>Demo Login API:</p>
            <p>Dosen: dosen / Dosen@12345</p>
            <p>Mahasiswa: a001 / Mahasiswa@12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
