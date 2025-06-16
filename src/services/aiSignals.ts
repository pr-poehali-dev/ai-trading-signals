import { TradingSignal, AutoTradeExecution } from "@/types/trading";

class AISignalsService {
  private signals: TradingSignal[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private autoExecutionCallback?: (signal: TradingSignal) => void;

  generateSignal(): TradingSignal {
    const symbols = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF"];
    const types: ("CALL" | "PUT")[] = ["CALL", "PUT"];
    const trends: ("BULLISH" | "BEARISH" | "SIDEWAYS")[] = [
      "BULLISH",
      "BEARISH",
      "SIDEWAYS",
    ];

    const confidence = Math.floor(Math.random() * 35) + 65; // 65-100%

    return {
      id: Math.random().toString(36).substr(2, 9),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      type: types[Math.floor(Math.random() * types.length)],
      confidence,
      timestamp: new Date(),
      expiryTime: Math.floor(Math.random() * 3) + 2, // 2-4 minutes
      entryPrice: 1.0 + Math.random() * 0.5,
      analysis: this.generateAnalysis(confidence),
      marketTrend: trends[Math.floor(Math.random() * trends.length)],
    };
  }

  private generateAnalysis(confidence: number): string {
    const highConfidenceAnalyses = [
      "Сильный пробой ключевого уровня с большим объемом",
      "Формирование мощного тренда с подтверждением индикаторов",
      "Четкий сигнал от нескольких таймфреймов",
    ];

    const mediumConfidenceAnalyses = [
      "RSI показывает перекупленность, ожидается коррекция",
      "Пробой уровня поддержки, нисходящий тренд",
      "Скользящие средние указывают на восходящий тренд",
    ];

    return confidence > 80
      ? highConfidenceAnalyses[
          Math.floor(Math.random() * highConfidenceAnalyses.length)
        ]
      : mediumConfidenceAnalyses[
          Math.floor(Math.random() * mediumConfidenceAnalyses.length)
        ];
  }

  startGenerating(callback: (signal: TradingSignal) => void) {
    this.intervalId = setInterval(() => {
      const signal = this.generateSignal();
      this.signals.push(signal);
      callback(signal);

      // Автоисполнение если настроено
      if (this.autoExecutionCallback && signal.confidence >= 75) {
        this.autoExecutionCallback(signal);
      }
    }, 8000); // Новый сигнал каждые 8 секунд
  }

  setAutoExecution(callback: (signal: TradingSignal) => void) {
    this.autoExecutionCallback = callback;
  }

  removeAutoExecution() {
    this.autoExecutionCallback = undefined;
  }

  shouldAutoExecute(signal: TradingSignal, minConfidence: number): boolean {
    return (
      signal.confidence >= minConfidence &&
      signal.marketTrend !== "SIDEWAYS" &&
      new Date().getHours() >= 8 &&
      new Date().getHours() <= 22
    );
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
