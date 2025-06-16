import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignalCard from "./SignalCard";
import BotConfigCard from "./BotConfigCard";
import MarketDataCard from "./MarketDataCard";
import { useDerivAPI } from "@/hooks/useDerivAPI";
import { aiSignalsService } from "@/services/aiSignals";
import { TradingSignal, BotConfig } from "@/types/trading";
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
  } = useDerivAPI();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [apiToken, setApiToken] = useState("");
  const [appId, setAppId] = useState("1089");
  const [isGeneratingSignals, setIsGeneratingSignals] = useState(false);

  const [botConfigs] = useState<BotConfig[]>([
    {
      id: "1",
      name: "Скальпер EUR/USD",
      isActive: true,
      strategy: "MARTINGALE",
      baseAmount: 10,
      maxLoss: 100,
      takeProfit: 50,
      symbols: ["EUR/USD", "GBP/USD"],
    },
    {
      id: "2",
      name: "Тренд Фоловер",
      isActive: false,
      strategy: "ANTI_MARTINGALE",
      baseAmount: 5,
      maxLoss: 50,
      takeProfit: 100,
      symbols: ["USD/JPY", "AUD/USD", "USD/CHF"],
    },
  ]);

  const handleConnect = async () => {
    if (apiToken) {
      await connect(apiToken, appId);
    }
  };

  const handleToggleSignals = () => {
    if (isGeneratingSignals) {
      aiSignalsService.stopGenerating();
      setIsGeneratingSignals(false);
    } else {
      aiSignalsService.startGenerating((signal) => {
        setSignals((prev) => [signal, ...prev.slice(0, 9)]);
      });
      setIsGeneratingSignals(true);
    }
  };

  const handleBotToggle = (id: string, active: boolean) => {
    // Здесь будет логика управления ботами
    console.log(`Bot ${id} ${active ? "activated" : "deactivated"}`);
  };

  useEffect(() => {
    return () => {
      aiSignalsService.stopGenerating();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            🚀 Deriv Bot Integration
          </h1>
          <div className="flex items-center gap-4">
            {isConnected && account && (
              <div className="text-white">
                <span className="text-sm text-slate-300">Баланс: </span>
                <span className="font-bold">
                  ${account.balance.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

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
