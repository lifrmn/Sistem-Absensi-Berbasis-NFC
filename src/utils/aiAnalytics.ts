// AI Analytics Engine untuk Sistem Absensi UNISMUH
// Menggunakan algoritma sederhana berbasis statistik dan pattern recognition

export interface AttendancePattern {
  consistency: number; // 0-100: seberapa konsisten kehadiran
  trend: 'meningkat' | 'stabil' | 'menurun';
  riskLevel: 'rendah' | 'sedang' | 'tinggi';
  prediction: string;
}

export interface StudentRiskAnalysis {
  studentId: string;
  nama: string;
  nim: string;
  riskScore: number; // 0-100
  riskLevel: 'rendah' | 'sedang' | 'tinggi';
  reasons: string[];
  recommendation: string;
}

export interface ClassInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  icon: string;
}

/**
 * METODE AI #1: Analisis Pola Kehadiran
 * Algoritma: Moving Average + Trend Analysis
 */
export function analyzeAttendancePattern(
  totalHadir: number,
  totalTidakHadir: number,
  recentAttendance: boolean[] // array 5 pertemuan terakhir
): AttendancePattern {
  const totalPertemuan = totalHadir + totalTidakHadir;
  const persentase = (totalHadir / totalPertemuan) * 100;
  
  // Hitung consistency menggunakan standar deviasi sederhana
  const recentHadirCount = recentAttendance.filter(a => a).length;
  const consistency = Math.min(100, (recentHadirCount / recentAttendance.length) * 100);
  
  // Deteksi trend dengan membandingkan 3 pertemuan pertama vs 3 terakhir
  const firstHalf = recentAttendance.slice(0, Math.floor(recentAttendance.length / 2));
  const secondHalf = recentAttendance.slice(Math.floor(recentAttendance.length / 2));
  const firstAvg = firstHalf.filter(a => a).length / firstHalf.length;
  const secondAvg = secondHalf.filter(a => a).length / secondHalf.length;
  
  let trend: 'meningkat' | 'stabil' | 'menurun' = 'stabil';
  if (secondAvg > firstAvg + 0.2) trend = 'meningkat';
  else if (secondAvg < firstAvg - 0.2) trend = 'menurun';
  
  // Tentukan risk level
  let riskLevel: 'rendah' | 'sedang' | 'tinggi' = 'rendah';
  if (persentase < 60 || trend === 'menurun') riskLevel = 'tinggi';
  else if (persentase < 75) riskLevel = 'sedang';
  
  // Generate prediction
  let prediction = '';
  if (riskLevel === 'tinggi') {
    prediction = 'Mahasiswa berisiko tidak memenuhi syarat kehadiran minimal (75%)';
  } else if (riskLevel === 'sedang') {
    prediction = 'Mahasiswa perlu meningkatkan kehadiran untuk aman';
  } else {
    prediction = 'Mahasiswa dalam kondisi baik dan konsisten hadir';
  }
  
  return { consistency, trend, riskLevel, prediction };
}

/**
 * METODE AI #2: Prediksi Mahasiswa Berisiko
 * Algoritma: Weighted Scoring + Decision Tree
 */
export function predictStudentRisk(
  persentase: number,
  recentAttendance: boolean[],
  totalPertemuan: number
): StudentRiskAnalysis {
  const pattern = analyzeAttendancePattern(
    recentAttendance.filter(a => a).length,
    recentAttendance.filter(a => !a).length,
    recentAttendance
  );
  
  // Weighted scoring system
  let riskScore = 0;
  const reasons: string[] = [];
  
  // Factor 1: Persentase kehadiran (bobot 40%)
  if (persentase < 60) {
    riskScore += 40;
    reasons.push(`Persentase kehadiran rendah (${persentase.toFixed(0)}%)`);
  } else if (persentase < 75) {
    riskScore += 25;
    reasons.push(`Persentase mendekati batas minimal (${persentase.toFixed(0)}%)`);
  } else if (persentase < 85) {
    riskScore += 10;
  }
  
  // Factor 2: Trend kehadiran (bobot 30%)
  if (pattern.trend === 'menurun') {
    riskScore += 30;
    reasons.push('Tren kehadiran menurun dalam 5 pertemuan terakhir');
  } else if (pattern.trend === 'stabil' && persentase < 75) {
    riskScore += 15;
  }
  
  // Factor 3: Consistency (bobot 30%)
  if (pattern.consistency < 50) {
    riskScore += 30;
    reasons.push('Pola kehadiran tidak konsisten');
  } else if (pattern.consistency < 70) {
    riskScore += 15;
  }
  
  // Tentukan risk level
  let riskLevel: 'rendah' | 'sedang' | 'tinggi' = 'rendah';
  if (riskScore >= 60) riskLevel = 'tinggi';
  else if (riskScore >= 30) riskLevel = 'sedang';
  
  // Generate recommendation
  let recommendation = '';
  if (riskLevel === 'tinggi') {
    recommendation = 'Segera hubungi mahasiswa dan berikan peringatan formal. Pertimbangkan konseling akademik.';
  } else if (riskLevel === 'sedang') {
    recommendation = 'Berikan reminder dan motivasi untuk meningkatkan kehadiran.';
  } else {
    recommendation = 'Berikan apresiasi untuk kehadiran yang baik.';
  }
  
  if (reasons.length === 0) {
    reasons.push('Mahasiswa memiliki kehadiran yang sangat baik');
  }
  
  return {
    studentId: '',
    nama: '',
    nim: '',
    riskScore: Math.min(100, riskScore),
    riskLevel,
    reasons,
    recommendation
  };
}

/**
 * METODE AI #3: Smart Insights Generator
 * Algoritma: Statistical Analysis + Pattern Recognition
 */
export function generateClassInsights(students: Array<{
  persentase?: number;
  totalHadir?: number;
  totalTidakHadir?: number;
}>): ClassInsight[] {
  const insights: ClassInsight[] = [];
  
  if (students.length === 0) return insights;
  
  // Hitung statistik kelas
  const persentaseList = students.map(s => s.persentase || 0);
  const avgPersentase = persentaseList.reduce((a, b) => a + b, 0) / persentaseList.length;
  const highAttendance = students.filter(s => (s.persentase || 0) >= 85).length;
  const lowAttendance = students.filter(s => (s.persentase || 0) < 60).length;
  const mediumAttendance = students.filter(s => (s.persentase || 0) >= 60 && (s.persentase || 0) < 85).length;
  
  // Insight 1: Overall performance
  if (avgPersentase >= 80) {
    insights.push({
      type: 'positive',
      title: 'Performa Kelas Sangat Baik',
      description: `Rata-rata kehadiran kelas ${avgPersentase.toFixed(1)}%. Pertahankan kualitas pembelajaran!`,
      icon: '🎉'
    });
  } else if (avgPersentase >= 70) {
    insights.push({
      type: 'info',
      title: 'Performa Kelas Cukup Baik',
      description: `Rata-rata kehadiran ${avgPersentase.toFixed(1)}%. Ada ruang untuk peningkatan.`,
      icon: '📊'
    });
  } else {
    insights.push({
      type: 'warning',
      title: 'Perhatian: Kehadiran Kelas Rendah',
      description: `Rata-rata kehadiran hanya ${avgPersentase.toFixed(1)}%. Diperlukan intervensi segera.`,
      icon: '⚠️'
    });
  }
  
  // Insight 2: Risk students
  if (lowAttendance > 0) {
    const percentage = (lowAttendance / students.length * 100).toFixed(0);
    insights.push({
      type: 'warning',
      title: `${lowAttendance} Mahasiswa Berisiko Tinggi`,
      description: `${percentage}% mahasiswa memiliki kehadiran <60%. Segera lakukan follow-up.`,
      icon: '🚨'
    });
  }
  
  // Insight 3: Top performers
  if (highAttendance > 0) {
    const percentage = (highAttendance / students.length * 100).toFixed(0);
    insights.push({
      type: 'positive',
      title: `${highAttendance} Mahasiswa Berprestasi`,
      description: `${percentage}% mahasiswa memiliki kehadiran ≥85%. Berikan apresiasi!`,
      icon: '⭐'
    });
  }
  
  // Insight 4: Distribution analysis
  if (mediumAttendance > highAttendance + lowAttendance) {
    insights.push({
      type: 'info',
      title: 'Distribusi Kehadiran Terpusat',
      description: 'Sebagian besar mahasiswa berada di kategori menengah. Fokus pada peningkatan motivasi.',
      icon: '📈'
    });
  }
  
  // Insight 5: Best practices recommendation
  if (lowAttendance === 0 && avgPersentase >= 85) {
    insights.push({
      type: 'positive',
      title: 'Kelas Model',
      description: 'Tidak ada mahasiswa berisiko! Kelas ini menjadi contoh best practice.',
      icon: '🏆'
    });
  }
  
  return insights;
}

/**
 * METODE AI #4: Time-based Pattern Detection
 * Mendeteksi pola kehadiran berdasarkan waktu
 */
export function detectTimePattern(attendanceByDay: { [key: string]: number }): {
  worstDay: string;
  bestDay: string;
  recommendation: string;
} {
  const days = Object.keys(attendanceByDay);
  if (days.length === 0) {
    return {
      worstDay: '-',
      bestDay: '-',
      recommendation: 'Belum ada data untuk analisis'
    };
  }
  
  let worstDay = days[0];
  let bestDay = days[0];
  
  days.forEach(day => {
    if (attendanceByDay[day] < attendanceByDay[worstDay]) worstDay = day;
    if (attendanceByDay[day] > attendanceByDay[bestDay]) bestDay = day;
  });
  
  const diff = attendanceByDay[bestDay] - attendanceByDay[worstDay];
  let recommendation = '';
  
  if (diff > 20) {
    recommendation = `Kehadiran di hari ${worstDay} sangat rendah. Pertimbangkan untuk mengubah jadwal atau metode pembelajaran.`;
  } else if (diff > 10) {
    recommendation = `Ada perbedaan kehadiran antara ${worstDay} dan ${bestDay}. Monitor lebih lanjut.`;
  } else {
    recommendation = 'Kehadiran cukup merata di semua hari. Pertahankan!';
  }
  
  return { worstDay, bestDay, recommendation };
}

/**
 * Fungsi helper untuk generate mock data recent attendance
 */
export function generateMockRecentAttendance(persentase: number): boolean[] {
  const attendance: boolean[] = [];
  const targetHadir = Math.round((persentase / 100) * 5);
  
  for (let i = 0; i < 5; i++) {
    if (i < targetHadir) {
      attendance.push(true);
    } else {
      attendance.push(false);
    }
  }
  
  // Shuffle untuk membuat lebih realistis
  return attendance.sort(() => Math.random() - 0.5);
}
