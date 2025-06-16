import { TradingSignal } from "@/types/trading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface SignalCardProps {
  signal: TradingSignal;
  showAutoExecute?: boolean;
  onAutoExecute?: (signal: TradingSignal) => void;
}

const SignalCard = ({
  signal,
  showAutoExecute = false,
  onAutoExecute,
}: SignalCardProps) => {
  const getTypeColor = (type: string) => {
    return type === "CALL" ? "bg-green-600" : "bg-red-600";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-400";
    if (confidence >= 70) return "text-yellow-400";
    return "text-orange-400";
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
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-semibold">
              {signal.symbol}
            </Badge>
            <Badge className={getTypeColor(signal.type)}>{signal.type}</Badge>
            <div className="flex items-center gap-1">
              <Icon name={getTrendIcon(signal.marketTrend)} size={16} />
              <span className="text-xs text-slate-400">
                {signal.marketTrend}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-lg font-bold ${getConfidenceColor(signal.confidence)}`}
            >
              {signal.confidence}%
            </div>
            <div className="text-xs text-slate-400">{signal.expiryTime}м</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-slate-400 text-sm">Цена входа: </span>
            <span className="text-white font-semibold">
              {signal.entryPrice.toFixed(5)}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {signal.timestamp.toLocaleTimeString()}
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-3">{signal.analysis}</p>

        {showAutoExecute && signal.confidence >= 80 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">
                Высокое качество сигнала
              </span>
            </div>
            {onAutoExecute && (
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
                onClick={() => onAutoExecute(signal)}
              >
                Автосделка
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalCard;
