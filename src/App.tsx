import { useState } from 'react';
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
import { DesignShowcase } from './components/DesignShowcase';
import { AIChatbot } from './components/AIChatbot';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Palette } from 'lucide-react';

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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDesignShowcase, setShowDesignShowcase] = useState<boolean>(false);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    if (role === 'dosen') {
      setCurrentScreen('dosen-dashboard');
    } else {
      setCurrentScreen('mahasiswa-dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
    setCurrentScreen('login');
  };

  const handleViewStudentDetail = (student: Student) => {
    setSelectedStudent(student);
    setCurrentScreen('student-detail');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Toaster position="top-center" />
      
      {/* AI Chatbot - Available on all screens except splash */}
      {currentScreen !== 'splash' && <AIChatbot />}
      
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
        <DesignShowcase onClose={() => setShowDesignShowcase(false)} />
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
          onTapNFC={() => setCurrentScreen('nfc-scan')}
        />
      )}

      {currentScreen === 'nfc-scan' && (
        <NFCScanOverlay 
          onSuccess={() => setCurrentScreen('mahasiswa-dashboard')}
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