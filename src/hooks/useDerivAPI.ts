import { useState, useEffect, useCallback } from "react";
import { DerivAccount, MarketData } from "@/types/trading";

export const useDerivAPI = () => {
  const [account, setAccount] = useState<DerivAccount | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    account,
    marketData,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
  };
};
