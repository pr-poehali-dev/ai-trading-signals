import { TradingSignal } from "@/types/trading";

class AISignalsService {
  private signals: TradingSignal[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  generateSignal(): TradingSignal {
    const symbols = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF"];
    const types: ("CALL" | "PUT")[] = ["CALL", "PUT"];
    const trends: ("BULLISH" | "BEARISH" | "SIDEWAYS")[] = [
      "BULLISH",
      "BEARISH",
      "SIDEWAYS",
    ];

    return {
      id: Math.random().toString(36).substr(2, 9),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      type: types[Math.floor(Math.random() * types.length)],
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
      timestamp: new Date(),
      expiryTime: Math.floor(Math.random() * 5) + 1, // 1-5 minutes
      entryPrice: 1.0 + Math.random() * 0.5,
      analysis: this.generateAnalysis(),
      marketTrend: trends[Math.floor(Math.random() * trends.length)],
    };
  }

  private generateAnalysis(): string {
    const analyses = [
      "RSI показывает перекупленность, ожидается коррекция",
      "Пробой уровня поддержки, сильный нисходящий тренд",
      'Формируется паттерн "Двойное дно", возможен разворот',
      "Скользящие средние указывают на восходящий тренд",
      "Дивергенция между ценой и индикатором MACD",
      "Объемы растут, подтверждая текущий тренд",
    ];

    return analyses[Math.floor(Math.random() * analyses.length)];
  }

  startGenerating(callback: (signal: TradingSignal) => void) {
    this.intervalId = setInterval(() => {
      const signal = this.generateSignal();
      this.signals.push(signal);
      callback(signal);
    }, 5000); // Новый сигнал каждые 5 секунд
  }

  stopGenerating() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getRecentSignals(limit: number = 10): TradingSignal[] {
    return this.signals.slice(-limit).reverse();
  }
}

export const aiSignalsService = new AISignalsService();
