import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, TrendingUp, MessageCircle, Target, CheckCircle, Code } from 'lucide-react';

export function AIMethodologyDoc() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl text-gray-900 mb-2">Metode AI yang Digunakan</h2>
        <p className="text-gray-600">Sistem Absensi UNISMUH menggunakan 3 metode AI sederhana dan efektif</p>
      </div>

      {/* Method 1 */}
      <Card className="p-6 border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <Badge className="mb-2 bg-blue-100 text-blue-700">Metode #1</Badge>
            <h3 className="text-gray-900 mb-2">Analisis Pola Kehadiran</h3>
            <p className="text-sm text-gray-600">
              Menggunakan algoritma <strong>Moving Average + Trend Analysis</strong>
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-white rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Cara Kerja:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Sistem menghitung rata-rata bergerak dari 5 pertemuan terakhir, lalu membandingkan 
                dengan performa sebelumnya untuk mendeteksi trend (meningkat/stabil/menurun).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Code className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Rumus:</strong>
              </p>
              <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
                Consistency = (recentHadir / totalRecent) × 100<br />
                Trend = compare(firstHalf, secondHalf)<br />
                Risk = f(persentase, trend, consistency)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Output:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Consistency Score (0-100), Trend Direction, Risk Level, Prediksi kehadiran
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Method 2 */}
      <Card className="p-6 border-2 border-pink-100 bg-gradient-to-br from-white to-pink-50">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <Badge className="mb-2 bg-pink-100 text-pink-700">Metode #2</Badge>
            <h3 className="text-gray-900 mb-2">Prediksi Mahasiswa Berisiko</h3>
            <p className="text-sm text-gray-600">
              Menggunakan <strong>Weighted Scoring System + Decision Tree</strong>
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-white rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Cara Kerja:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Sistem memberikan bobot pada 3 faktor utama: Persentase Kehadiran (40%), 
                Trend (30%), dan Consistency (30%). Total skor menentukan risk level.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Code className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Rumus:</strong>
              </p>
              <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
                riskScore = 0<br />
                if (persentase {'<'} 60) riskScore += 40<br />
                if (trend == 'menurun') riskScore += 30<br />
                if (consistency {'<'} 50) riskScore += 30<br />
                <br />
                riskLevel = riskScore {'>='} 60 ? 'tinggi' : 'sedang/rendah'
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Output:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Risk Score (0-100), Risk Level (rendah/sedang/tinggi), Reasons, Recommendation
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Method 3 */}
      <Card className="p-6 border-2 border-green-100 bg-gradient-to-br from-white to-green-50">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <Badge className="mb-2 bg-green-100 text-green-700">Metode #3</Badge>
            <h3 className="text-gray-900 mb-2">AI Assistant Chatbot</h3>
            <p className="text-sm text-gray-600">
              Menggunakan <strong>Rule-Based NLP + Keyword Matching</strong>
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-white rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Cara Kerja:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Chatbot menggunakan knowledge base dengan keyword matching. Ketika user bertanya, 
                sistem mencari keywords yang cocok dan memberikan response yang sesuai.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Code className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Algoritma:</strong>
              </p>
              <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
                function generateResponse(userMessage) {'{'}<br />
                &nbsp;&nbsp;keywords = extractKeywords(userMessage)<br />
                &nbsp;&nbsp;for (knowledge in knowledgeBase) {'{'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;if (match(keywords, knowledge.keywords)) {'{'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return knowledge.response<br />
                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                &nbsp;&nbsp;{'}'}<br />
                &nbsp;&nbsp;return defaultResponse<br />
                {'}'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Knowledge Base:</strong>
              </p>
              <p className="text-sm text-gray-600">
                9+ topik siap pakai: Cara absen, Syarat kehadiran, Manual marking, Export laporan, 
                Troubleshooting, AI features, dan lainnya.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <h3 className="text-white mb-3">Kenapa Metode Ini Sederhana & Efektif?</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Tidak Perlu Training Data</strong> - Algoritma berbasis rule dan statistik, 
              langsung bisa digunakan tanpa perlu melatih model.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Performa Cepat</strong> - Semua komputasi dilakukan di frontend, 
              tidak perlu server AI atau API eksternal.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Mudah Dipahami</strong> - Logika transparan dan bisa dijelaskan 
              kepada end-user (explainable AI).
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Akurat untuk Use Case</strong> - Cocok untuk prediksi kehadiran 
              yang tidak memerlukan kompleksitas tinggi.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
