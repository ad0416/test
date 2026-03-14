import { prisma } from "@/lib/db";
import { LifecycleFlow } from "@/components/lifecycle/LifecycleFlow";

export const metadata = {
  title: "Apparel Lifecycle | Apparel Trends Monitor",
  description: "Track trends across the complete apparel value chain from consumer demand to retail",
};

export default async function LifecyclePage() {
  const stages = await prisma.lifecycleStage.findMany({
    orderBy: { order: "asc" },
    include: {
      trends: {
        include: {
          trend: { select: { name: true, category: true } },
        },
      },
    },
  });

  const stagesData = stages.map((s) => ({
    id: s.id,
    name: s.name,
    displayName: s.displayName,
    description: s.description,
    order: s.order,
    trends: s.trends.map((lt) => ({
      id: lt.id,
      insight: lt.insight,
      trend: { name: lt.trend.name, category: lt.trend.category },
    })),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Apparel Lifecycle</h1>
        <p className="mt-2 text-gray-600">
          Track trends across the complete apparel value chain — from consumer demand to retail
        </p>
      </div>

      <LifecycleFlow stages={stagesData} />
    </div>
  );
}
