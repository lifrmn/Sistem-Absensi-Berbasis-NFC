import { useEffect, useState } from 'react';
import { ArrowLeft, Send, UserCheck, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Student } from '../App';
import { getActiveSession, markManualAttendance, sendSessionNotification } from '../utils/apiClient';

interface ActiveSessionProps {
  onBack: () => void;
}

export function ActiveSession({ onBack }: ActiveSessionProps) {
  const [studentsPresent, setStudentsPresent] = useState<Student[]>([]);
  const [studentsAbsent, setStudentsAbsent] = useState<Student[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionCourse, setSessionCourse] = useState('pemrograman-web');
  const [isLoading, setIsLoading] = useState(true);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [manualReason, setManualReason] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const loadSession = async () => {
    try {
      setIsLoading(true);
      const response = await getActiveSession();
      setSessionId(response.session.id);
      setSessionCourse(response.session.course);
      setStudentsPresent(response.present);
      setStudentsAbsent(response.absent);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memuat sesi aktif');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const handleMarkManual = (student: Student) => {
    setSelectedStudent(student);
    setShowManualDialog(true);
  };

  const handleConfirmManual = async () => {
    if (!selectedStudent || !manualReason.trim() || !sessionId) {
      toast.error('Alasan harus diisi');
      return;
    }

    try {
      await markManualAttendance(sessionId, Number(selectedStudent.id), manualReason.trim());
      toast.success(`${selectedStudent.nama} berhasil ditandai hadir secara manual`);
      setShowManualDialog(false);
      setManualReason('');
      setSelectedStudent(null);
      await loadSession();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menandai manual');
    }
  };

  const handleSendNotification = async () => {
    if (studentsAbsent.length === 0) {
      toast.error('Tidak ada mahasiswa yang perlu dikirim notifikasi');
      return;
    }

    if (!sessionId) {
      toast.error('Sesi aktif tidak ditemukan');
      return;
    }

    try {
      const result = await sendSessionNotification(sessionId);
      toast.success(`Notifikasi berhasil dikirim ke ${result.count} mahasiswa`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim notifikasi');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(14,116,144,0.1),transparent_30%),#f5f9ff] p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center text-slate-500 py-20">Memuat sesi aktif...</div>
      </div>
    );
  }

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailDialog(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(14,116,144,0.1),transparent_30%),radial-gradient(circle_at_85%_5%,rgba(59,130,246,0.12),transparent_30%),#f5f9ff] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-slate-900 mb-2 font-display">Sesi Absensi</h1>
              <p className="text-slate-600">Mata Kuliah: <span className="capitalize">{sessionCourse.replace(/-/g, ' ')}</span></p>
              <p className="text-sm text-slate-500">Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right bg-white/85 backdrop-blur-sm border border-white/70 shadow-md rounded-2xl px-6 py-4">
              <div className="text-4xl text-[#0052CC] font-display">{studentsPresent.length}</div>
              <p className="text-sm text-slate-600">dari {studentsPresent.length + studentsAbsent.length} mahasiswa</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="hadir" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="hadir" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Hadir ({studentsPresent.length})
            </TabsTrigger>
            <TabsTrigger value="belum-hadir" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Belum Hadir ({studentsAbsent.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Hadir */}
          <TabsContent value="hadir">
            <div className="bg-white/85 backdrop-blur-sm border border-white/70 shadow-md rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Waktu Tap</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsPresent.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell>{student.nama}</TableCell>
                      <TableCell>{student.nim}</TableCell>
                      <TableCell>{student.waktuTap}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Hadir
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetail(student)}
                        >
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tab: Belum Hadir */}
          <TabsContent value="belum-hadir">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={handleSendNotification}
                  className="bg-gradient-to-r from-[#0052CC] to-[#0a3d9c] hover:from-[#0049b7] hover:to-[#07317f]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Notifikasi
                </Button>
                <p className="text-sm text-slate-600 flex items-center">
                  Kirim pengingat ke semua mahasiswa yang belum hadir
                </p>
              </div>

              <div className="bg-white/85 backdrop-blur-sm border border-white/70 shadow-md rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsAbsent.map((student) => (
                      <TableRow key={student.id} className="hover:bg-slate-50">
                        <TableCell>{student.nama}</TableCell>
                        <TableCell>{student.nim}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Belum Tap</Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">-</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkManual(student)}
                          >
                            Tandai Manual Hadir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal: Tandai Manual Hadir */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tandai Manual Hadir</DialogTitle>
            <DialogDescription>
              Tandai mahasiswa hadir secara manual dengan alasan
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Nama Mahasiswa</p>
                <p className="text-gray-900">{selectedStudent.nama}</p>
                <p className="text-sm text-gray-600 mt-2">NIM</p>
                <p className="text-gray-900">{selectedStudent.nim}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Alasan</Label>
                <Textarea
                  id="reason"
                  placeholder="Contoh: HP tidak support NFC, izin sakit dengan surat keterangan, dll."
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleConfirmManual}
              className="bg-[#0052CC] hover:bg-[#003D99]"
            >
              Simpan Manual
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detail Tap */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Tap Mahasiswa</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="text-gray-900">{selectedStudent.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NIM:</span>
                  <span className="text-gray-900">{selectedStudent.nim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu Tap:</span>
                  <span className="text-gray-900">{selectedStudent.waktuTap || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Perangkat:</span>
                  <span className="text-gray-900">Samsung Galaxy A54</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lokasi NFC:</span>
                  <span className="text-gray-900">Ruang 301 - Gedung A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Hadir
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowDetailDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
