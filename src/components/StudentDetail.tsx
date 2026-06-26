import { ArrowLeft, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Student } from '../App';

interface StudentDetailProps {
  student: Student;
  onBack: () => void;
}

const attendanceDetails = [
  { tanggal: '24 Okt 2025', status: 'hadir', waktu: '08:35' },
  { tanggal: '21 Okt 2025', status: 'tidak-hadir', waktu: '-' },
  { tanggal: '19 Okt 2025', status: 'hadir', waktu: '08:40' },
  { tanggal: '17 Okt 2025', status: 'hadir', waktu: '08:33' },
  { tanggal: '14 Okt 2025', status: 'tidak-hadir', waktu: '-' },
  { tanggal: '12 Okt 2025', status: 'hadir', waktu: '08:42' },
  { tanggal: '10 Okt 2025', status: 'hadir', waktu: '08:38' },
  { tanggal: '7 Okt 2025', status: 'hadir', waktu: '08:36' },
  { tanggal: '5 Okt 2025', status: 'tidak-hadir', waktu: '-' },
  { tanggal: '3 Okt 2025', status: 'hadir', waktu: '08:39' },
];

export function StudentDetail({ student, onBack }: StudentDetailProps) {
  const totalPertemuan = (student.totalHadir || 0) + (student.totalTidakHadir || 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Laporan
        </Button>

        {/* Student Profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profil Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#0052CC] to-[#003D99] rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">{student.nama.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl text-gray-900 mb-2">{student.nama}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                  <div>
                    <p className="text-sm">NIM</p>
                    <p className="text-gray-900">{student.nim}</p>
                  </div>
                  <div>
                    <p className="text-sm">Mata Kuliah</p>
                    <p className="text-gray-900">Pemrograman Web</p>
                  </div>
                  <div>
                    <p className="text-sm">Email</p>
                    <p className="text-gray-900">{student.nim.toLowerCase()}@student.unismuh.ac.id</p>
                  </div>
                  <div>
                    <p className="text-sm">Program Studi</p>
                    <p className="text-gray-900">Teknik Informatika</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Pertemuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-900">{totalPertemuan}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Hadir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-green-600">{student.totalHadir}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Tidak Hadir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-red-600">{student.totalTidakHadir}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Persentase Kehadiran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl ${(student.persentase || 0) >= 80 ? 'text-green-600' : (student.persentase || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {student.persentase}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Grafik Kehadiran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {attendanceDetails.slice(0, 10).map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={`w-full rounded-t ${item.status === 'hadir' ? 'bg-green-500' : 'bg-red-300'}`}
                    style={{ height: item.status === 'hadir' ? '80%' : '20%' }}
                  />
                  <p className="text-xs text-gray-600 transform -rotate-45 origin-top-left mt-2 whitespace-nowrap">
                    {item.tanggal.split(' ')[0]}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Hadir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-300 rounded"></div>
                <span className="text-sm text-gray-600">Tidak Hadir</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Riwayat Kehadiran Detail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceDetails.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {item.status === 'hadir' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <p className="text-gray-900">{item.tanggal}</p>
                      {item.status === 'hadir' && item.waktu && (
                        <p className="text-sm text-gray-600">Waktu: {item.waktu}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {item.status === 'hadir' ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Hadir
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Tidak Hadir
                      </Badge>
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
