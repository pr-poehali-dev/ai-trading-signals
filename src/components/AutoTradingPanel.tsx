import { TradingSignal, AutoTradeExecution } from "@/types/trading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SignalCard from "./SignalCard";
import Icon from "@/components/ui/icon";

interface AutoTradingPanelProps {
  signals: TradingSignal[];
  isGenerating: boolean;
  onToggleSignals: () => void;
  activePositions: AutoTradeExecution[];
}

const AutoTradingPanel = ({
  signals,
  isGenerating,
  onToggleSignals,
  activePositions,
}: AutoTradingPanelProps) => {
  const getPositionColor = (type: string) => {
    return type === "CALL" ? "text-green-400" : "text-red-400";
  };

  return (
    <div className="space-y-4">
      {/* AI Signals Control */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">⚡ AI Сигналы</h2>
        <Button
          onClick={onToggleSignals}
          variant={isGenerating ? "destructive" : "default"}
          size="sm"
          className={isGenerating ? "" : "bg-green-600 hover:bg-green-700"}
        >
          <Icon
            name={isGenerating ? "Square" : "Play"}
            size={16}
            className="mr-2"
          />
          {isGenerating ? "Остановить" : "Запустить"}
        </Button>
      </div>

      {/* Active Positions */}
      {activePositions.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Icon name="Activity" size={20} />
              Активные позиции ({activePositions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePositions.slice(0, 3).map((position) => (
              <div
                key={position.id}
                className="flex justify-between items-center p-3 bg-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {position.symbol}
                  </Badge>
                  <span
                    className={`font-bold ${getPositionColor(position.type)}`}
                  >
                    {position.type}
                  </span>
                  <span className="text-white">${position.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">{position.status}</Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(position.executionTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Signals List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {signals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} showAutoExecute={true} />
        ))}
        {signals.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-8">
              <Icon
                name="Bot"
                size={48}
                className="mx-auto mb-4 text-slate-500"
              />
              <p className="text-slate-300">
                {isGenerating
                  ? "Генерация AI сигналов..."
                  : "Нажмите 'Запустить' для получения сигналов"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Signal Quality Indicator */}
      {isGenerating && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">
                  AI анализ активен
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Качество сигналов</div>
                <div className="text-green-400 font-bold">
                  {signals.length > 0
                    ? `${Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length)}%`
                    : "Анализ..."}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoTradingPanel;
