import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/ui/Badge";
import { getMomentumColor, getScoreColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function MomentumIndicator({ momentum }: { momentum: string }) {
  const colorClass = getMomentumColor(momentum);
  const iconProps = { className: `inline h-4 w-4 ${colorClass}` };

  switch (momentum) {
    case "rising":
      return (
        <span className={`inline-flex items-center gap-1 text-sm ${colorClass}`}>
          <TrendingUp {...iconProps} /> Rising
        </span>
      );
    case "declining":
      return (
        <span className={`inline-flex items-center gap-1 text-sm ${colorClass}`}>
          <TrendingDown {...iconProps} /> Declining
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 text-sm ${colorClass}`}>
          <Minus {...iconProps} /> Stable
        </span>
      );
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

export default async function TrendsPage() {
  const trends = await prisma.trend.findMany({
    include: {
      regions: {
        include: { region: { select: { name: true } } },
        orderBy: { popularity: "desc" },
        take: 3,
      },
      ageGroups: true,
    },
    orderBy: { trendScore: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trend Explorer</h1>
          <p className="mt-2 text-gray-600">
            Browse and discover global apparel trends
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trends.map((trend) => (
            <Link
              key={trend.id}
              href={`/trends/${trend.id}`}
              className="group block"
            >
              <div className="rounded-xl border border-border bg-surface shadow-sm transition-shadow group-hover:shadow-md">
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600">
                      {trend.name}
                    </h3>
                    <Badge variant={getCategoryVariant(trend.category)}>
                      {trend.category}
                    </Badge>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm text-muted">
                    {trend.description}
                  </p>

                  <div className="mb-4 flex items-center justify-between">
                    <MomentumIndicator momentum={trend.momentum} />
                    <span
                      className={`text-lg font-bold ${getScoreColor(trend.trendScore)}`}
                    >
                      {trend.trendScore}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${trend.trendScore}%` }}
                      />
                    </div>
                  </div>

                  {trend.regions.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted">
                        Top Regions
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {trend.regions.map((tr) => (
                          <span
                            key={tr.id}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                          >
                            {tr.region.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
