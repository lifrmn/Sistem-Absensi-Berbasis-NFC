import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Brain, TrendingDown, TrendingUp, Minus, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Student } from '../App';
import { StudentRiskAnalysis, AttendancePattern } from '../utils/aiAnalytics';

interface AIPredictionCardProps {
  student: Student;
  analysis: StudentRiskAnalysis;
  pattern: AttendancePattern;
  onViewDetail?: () => void;
}

export function AIPredictionCard({ student, analysis, pattern, onViewDetail }: AIPredictionCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'tinggi':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'sedang':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'rendah':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'tinggi':
        return <AlertCircle className="w-4 h-4" />;
      case 'sedang':
        return <Info className="w-4 h-4" />;
      case 'rendah':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'meningkat':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'menurun':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stabil':
        return <Minus className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-purple-600" />
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                AI Prediction
              </Badge>
            </div>
            <h4 className="text-gray-900">{student.nama}</h4>
            <p className="text-sm text-gray-600">{student.nim}</p>
          </div>
          <Badge className={`${getRiskColor(analysis.riskLevel)} border flex items-center gap-1`}>
            {getRiskIcon(analysis.riskLevel)}
            Risk: {analysis.riskLevel.toUpperCase()}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-purple-100">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Persentase</p>
            <p className="text-gray-900">{student.persentase}%</p>
          </div>
          <div className="text-center border-x border-purple-100">
            <p className="text-xs text-gray-600 mb-1">Risk Score</p>
            <p className="text-gray-900">{analysis.riskScore}/100</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Trend</p>
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon(pattern.trend)}
              <p className="text-xs text-gray-900 capitalize">{pattern.trend}</p>
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Alasan Prediksi AI:</p>
          <div className="space-y-1">
            {analysis.reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <span className="text-purple-600 mt-0.5">•</span>
                <span className="text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">💡 Rekomendasi AI:</p>
          <p className="text-xs text-gray-800">{analysis.recommendation}</p>
        </div>

        {/* Action Button */}
        {onViewDetail && (
          <Button 
            onClick={onViewDetail}
            variant="outline" 
            className="w-full text-xs border-purple-300 hover:bg-purple-50"
          >
            Lihat Detail Lengkap
          </Button>
        )}
      </div>
    </Card>
  );
}
