import { lazy, Suspense, useEffect, useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { DosenDashboard } from './components/DosenDashboard';
import { MahasiswaDashboard } from './components/MahasiswaDashboard';
import { NFCScanOverlay } from './components/NFCScanOverlay';
import { ActiveSession } from './components/ActiveSession';
import { AttendanceReport } from './components/AttendanceReport';
import { StudentDetail } from './components/StudentDetail';
import { SettingsPage } from './components/SettingsPage';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Palette } from 'lucide-react';
import { toast } from 'sonner';
import { AUTH_TOKEN_KEY, clearToken, getCurrentUser, tapAttendance } from './utils/apiClient';

const AIChatbot = lazy(() => import('./components/AIChatbot').then((module) => ({ default: module.AIChatbot })));
const DesignShowcase = lazy(() => import('./components/DesignShowcase').then((module) => ({ default: module.DesignShowcase })));

const AUTH_STORAGE_KEY = 'nfc_absensi_auth_v1';

export type UserRole = 'dosen' | 'mahasiswa' | null;

export type AttendanceStatus = 'hadir' | 'belum-hadir' | 'manual';

export interface Student {
  id: string;
  nama: string;
  nim: string;
  status: AttendanceStatus;
  waktuTap?: string;
  foto?: string;
  totalHadir?: number;
  totalTidakHadir?: number;
  persentase?: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>('');
  const [userIdNumber, setUserIdNumber] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDesignShowcase, setShowDesignShowcase] = useState<boolean>(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        return;
      }

      try {
        const user = await getCurrentUser();
        setUserRole(user.role);
        setUserName(user.name);
        setUserIdNumber(user.idNumber);
        setCurrentScreen(user.role === 'dosen' ? 'dosen-dashboard' : 'mahasiswa-dashboard');
      } catch {
        clearToken();
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    };

    bootstrapAuth();
  }, []);

  useEffect(() => {
    // Clean up stale auth cache on logout; no longer written on login
    // (auth is restored via JWT token + /api/auth/me)
    if (!userRole || !userName) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [userRole, userName]);

  useEffect(() => {
    if (!userRole && !['splash', 'login', 'register'].includes(currentScreen)) {
      setCurrentScreen('login');
      return;
    }

    if (
      userRole === 'mahasiswa' &&
      ['dosen-dashboard', 'active-session', 'report', 'student-detail', 'settings'].includes(currentScreen)
    ) {
      setCurrentScreen('mahasiswa-dashboard');
    }
  }, [currentScreen, userRole]);

  const handleLogin = (role: UserRole, name: string, idNumber: string) => {
    setUserRole(role);
    setUserName(name);
    setUserIdNumber(idNumber);
    if (role === 'dosen') {
      setCurrentScreen('dosen-dashboard');
    } else {
      setCurrentScreen('mahasiswa-dashboard');
    }
  };

  const handleLogout = () => {
    clearToken();
    setUserRole(null);
    setUserName('');
    setUserIdNumber('');
    setCurrentScreen('login');
  };

  const handleTapSuccess = async () => {
    try {
      await tapAttendance();
      toast.success('Absensi NFC berhasil tercatat');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menyimpan absensi';
      toast.error(message);
    } finally {
      setCurrentScreen('mahasiswa-dashboard');
    }
  };

  const handleViewStudentDetail = (student: Student) => {
    setSelectedStudent(student);
    setCurrentScreen('student-detail');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Toaster position="top-center" />
      
      {/* AI Chatbot - Available on all screens except splash */}
      {currentScreen !== 'splash' && (
        <Suspense fallback={null}>
          <AIChatbot />
        </Suspense>
      )}
      
      {/* Design Showcase Toggle Button */}
      {!showDesignShowcase && currentScreen !== 'splash' && (
        <Button
          onClick={() => setShowDesignShowcase(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#0052CC] to-[#003D99] hover:shadow-2xl shadow-lg rounded-full w-14 h-14 p-0"
          title="Lihat Design Showcase"
        >
          <Palette className="w-6 h-6" />
        </Button>
      )}

      {showDesignShowcase ? (
        <Suspense fallback={null}>
          <DesignShowcase onClose={() => setShowDesignShowcase(false)} />
        </Suspense>
      ) : (
        <>
          {currentScreen === 'splash' && (
            <SplashScreen onStart={() => setCurrentScreen('login')} />
          )}

          {currentScreen === 'login' && (
            <LoginPage
              onLogin={handleLogin}
              onRegister={() => setCurrentScreen('register')}
            />
          )}

          {currentScreen === 'register' && (
            <RegisterPage onBack={() => setCurrentScreen('login')} />
          )}

          {currentScreen === 'dosen-dashboard' && (
            <DosenDashboard
              userName={userName}
              onCreateSession={() => setCurrentScreen('active-session')}
              onViewSession={() => setCurrentScreen('active-session')}
              onViewReport={() => setCurrentScreen('report')}
              onSettings={() => setCurrentScreen('settings')}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === 'mahasiswa-dashboard' && (
            <MahasiswaDashboard
              userName={userName}
              userIdNumber={userIdNumber}
              onTapNFC={() => setCurrentScreen('nfc-scan')}
            />
          )}

          {currentScreen === 'nfc-scan' && (
            <NFCScanOverlay
              onSuccess={handleTapSuccess}
              onBack={() => setCurrentScreen('mahasiswa-dashboard')}
            />
          )}

          {currentScreen === 'active-session' && (
            <ActiveSession
              onBack={() => setCurrentScreen('dosen-dashboard')}
            />
          )}

          {currentScreen === 'report' && (
            <AttendanceReport
              onBack={() => setCurrentScreen('dosen-dashboard')}
              onViewDetail={handleViewStudentDetail}
            />
          )}

          {currentScreen === 'student-detail' && selectedStudent && (
            <StudentDetail
              student={selectedStudent}
              onBack={() => setCurrentScreen('report')}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsPage
              userName={userName}
              userRole={userRole}
              onBack={() => setCurrentScreen('dosen-dashboard')}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;