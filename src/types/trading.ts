export interface TradingSignal {
  id: string;
  symbol: string;
  type: "CALL" | "PUT";
  confidence: number;
  timestamp: Date;
  expiryTime: number;
  entryPrice: number;
  analysis: string;
  marketTrend: "BULLISH" | "BEARISH" | "SIDEWAYS";
}

export interface BotConfig {
  id: string;
  name: string;
  isActive: boolean;
  strategy: "MARTINGALE" | "ANTI_MARTINGALE" | "FIBONACCI" | "CUSTOM";
  baseAmount: number;
  maxLoss: number;
  takeProfit: number;
  symbols: string[];
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export interface TradeHistory {
  id: string;
  symbol: string;
  type: "CALL" | "PUT";
  amount: number;
  entryPrice: number;
  exitPrice: number;
  result: "WIN" | "LOSS";
  profit: number;
  timestamp: Date;
}

export interface DerivAccount {
  accountId: string;
  balance: number;
  currency: string;
  loginId: string;
  isConnected: boolean;
}
