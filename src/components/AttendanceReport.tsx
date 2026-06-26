import { useState } from 'react';
import { ArrowLeft, Download, FileText, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
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
    toast.success('Laporan PDF sedang diunduh...');
  };

  const handleExportExcel = () => {
    toast.success('Laporan Excel sedang diunduh...');
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