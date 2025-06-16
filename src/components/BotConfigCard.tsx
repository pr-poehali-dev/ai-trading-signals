import { useState } from "react";
import { AutoTradingBot } from "@/types/trading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

interface BotConfigCardProps {
  bot: AutoTradingBot;
  onToggle: (id: string, active: boolean) => void;
  onStartAuto: (id: string) => void;
  onStopAuto: (id: string) => void;
}

const BotConfigCard = ({
  bot,
  onToggle,
  onStartAuto,
  onStopAuto,
}: BotConfigCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "PAUSED":
        return "bg-yellow-500";
      case "STOPPED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
          <div className="flex items-center gap-3">
            <CardTitle className="text-white text-lg">{bot.name}</CardTitle>
            <Badge className={getStatusColor(bot.status)}>{bot.status}</Badge>
          </div>
          <Switch
            checked={bot.isActive}
            onCheckedChange={(checked) => onToggle(bot.id, checked)}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Автоисполнение */}
        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={16} className="text-yellow-400" />
            <span className="text-white font-medium">Автоторговля</span>
          </div>
          <div className="flex items-center gap-2">
            {bot.autoExecution ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onStopAuto(bot.id)}
              >
                Остановить
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onStartAuto(bot.id)}
              >
                Запустить
              </Button>
            )}
          </div>
        </div>

        {/* Производительность */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-300">Винрейт</span>
            <span className="text-green-400 font-bold">
              {bot.performance.winRate.toFixed(1)}%
            </span>
          </div>
          <Progress value={bot.performance.winRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              ${bot.performance.totalProfit.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400">Общая прибыль</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {bot.performance.todayTrades}
            </div>
            <div className="text-xs text-slate-400">Сделок сегодня</div>
          </div>
        </div>

        {/* Кнопка разворота */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-slate-300 hover:text-white"
        >
          {isExpanded ? "Скрыть настройки" : "Показать настройки"}
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>

        {/* Расширенные настройки */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Стратегия</span>
              <Badge className={getStrategyColor(bot.strategy)}>
                {bot.strategy}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Мин. уверенность</span>
              <span className="text-white font-semibold">
                {bot.minConfidence}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Макс. сделок/день</span>
              <span className="text-white font-semibold">
                {bot.maxDailyTrades}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Дневной лимит</span>
              <span className="text-red-400">
                ${bot.riskManagement.dailyLossLimit}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Target" size={16} />
                <span className="text-slate-300 text-sm">Торговые пары</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {bot.symbols.map((symbol) => (
                  <Badge key={symbol} variant="outline" className="text-xs">
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BotConfigCard;
