import { TrendingUp, Globe, Factory, Leaf } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface StatsOverviewProps {
  totalTrends: number;
  totalCountries: number;
  totalSuppliers: number;
  avgSustainability: number;
}

const stats = [
  {
    key: "totalTrends" as const,
    label: "Total Trends Tracked",
    icon: TrendingUp,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "totalCountries" as const,
    label: "Countries Covered",
    icon: Globe,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    key: "totalSuppliers" as const,
    label: "Suppliers Listed",
    icon: Factory,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "avgSustainability" as const,
    label: "Avg Sustainability Score",
    icon: Leaf,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];

export default function StatsOverview({
  totalTrends,
  totalCountries,
  totalSuppliers,
  avgSustainability,
}: StatsOverviewProps) {
  const values: StatsOverviewProps = {
    totalTrends,
    totalCountries,
    totalSuppliers,
    avgSustainability,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const rawValue = values[stat.key];
        const displayValue =
          stat.key === "avgSustainability"
            ? rawValue.toFixed(1)
            : formatNumber(rawValue);

        return (
          <div
            key={stat.key}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {displayValue}
                </p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
