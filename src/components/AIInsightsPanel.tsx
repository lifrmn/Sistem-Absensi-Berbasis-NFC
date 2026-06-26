import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { ClassInsight } from '../utils/aiAnalytics';

interface AIInsightsPanelProps {
  insights: ClassInsight[];
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const getInsightColor = (type: ClassInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getInsightIcon = (type: ClassInsight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-gray-900">AI Smart Insights</h3>
          <p className="text-sm text-gray-600">Analisis otomatis dari pola kehadiran</p>
        </div>
      </div>

      <div className="grid gap-3">
        {insights.map((insight, index) => (
          <Card 
            key={index}
            className={`p-4 border-2 transition-all hover:shadow-md ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{insight.icon}</span>
                  <Badge 
                    variant={insight.type === 'warning' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    AI Insight
                  </Badge>
                </div>
                <h4 className="text-gray-900 mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-700">{insight.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
