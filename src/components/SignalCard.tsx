import { TradingSignal } from "@/types/trading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface SignalCardProps {
  signal: TradingSignal;
}

const SignalCard = ({ signal }: SignalCardProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "BULLISH":
        return "TrendingUp";
      case "BEARISH":
        return "TrendingDown";
      default:
        return "Minus";
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg">{signal.symbol}</CardTitle>
          <Badge variant={signal.type === "CALL" ? "default" : "destructive"}>
            {signal.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Уверенность</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${getConfidenceColor(signal.confidence)}`}
            />
            <span className="text-white font-semibold">
              {signal.confidence}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">Тренд</span>
          <div className="flex items-center gap-2">
            <Icon name={getTrendIcon(signal.marketTrend)} size={16} />
            <span className="text-white">{signal.marketTrend}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">Экспирация</span>
          <span className="text-white">{signal.expiryTime} мин</span>
        </div>

        <div className="pt-2 border-t border-slate-700">
          <p className="text-slate-300 text-sm">{signal.analysis}</p>
        </div>

        <div className="text-xs text-slate-400">
          {signal.timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalCard;
