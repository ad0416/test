import { prisma } from "@/lib/db";
import StatsOverview from "@/components/dashboard/StatsOverview";
import TopTrendsWidget from "@/components/dashboard/TopTrendsWidget";
import TrendChart from "@/components/dashboard/TrendChart";
import RegionMap from "@/components/dashboard/RegionMap";

export default async function DashboardPage() {
  const [totalTrends, totalCountries, totalSuppliers, avgScoreResult] =
    await Promise.all([
      prisma.trend.count(),
      prisma.country.count(),
      prisma.supplier.count(),
      prisma.ethicalScore.aggregate({
        _avg: { overallScore: true },
      }),
    ]);

  const avgSustainability = avgScoreResult._avg.overallScore ?? 0;

  const topTrends = await prisma.trend.findMany({
    orderBy: { trendScore: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      category: true,
      momentum: true,
      trendScore: true,
    },
  });

  const dataPoints = await prisma.trendDataPoint.findMany({
    include: { trend: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  const trendNames = topTrends.map((t) => t.name);

  const chartDataMap = new Map<string, Record<string, string | number>>();
  for (const dp of dataPoints) {
    const monthKey = dp.date.toISOString().slice(0, 7);
    if (!chartDataMap.has(monthKey)) {
      chartDataMap.set(monthKey, { date: monthKey });
    }
    const entry = chartDataMap.get(monthKey)!;
    if (trendNames.includes(dp.trend.name)) {
      entry[dp.trend.name] = Math.round(dp.value);
    }
  }
  const chartData = Array.from(chartDataMap.values());

  const regionPopularity = await prisma.trendRegion.groupBy({
    by: ["regionId"],
    _avg: { popularity: true },
  });

  const regions = await prisma.region.findMany({
    select: { id: true, name: true },
  });

  const regionNameMap = new Map(regions.map((r) => [r.id, r.name]));
  const regionData = regionPopularity.map((rp) => ({
    region: regionNameMap.get(rp.regionId) ?? rp.regionId,
    popularity: rp._avg.popularity ?? 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Apparel Trends Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time intelligence on global fashion trends
          </p>
        </div>

        <div className="mb-8">
          <StatsOverview
            totalTrends={totalTrends}
            totalCountries={totalCountries}
            totalSuppliers={totalSuppliers}
            avgSustainability={avgSustainability}
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <TopTrendsWidget trends={topTrends} />
          </div>
          <div className="lg:col-span-2">
            <RegionMap data={regionData} />
          </div>
        </div>

        <div>
          <TrendChart data={chartData} trendNames={trendNames} />
        </div>
      </div>
    </div>
  );
}
