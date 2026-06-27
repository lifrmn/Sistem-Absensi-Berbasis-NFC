import { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, FileText, Settings, LogOut, Users, Nfc, Plus, Brain, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { getDashboardStats } from '../utils/apiClient';

interface DosenDashboardProps {
  userName: string;
  onCreateSession: () => void;
  onViewSession: () => void;
  onViewReport: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function DosenDashboard({ 
  userName, 
  onCreateSession, 
  onViewSession, 
  onViewReport, 
  onSettings, 
  onLogout 
}: DosenDashboardProps) {
  const [stats, setStats] = useState({
    totalSesiHariIni: 0,
    totalHadir: 0,
    totalMahasiswa: 0,
    persenHadir: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response);
      } catch {
        setStats({ totalSesiHariIni: 0, totalHadir: 0, totalMahasiswa: 0, persenHadir: 0 });
      }
    };

    loadStats();
  }, []);

  return (
    <div className="relative flex min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(14,116,144,0.1),transparent_30%),radial-gradient(circle_at_85%_5%,rgba(59,130,246,0.12),transparent_30%),#f5f9ff]">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,rgba(2,6,23,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.04)_1px,transparent_1px)] bg-[size:44px_44px]"></div>
      {/* Sidebar */}
      <aside className="w-64 bg-white/85 backdrop-blur-md shadow-xl hidden md:block border-r border-white/70 relative z-10">
        <div className="p-6 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#0052CC] to-[#003D99] rounded-lg p-2 shadow-md">
              <Nfc className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[#0052CC] font-display text-lg">UNISMUH</h2>
              <p className="text-sm text-slate-600">Sistem Absensi</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#0a3d9c] text-white shadow-md">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={onViewSession}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Sesi Aktif</span>
          </button>
          <button 
            onClick={onViewReport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Laporan</span>
          </button>
          <button 
            onClick={onSettings}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Dosen Control Panel
          </div>
          <h1 className="text-3xl text-slate-900 mb-2 font-display">
            Selamat Datang, Dosen {userName}
          </h1>
          <p className="text-slate-600">Dashboard monitoring kehadiran dengan insight real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Sesi Hari Ini</CardTitle>
              <div className="p-2 bg-[#0052CC]/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-[#0052CC]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl mb-1 bg-gradient-to-r from-[#0052CC] to-[#003D99] bg-clip-text text-transparent">{stats.totalSesiHariIni}</div>
              <p className="text-sm text-gray-600">Sesi aktif berlangsung</p>
            </CardContent>
          </Card>

          <Card className="border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Jumlah Mahasiswa Hadir</CardTitle>
              <div className="p-2 bg-[#FFC107]/10 rounded-lg">
                <Users className="w-5 h-5 text-[#FFC107]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl mb-1 text-[#FFC107]">{stats.totalHadir}</div>
              <p className="text-sm text-gray-600">dari {stats.totalMahasiswa} mahasiswa ({stats.persenHadir}%)</p>
            </CardContent>
          </Card>

          <Card className="border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Status NFC</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Nfc className="w-5 h-5 text-green-600 animate-pulse-nfc" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-3xl mb-1 text-green-600">Aktif</div>
              </div>
              <p className="text-sm text-gray-600">Sistem berjalan normal</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Features Banner */}
        <Card className="mb-8 border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 via-sky-50 to-amber-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-600 to-sky-700 rounded-xl shadow-md">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-slate-900 font-display">Fitur AI Tersedia</h3>
                  <Badge className="bg-gradient-to-r from-cyan-600 to-sky-700 text-white">NEW</Badge>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Sistem kami sekarang dilengkapi dengan 3 fitur AI untuk membantu analisis kehadiran:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-cyan-700 flex-shrink-0" />
                    <span className="text-slate-700">Smart Insights & Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4 text-sky-700 flex-shrink-0" />
                    <span className="text-slate-700">Prediksi Mahasiswa Berisiko</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-cyan-700 flex-shrink-0" />
                    <span className="text-slate-700">AI Assistant Chatbot</span>
                  </div>
                </div>
                <Button 
                  onClick={onViewReport}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-700 hover:to-sky-800"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Coba Fitur AI Sekarang
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border border-white/80 bg-white/85 backdrop-blur-sm" onClick={onCreateSession}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-[#0052CC] transition-colors">
                <div className="p-2 bg-[#0052CC]/10 rounded-lg group-hover:bg-[#0052CC] transition-colors">
                  <Plus className="w-5 h-5 group-hover:text-white transition-colors" />
                </div>
                Buat Sesi Baru
              </CardTitle>
              <CardDescription>
                Mulai sesi absensi untuk mata kuliah baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#0052CC] hover:bg-[#003D99] shadow-md hover:shadow-lg transition-all">
                <Nfc className="w-4 h-4 mr-2" />
                Buat Sesi NFC
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border border-white/80 bg-white/85 backdrop-blur-sm" onClick={onViewSession}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-[#0052CC] transition-colors">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-[#0052CC]/10 transition-colors">
                  <BookOpen className="w-5 h-5 text-[#0052CC]" />
                </div>
                Lihat Sesi Aktif
              </CardTitle>
              <CardDescription>
                Monitoring kehadiran mahasiswa real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-2 border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white transition-all">
                Buka Sesi Aktif
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border border-white/80 bg-white/85 backdrop-blur-sm" onClick={onViewReport}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-[#FFC107] transition-colors">
                <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-[#FFC107]/10 transition-colors">
                  <FileText className="w-5 h-5 text-[#FFC107]" />
                </div>
                Laporan Kehadiran
              </CardTitle>
              <CardDescription>
                Lihat dan export laporan kehadiran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-2 border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-white transition-all">
                Lihat Laporan
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border border-white/80 bg-white/85 backdrop-blur-sm" onClick={onSettings}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-gray-700 transition-colors">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                Pengaturan
              </CardTitle>
              <CardDescription>
                Kelola profil dan preferensi sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-2 hover:bg-gray-50 transition-all">
                Buka Pengaturan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4">
          <div className="flex justify-around">
            <button className="flex flex-col items-center gap-1 text-[#0052CC]">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </button>
            <button onClick={onViewSession} className="flex flex-col items-center gap-1 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Sesi</span>
            </button>
            <button onClick={onViewReport} className="flex flex-col items-center gap-1 text-gray-600">
              <FileText className="w-5 h-5" />
              <span className="text-xs">Laporan</span>
            </button>
            <button onClick={onSettings} className="flex flex-col items-center gap-1 text-gray-600">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Pengaturan</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}