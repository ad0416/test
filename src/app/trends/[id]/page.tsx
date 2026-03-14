import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Badge from "@/components/ui/Badge";
import { getMomentumColor, getScoreColor } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import TrendDetailChart from "./TrendDetailChart";

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

export default async function TrendDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trend = await prisma.trend.findUnique({
    where: { id },
    include: {
      regions: {
        include: { region: { select: { name: true } } },
        orderBy: { popularity: "desc" },
      },
      ageGroups: {
        orderBy: { popularity: "desc" },
      },
      lifecycle: {
        include: { stage: true },
        orderBy: { stage: { order: "asc" } },
      },
      dataPoints: {
        orderBy: { date: "asc" },
      },
    },
  });

  if (!trend) {
    notFound();
  }

  const chartData = trend.dataPoints.map((dp) => ({
    date: dp.date.toISOString().slice(0, 7),
    score: Math.round(dp.value),
  }));

  const momentumColor = getMomentumColor(trend.momentum);
  const MomentumIcon =
    trend.momentum === "rising"
      ? TrendingUp
      : trend.momentum === "declining"
        ? TrendingDown
        : Minus;

  const ageGroupLabels: Record<string, string> = {
    gen_z: "Gen Z (18-27)",
    millennial: "Millennials (28-43)",
    gen_x: "Gen X (44-59)",
    boomer: "Boomers (60+)",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/trends"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trends
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {trend.name}
                </h1>
                <Badge variant={getCategoryVariant(trend.category)}>
                  {trend.category}
                </Badge>
              </div>
              <p className="max-w-2xl text-gray-600">{trend.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-4xl font-bold ${getScoreColor(trend.trendScore)}`}
              >
                {trend.trendScore}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${momentumColor}`}
              >
                <MomentumIcon className="h-4 w-4" />
                {trend.momentum.charAt(0).toUpperCase() +
                  trend.momentum.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Trend Score Chart */}
        {chartData.length > 0 && (
          <div className="mb-8">
            <TrendDetailChart data={chartData} trendName={trend.name} />
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Region Popularity Table */}
          <div className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                Region Popularity
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted">
                    <th className="px-6 py-3 font-medium">Region</th>
                    <th className="px-6 py-3 font-medium">Popularity</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {trend.regions.map((tr) => (
                    <tr key={tr.id}>
                      <td className="px-6 py-3 text-sm font-medium text-foreground">
                        {tr.region.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">
                        {tr.popularity}
                      </td>
                      <td className="px-6 py-3">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${tr.popularity}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Age Group Popularity Table */}
          <div className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                Age Group Popularity
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted">
                    <th className="px-6 py-3 font-medium">Age Group</th>
                    <th className="px-6 py-3 font-medium">Popularity</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {trend.ageGroups.map((ag) => (
                    <tr key={ag.id}>
                      <td className="px-6 py-3 text-sm font-medium text-foreground">
                        {ageGroupLabels[ag.ageGroup] ?? ag.ageGroup}
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">
                        {ag.popularity}
                      </td>
                      <td className="px-6 py-3">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-indigo-500"
                            style={{ width: `${ag.popularity}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lifecycle Insights */}
        {trend.lifecycle.length > 0 && (
          <div className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                Lifecycle Insights
              </h3>
            </div>
            <div className="divide-y divide-border">
              {trend.lifecycle.map((lc) => (
                <div key={lc.id} className="px-6 py-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {lc.stage.order}
                    </span>
                    <h4 className="font-semibold text-foreground">
                      {lc.stage.displayName}
                    </h4>
                  </div>
                  <p className="ml-8 text-sm text-muted">{lc.insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
