"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getMomentumColor, getScoreColor } from "@/lib/utils";

interface TrendItem {
  id: string;
  name: string;
  category: string;
  momentum: string;
  trendScore: number;
}

interface TopTrendsWidgetProps {
  trends: TrendItem[];
}

function MomentumIcon({ momentum }: { momentum: string }) {
  const colorClass = getMomentumColor(momentum);
  const iconProps = { className: `h-4 w-4 ${colorClass}` };

  switch (momentum) {
    case "rising":
      return <TrendingUp {...iconProps} />;
    case "declining":
      return <TrendingDown {...iconProps} />;
    default:
      return <Minus {...iconProps} />;
  }
}

function getCategoryVariant(
  category: string
): "default" | "success" | "warning" | "danger" | "info" {
  switch (category) {
    case "sustainable":
      return "success";
    case "luxury":
      return "warning";
    case "streetwear":
      return "danger";
    case "athleisure":
    case "activewear":
      return "info";
    default:
      return "default";
  }
}

export default function TopTrendsWidget({ trends }: TopTrendsWidgetProps) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">Top Trends</h3>
        <p className="mt-1 text-sm text-muted">Highest scoring trends right now</p>
      </div>
      <div className="divide-y divide-border">
        {trends.map((trend, index) => (
          <div
            key={trend.id}
            className="flex items-center justify-between px-6 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-foreground">{trend.name}</p>
                <Badge variant={getCategoryVariant(trend.category)}>
                  {trend.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MomentumIcon momentum={trend.momentum} />
              <span
                className={`text-lg font-bold ${getScoreColor(trend.trendScore)}`}
              >
                {trend.trendScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
