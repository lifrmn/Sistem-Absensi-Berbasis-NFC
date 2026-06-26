import { useEffect, useState } from 'react';
import { Nfc, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { getMahasiswaAttendanceSummary } from '../utils/apiClient';

interface MahasiswaDashboardProps {
  userName: string;
  userIdNumber: string;
  onTapNFC: () => void;
}

export function MahasiswaDashboard({ userName, userIdNumber, onTapNFC }: MahasiswaDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttendedToday, setHasAttendedToday] = useState(false);
  const [todayAttendanceTime, setTodayAttendanceTime] = useState<string | null>(null);
  const [totalHadir, setTotalHadir] = useState(0);
  const [persentase, setPersentase] = useState(0);
  const [attendanceHistory, setAttendanceHistory] = useState<Array<{
    date: string;
    mataKuliah: string;
    status: 'hadir' | 'tidak-hadir';
    waktu: string;
  }>>([]);

  useEffect(() => {
    const loadAttendanceSummary = async () => {
      try {
        setIsLoading(true);
        const summary = await getMahasiswaAttendanceSummary();
        setHasAttendedToday(summary.hasAttendedToday);
        setTodayAttendanceTime(summary.todayAttendanceTime);
        setTotalHadir(summary.totalHadir);
        setPersentase(summary.persentase);
        setAttendanceHistory(summary.history);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Gagal memuat data kehadiran');
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendanceSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center text-gray-600">
        Memuat data kehadiran...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0052CC] via-[#0052CC] to-[#003D99] text-white p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FFC107]/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Nfc className="w-6 h-6 animate-pulse-nfc" />
            </div>
            <div>
              <h1 className="text-xl tracking-tight">Absensi NFC</h1>
              <p className="text-white/80 text-sm">Informatika UNISMUH</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 -mt-8">
        {/* Profile Card */}
        <Card className="mb-6 shadow-xl border-2 border-white bg-gradient-to-br from-white to-blue-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarImage src="https://images.unsplash.com/photo-1655977237812-ee6beb137203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTQ1MzQ3OHww&ixlib=rb-4.1.0&q=80&w=1080" />
                  <AvatarFallback className="bg-gradient-to-br from-[#0052CC] to-[#003D99] text-white text-xl">{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-900">{userName}</h2>
                <p className="text-gray-600 text-sm">NIM: {userIdNumber || '—'}</p>
                <Badge className="mt-1 bg-[#0052CC]/10 text-[#0052CC] hover:bg-[#0052CC]/10 text-xs">Mahasiswa Aktif</Badge>
              </div>
            </div>

            {/* Today's Status */}
            <div className={`rounded-xl p-5 mb-4 border-2 ${hasAttendedToday ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'}`}>
              <div className="flex items-center gap-3">
                {hasAttendedToday ? (
                  <>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Status Kehadiran Hari Ini</p>
                      <p className="text-green-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Hadir - Pukul {todayAttendanceTime || '-'}</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-orange-100 rounded-full animate-pulse">
                      <Clock className="w-7 h-7 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Status Kehadiran Hari Ini</p>
                      <p className="text-orange-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        <span>Belum Tap - Segera lakukan tap NFC!</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tap NFC Button */}
            <Button 
              onClick={onTapNFC}
              className={`w-full py-7 text-lg shadow-lg transition-all duration-300 ${
                hasAttendedToday 
                  ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#0052CC] to-[#003D99] hover:shadow-xl hover:scale-[1.02]'
              }`}
              disabled={hasAttendedToday}
            >
              <Nfc className="w-6 h-6 mr-2" />
              {hasAttendedToday ? 'Sudah Absen Hari Ini' : 'Tap NFC Sekarang'}
            </Button>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Total Hadir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-green-600 mb-1">{totalHadir}</div>
              <p className="text-sm text-gray-500">Kehadiran</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#0052CC] shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#0052CC]"></div>
                Persentase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl bg-gradient-to-r from-[#0052CC] to-[#003D99] bg-clip-text text-transparent mb-1">{persentase}%</div>
              <p className="text-sm text-gray-500">Kehadiran</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Riwayat Kehadiran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceHistory.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-gray-900">{item.mataKuliah}</p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                  <div className="text-right">
                    {item.status === 'hadir' ? (
                      <>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Hadir
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{item.waktu}</p>
                      </>
                    ) : (
                      <Badge variant="destructive">Tidak Hadir</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
