import { BotConfig } from "@/types/trading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface BotConfigCardProps {
  config: BotConfig;
  onToggle: (id: string, active: boolean) => void;
}

const BotConfigCard = ({ config, onToggle }: BotConfigCardProps) => {
  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case "MARTINGALE":
        return "bg-red-500";
      case "ANTI_MARTINGALE":
        return "bg-green-500";
      case "FIBONACCI":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg">{config.name}</CardTitle>
          <Switch
            checked={config.isActive}
            onCheckedChange={(checked) => onToggle(config.id, checked)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Стратегия</span>
          <Badge className={getStrategyColor(config.strategy)}>
            {config.strategy}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">Базовая ставка</span>
          <span className="text-white font-semibold">${config.baseAmount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">Макс. убыток</span>
          <span className="text-red-400">${config.maxLoss}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">Take Profit</span>
          <span className="text-green-400">${config.takeProfit}</span>
        </div>

        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={16} />
            <span className="text-slate-300 text-sm">Активные пары</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {config.symbols.map((symbol) => (
              <Badge key={symbol} variant="outline" className="text-xs">
                {symbol}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotConfigCard;
