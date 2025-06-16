import { MarketData } from "@/types/trading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface MarketDataCardProps {
  data: MarketData;
}

const MarketDataCard = ({ data }: MarketDataCardProps) => {
  const isPositive = data.change >= 0;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">{data.symbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-white">
          {data.price.toFixed(5)}
        </div>

        <div
          className={`flex items-center gap-2 ${isPositive ? "text-green-400" : "text-red-400"}`}
        >
          <Icon name={isPositive ? "ArrowUp" : "ArrowDown"} size={16} />
          <span className="font-semibold">
            {isPositive ? "+" : ""}
            {data.change.toFixed(4)}
          </span>
          <span className="text-sm">
            ({isPositive ? "+" : ""}
            {data.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Объем</span>
          <span className="text-white">{data.volume.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDataCard;
