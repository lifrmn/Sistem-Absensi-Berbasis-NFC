import { useState } from 'react';
import { ArrowLeft, Download, FileText, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Student } from '../App';
import { AIInsightsPanel } from './AIInsightsPanel';
import { AIPredictionCard } from './AIPredictionCard';
import { 
  generateClassInsights, 
  predictStudentRisk, 
  analyzeAttendancePattern,
  generateMockRecentAttendance
} from '../utils/aiAnalytics';

interface AttendanceReportProps {
  onBack: () => void;
  onViewDetail: (student: Student) => void;
}

const mockReportData: Student[] = [
  { id: '1', nama: 'Ahmad Rasyid', nim: 'A001', totalHadir: 12, totalTidakHadir: 3, persentase: 80, status: 'hadir' },
  { id: '2', nama: 'Budi Santoso', nim: 'A002', totalHadir: 8, totalTidakHadir: 7, persentase: 53, status: 'hadir' },
  { id: '3', nama: 'Citra Dewi', nim: 'A003', totalHadir: 14, totalTidakHadir: 1, persentase: 93, status: 'hadir' },
  { id: '4', nama: 'Deni Pratama', nim: 'A004', totalHadir: 11, totalTidakHadir: 4, persentase: 73, status: 'hadir' },
  { id: '5', nama: 'Eka Putri', nim: 'A005', totalHadir: 13, totalTidakHadir: 2, persentase: 87, status: 'hadir' },
  { id: '6', nama: 'Dinda Fadila', nim: 'A006', totalHadir: 9, totalTidakHadir: 6, persentase: 60, status: 'hadir' },
  { id: '7', nama: 'Fajar Ramadhan', nim: 'A007', totalHadir: 10, totalTidakHadir: 5, persentase: 67, status: 'hadir' },
  { id: '8', nama: 'Gita Permata', nim: 'A008', totalHadir: 15, totalTidakHadir: 0, persentase: 100, status: 'hadir' },
];

export function AttendanceReport({ onBack, onViewDetail }: AttendanceReportProps) {
  const [mataKuliah, setMataKuliah] = useState('pemrograman-web');
  const [periode, setPeriode] = useState('oktober');
  const [reportData] = useState<Student[]>(mockReportData);

  const selectedCourseLabel = {
    'pemrograman-web': 'Pemrograman Web',
    'basis-data': 'Basis Data',
    'algoritma': 'Algoritma & Struktur Data',
    'jaringan': 'Jaringan Komputer',
  }[mataKuliah] || 'Semua Mata Kuliah';

  const selectedPeriodLabel = {
    januari: 'Januari 2025',
    februari: 'Februari 2025',
    maret: 'Maret 2025',
    april: 'April 2025',
    mei: 'Mei 2025',
    juni: 'Juni 2025',
    juli: 'Juli 2025',
    agustus: 'Agustus 2025',
    september: 'September 2025',
    oktober: 'Oktober 2025',
    november: 'November 2025',
    desember: 'Desember 2025',
  }[periode] || 'Semua Periode';

  const createCsvContent = () => {
    const header = ['Nama', 'NIM', 'Total Hadir', 'Total Tidak Hadir', 'Persentase'];
    const rows = reportData.map((student) => [
      student.nama,
      student.nim,
      String(student.totalHadir ?? 0),
      String(student.totalTidakHadir ?? 0),
      `${student.persentase ?? 0}%`,
    ]);

    return [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  const downloadBlob = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate AI insights
  const classInsights = generateClassInsights(reportData);
  
  // Analyze students at risk
  const studentsWithRisk = reportData.map(student => {
    const recentAttendance = generateMockRecentAttendance(student.persentase || 0);
    const riskAnalysis = predictStudentRisk(
      student.persentase || 0,
      recentAttendance,
      (student.totalHadir || 0) + (student.totalTidakHadir || 0)
    );
    const pattern = analyzeAttendancePattern(
      student.totalHadir || 0,
      student.totalTidakHadir || 0,
      recentAttendance
    );
    return {
      student,
      riskAnalysis: { ...riskAnalysis, studentId: student.id, nama: student.nama, nim: student.nim },
      pattern
    };
  }).sort((a, b) => b.riskAnalysis.riskScore - a.riskAnalysis.riskScore);

  const handleExportPDF = () => {
    const rows = reportData
      .map(
        (student) => `
          <tr>
            <td>${student.nama}</td>
            <td>${student.nim}</td>
            <td>${student.totalHadir ?? 0}</td>
            <td>${student.totalTidakHadir ?? 0}</td>
            <td>${student.persentase ?? 0}%</td>
          </tr>
        `,
      )
      .join('');

    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) {
      toast.error('Popup browser diblokir. Izinkan popup untuk export PDF.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Kehadiran - ${selectedPeriodLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; }
            h1 { margin-bottom: 4px; }
            p { margin: 4px 0; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Laporan Kehadiran Mahasiswa</h1>
          <p>Mata Kuliah: ${selectedCourseLabel}</p>
          <p>Periode: ${selectedPeriodLabel}</p>
          <p>Tanggal Export: ${new Date().toLocaleString('id-ID')}</p>
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIM</th>
                <th>Total Hadir</th>
                <th>Total Tidak Hadir</th>
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    toast.success('Jendela cetak laporan dibuka. Pilih Save as PDF untuk menyimpan.');
  };

  const handleExportExcel = () => {
    const fileName = `laporan-kehadiran-${periode}.csv`;
    downloadBlob(createCsvContent(), fileName, 'text/csv;charset=utf-8;');
    toast.success(`File ${fileName} berhasil diunduh.`);
  };

  const getPersentaseBadge = (persentase?: number) => {
    if (!persentase) return null;
    
    if (persentase >= 80) {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{persentase}%</Badge>;
    } else if (persentase >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">{persentase}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{persentase}%</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">Laporan Kehadiran</h1>
              <p className="text-gray-600">Rekap kehadiran mahasiswa per periode</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </Button>
              <Button 
                variant="outline"
                onClick={handleExportExcel}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Mata Kuliah</label>
              <Select value={mataKuliah} onValueChange={setMataKuliah}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pemrograman-web">Pemrograman Web</SelectItem>
                  <SelectItem value="basis-data">Basis Data</SelectItem>
                  <SelectItem value="algoritma">Algoritma & Struktur Data</SelectItem>
                  <SelectItem value="jaringan">Jaringan Komputer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Periode</label>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="januari">Januari 2025</SelectItem>
                  <SelectItem value="februari">Februari 2025</SelectItem>
                  <SelectItem value="maret">Maret 2025</SelectItem>
                  <SelectItem value="april">April 2025</SelectItem>
                  <SelectItem value="mei">Mei 2025</SelectItem>
                  <SelectItem value="juni">Juni 2025</SelectItem>
                  <SelectItem value="juli">Juli 2025</SelectItem>
                  <SelectItem value="agustus">Agustus 2025</SelectItem>
                  <SelectItem value="september">September 2025</SelectItem>
                  <SelectItem value="oktober">Oktober 2025</SelectItem>
                  <SelectItem value="november">November 2025</SelectItem>
                  <SelectItem value="desember">Desember 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-1">Total Mahasiswa</p>
            <p className="text-3xl text-gray-900">{reportData.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-1">Rata-rata Kehadiran</p>
            <p className="text-3xl text-green-600">
              {Math.round(reportData.reduce((acc, s) => acc + (s.persentase || 0), 0) / reportData.length)}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-1">Kehadiran ≥ 80%</p>
            <p className="text-3xl text-[#0052CC]">
              {reportData.filter(s => (s.persentase || 0) >= 80).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-1">Kehadiran {'<'} 60%</p>
            <p className="text-3xl text-red-600">
              {reportData.filter(s => (s.persentase || 0) < 60).length}
            </p>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mb-6">
          <AIInsightsPanel insights={classInsights} />
        </div>

        {/* Tabs for Data View and AI Predictions */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="table">Data Kehadiran</TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead className="text-center">Total Hadir</TableHead>
                    <TableHead className="text-center">Total Tidak Hadir</TableHead>
                    <TableHead className="text-center">Persentase</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell>{student.nama}</TableCell>
                      <TableCell>{student.nim}</TableCell>
                      <TableCell className="text-center">{student.totalHadir}</TableCell>
                      <TableCell className="text-center">{student.totalTidakHadir}</TableCell>
                      <TableCell className="text-center">
                        {getPersentaseBadge(student.persentase)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onViewDetail(student)}
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

          <TabsContent value="ai">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentsWithRisk.map(({ student, riskAnalysis, pattern }) => (
                <AIPredictionCard
                  key={student.id}
                  student={student}
                  analysis={riskAnalysis}
                  pattern={pattern}
                  onViewDetail={() => onViewDetail(student)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}