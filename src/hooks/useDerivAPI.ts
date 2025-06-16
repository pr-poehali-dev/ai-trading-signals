import { useState, useEffect, useCallback } from "react";
import {
  DerivAccount,
  MarketData,
  AutoTradeExecution,
  TradingSignal,
} from "@/types/trading";

export const useDerivAPI = () => {
  const [account, setAccount] = useState<DerivAccount | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTrades, setActiveTrades] = useState<AutoTradeExecution[]>([]);

  const connect = useCallback(async (apiToken: string, appId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Симуляция подключения к Deriv API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAccount: DerivAccount = {
        accountId: "VRTC12345",
        balance: 10000,
        currency: "USD",
        loginId: "CR123456",
        isConnected: true,
      };

      setAccount(mockAccount);
      setIsConnected(true);

      // Симуляция получения рыночных данных
      const mockMarketData: MarketData[] = [
        {
          symbol: "EUR/USD",
          price: 1.0845,
          change: 0.0023,
          changePercent: 0.21,
          volume: 125000,
          timestamp: new Date(),
        },
        {
          symbol: "GBP/USD",
          price: 1.2634,
          change: -0.0012,
          changePercent: -0.09,
          volume: 89000,
          timestamp: new Date(),
        },
        {
          symbol: "USD/JPY",
          price: 149.85,
          change: 0.45,
          changePercent: 0.3,
          volume: 156000,
          timestamp: new Date(),
        },
      ];

      setMarketData(mockMarketData);
    } catch (err) {
      setError("Failed to connect to Deriv API");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setMarketData([]);
  }, []);

  const executeAutoTrade = useCallback(
    async (
      signal: TradingSignal,
      amount: number,
      botId: string,
    ): Promise<AutoTradeExecution> => {
      const trade: AutoTradeExecution = {
        id: Math.random().toString(36).substr(2, 9),
        botId,
        signalId: signal.id,
        symbol: signal.symbol,
        type: signal.type,
        amount,
        entryPrice: signal.entryPrice,
        executionTime: new Date(),
        status: "PENDING",
      };

      try {
        // Симуляция исполнения ордера
        await new Promise((resolve) => setTimeout(resolve, 1000));

        trade.status = "EXECUTED";
        setActiveTrades((prev) => [...prev, trade]);

        // Симуляция результата через время экспирации
        setTimeout(() => {
          const success = Math.random() > 0.4; // 60% винрейт
          const profit = success ? amount * 0.8 : -amount;

          setActiveTrades((prev) =>
            prev.map((t) =>
              t.id === trade.id
                ? { ...t, result: success ? "WIN" : "LOSS", profit }
                : t,
            ),
          );

          // Обновляем баланс
          if (account) {
            setAccount((prev) =>
              prev ? { ...prev, balance: prev.balance + profit } : null,
            );
          }
        }, signal.expiryTime * 60000);

        return trade;
      } catch (err) {
        trade.status = "FAILED";
        throw err;
      }
    },
    [account],
  );

  const startAutoBot = useCallback(async (botId: string) => {
    console.log(`Starting auto bot ${botId}`);
    // Логика запуска автобота
  }, []);

  const stopAutoBot = useCallback(async (botId: string) => {
    console.log(`Stopping auto bot ${botId}`);
    // Логика остановки автобота
  }, []);

  const getActivePositions = useCallback(() => {
    return activeTrades.filter((trade) => !trade.result);
  }, [activeTrades]);

  return {
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
    activeTrades,
  };
};
