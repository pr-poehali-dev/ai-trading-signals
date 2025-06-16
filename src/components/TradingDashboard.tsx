import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignalCard from "./SignalCard";
import BotConfigCard from "./BotConfigCard";
import MarketDataCard from "./MarketDataCard";
import AutoTradingPanel from "./AutoTradingPanel";
import { useDerivAPI } from "@/hooks/useDerivAPI";
import { aiSignalsService } from "@/services/aiSignals";
import { TradingSignal, AutoTradingBot } from "@/types/trading";
import Icon from "@/components/ui/icon";

const TradingDashboard = () => {
  const {
    account,
    marketData,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    executeAutoTrade,
    startAutoBot,
    stopAutoBot,
    getActivePositions,
  } = useDerivAPI();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [apiToken, setApiToken] = useState("");
  const [appId, setAppId] = useState("1089");
  const [isGeneratingSignals, setIsGeneratingSignals] = useState(false);
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);

  const [autoBots] = useState<AutoTradingBot[]>([
    {
      id: "1",
      name: "🚀 AI Скальпер",
      isActive: true,
      autoExecution: false,
      strategy: "MARTINGALE",
      baseAmount: 10,
      maxLoss: 100,
      takeProfit: 50,
      minConfidence: 80,
      maxDailyTrades: 50,
      tradingHours: { start: "09:00", end: "21:00" },
      symbols: ["EUR/USD", "GBP/USD"],
      status: "STOPPED",
      riskManagement: {
        maxDrawdown: 20,
        stopLossPercent: 5,
        takeProfitPercent: 10,
        maxConsecutiveLosses: 3,
        dailyLossLimit: 200,
      },
      performance: {
        totalTrades: 247,
        winRate: 68.4,
        totalProfit: 1250.3,
        todayTrades: 12,
        consecutiveLosses: 0,
        maxDrawdown: 15.2,
      },
    },
    {
      id: "2",
      name: "📈 Тренд Фоловер",
      isActive: false,
      autoExecution: false,
      strategy: "ANTI_MARTINGALE",
      baseAmount: 15,
      maxLoss: 150,
      takeProfit: 100,
      minConfidence: 75,
      maxDailyTrades: 30,
      tradingHours: { start: "08:00", end: "22:00" },
      symbols: ["USD/JPY", "AUD/USD", "USD/CHF"],
      status: "PAUSED",
      riskManagement: {
        maxDrawdown: 15,
        stopLossPercent: 4,
        takeProfitPercent: 8,
        maxConsecutiveLosses: 2,
        dailyLossLimit: 300,
      },
      performance: {
        totalTrades: 189,
        winRate: 72.1,
        totalProfit: 890.75,
        todayTrades: 8,
        consecutiveLosses: 1,
        maxDrawdown: 12.8,
      },
    },
  ]);

  const handleAutoTrade = async (signal: TradingSignal) => {
    const activeBot = autoBots.find(
      (bot) =>
        bot.autoExecution &&
        bot.symbols.includes(signal.symbol) &&
        signal.confidence >= bot.minConfidence,
    );

    if (activeBot && executeAutoTrade) {
      try {
        await executeAutoTrade(signal, activeBot.baseAmount, activeBot.id);
        console.log(`Автосделка выполнена: ${signal.symbol} ${signal.type}`);
      } catch (error) {
        console.error("Ошибка автосделки:", error);
      }
    }
  };

  const handleToggleSignals = () => {
    if (isGeneratingSignals) {
      aiSignalsService.stopGenerating();
      aiSignalsService.removeAutoExecution();
      setIsGeneratingSignals(false);
    } else {
      aiSignalsService.startGenerating((signal) => {
        setSignals((prev) => [signal, ...prev.slice(0, 9)]);
      });

      if (autoTradingEnabled) {
        aiSignalsService.setAutoExecution(handleAutoTrade);
      }

      setIsGeneratingSignals(true);
    }
  };

  const handleBotToggle = (id: string, active: boolean) => {
    console.log(`Bot ${id} ${active ? "activated" : "deactivated"}`);
  };

  const handleStartAutoBot = async (id: string) => {
    if (startAutoBot) {
      await startAutoBot(id);
      setAutoTradingEnabled(true);
      console.log(`Auto bot ${id} started`);
    }
  };

  const handleStopAutoBot = async (id: string) => {
    if (stopAutoBot) {
      await stopAutoBot(id);
      console.log(`Auto bot ${id} stopped`);
    }
  };

  useEffect(() => {
    return () => {
      aiSignalsService.stopGenerating();
      aiSignalsService.removeAutoExecution();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            🤖 Автоматическая торговля
          </h1>
          <div className="flex items-center gap-4">
            {autoTradingEnabled && (
              <Badge className="bg-green-600 text-white">
                <Icon name="Zap" size={16} className="mr-1" />
                Автоторговля активна
              </Badge>
            )}
            {isConnected && account && (
              <div className="text-white">
                <span className="text-sm text-slate-300">Баланс: </span>
                <span className="font-bold text-2xl">
                  ${account.balance.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Dashboard */}
        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Trading Bots */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                🤖 AI Торговые боты
              </h2>
              <div className="space-y-3">
                {autoBots.map((bot) => (
                  <BotConfigCard
                    key={bot.id}
                    bot={bot}
                    onToggle={handleBotToggle}
                    onStartAuto={handleStartAutoBot}
                    onStopAuto={handleStopAutoBot}
                  />
                ))}
              </div>
            </div>

            {/* Auto Trading Panel */}
            <AutoTradingPanel
              signals={signals}
              isGenerating={isGeneratingSignals}
              onToggleSignals={handleToggleSignals}
              activePositions={getActivePositions ? getActivePositions() : []}
            />

            {/* Market Data */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                📊 Рыночные данные
              </h2>
              <div className="space-y-3">
                {marketData.map((data) => (
                  <MarketDataCard key={data.symbol} data={data} />
                ))}
              </div>

              {/* Trading Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    📈 Статистика торговли
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Активных ботов</span>
                    <span className="text-green-400 font-bold">
                      {autoBots.filter((b) => b.autoExecution).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Сигналов сегодня</span>
                    <span className="text-blue-400 font-bold">
                      {signals.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Средний винрейт</span>
                    <span className="text-green-400 font-bold">
                      {(
                        autoBots.reduce(
                          (acc, bot) => acc + bot.performance.winRate,
                          0,
                        ) / autoBots.length
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Общая прибыль</span>
                    <span className="text-green-400 font-bold">
                      $
                      {autoBots
                        .reduce(
                          (acc, bot) => acc + bot.performance.totalProfit,
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Connection Panel */}
        {!isConnected && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Icon name="Plug" size={20} />
                Подключение к Deriv API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="token" className="text-slate-300">
                    API Token
                  </Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Введите ваш API токен"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="appId" className="text-slate-300">
                    App ID
                  </Label>
                  <Input
                    id="appId"
                    placeholder="1089"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Button
                onClick={handleConnect}
                disabled={isLoading || !apiToken}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Подключение..." : "Подключиться"}
              </Button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard */}
        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Signals */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">🤖 AI Сигналы</h2>
                <Button
                  onClick={handleToggleSignals}
                  variant={isGeneratingSignals ? "destructive" : "default"}
                  size="sm"
                  className={
                    isGeneratingSignals ? "" : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {isGeneratingSignals ? "Остановить" : "Запустить"}
                </Button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {signals.map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
                {signals.length === 0 && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="text-center py-8">
                      <p className="text-slate-300">
                        Нажмите "Запустить" для получения сигналов
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Bot Management */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                ⚙️ Управление ботами
              </h2>
              <div className="space-y-3">
                {botConfigs.map((config) => (
                  <BotConfigCard
                    key={config.id}
                    config={config}
                    onToggle={handleBotToggle}
                  />
                ))}
              </div>
            </div>

            {/* Market Data */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                📊 Рыночные данные
              </h2>
              <div className="space-y-3">
                {marketData.map((data) => (
                  <MarketDataCard key={data.symbol} data={data} />
                ))}
              </div>

              {/* Quick Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    📈 Статистика
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Активных ботов</span>
                    <span className="text-green-400 font-bold">
                      {botConfigs.filter((b) => b.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Сигналов сегодня</span>
                    <span className="text-blue-400 font-bold">
                      {signals.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Подключений</span>
                    <span className="text-green-400 font-bold">1</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingDashboard;
