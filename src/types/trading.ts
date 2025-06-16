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

export interface AutoTradingBot extends BotConfig {
  autoExecution: boolean;
  minConfidence: number;
  maxDailyTrades: number;
  tradingHours: {
    start: string;
    end: string;
  };
  riskManagement: RiskManagement;
  performance: BotPerformance;
  status: "ACTIVE" | "PAUSED" | "STOPPED";
  lastTrade?: Date;
}

export interface RiskManagement {
  maxDrawdown: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  maxConsecutiveLosses: number;
  dailyLossLimit: number;
}

export interface BotPerformance {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  todayTrades: number;
  consecutiveLosses: number;
  maxDrawdown: number;
}

export interface AutoTradeExecution {
  id: string;
  botId: string;
  signalId: string;
  symbol: string;
  type: "CALL" | "PUT";
  amount: number;
  entryPrice: number;
  executionTime: Date;
  status: "PENDING" | "EXECUTED" | "CANCELLED" | "FAILED";
  result?: "WIN" | "LOSS";
  profit?: number;
}

export enum TradingStrategy {
  MARTINGALE = "MARTINGALE",
  ANTI_MARTINGALE = "ANTI_MARTINGALE",
  FIBONACCI = "FIBONACCI",
  FIXED_AMOUNT = "FIXED_AMOUNT",
  PERCENTAGE_RISK = "PERCENTAGE_RISK",
}
