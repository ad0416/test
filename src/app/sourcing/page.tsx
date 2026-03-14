import { prisma } from "@/lib/db";
import { SourcingDirectory } from "@/components/sourcing/SourcingDirectory";

export const metadata = {
  title: "Sourcing Directory | Apparel Trends Monitor",
  description: "Find suppliers, manufacturers, and production hubs worldwide for your apparel brand",
};

export default async function SourcingPage() {
  const [suppliers, hubs] = await Promise.all([
    prisma.supplier.findMany({
      include: {
        region: true,
        ethicalScore: true,
        certifications: { include: { certification: true } },
      },
      orderBy: { rating: "desc" },
    }),
    prisma.productionHub.findMany({
      include: { region: true },
      orderBy: { infrastructureScore: "desc" },
    }),
  ]);

  const suppliersData = suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    countryName: s.countryName,
    type: s.type,
    capabilities: s.capabilities,
    minOrderQty: s.minOrderQty,
    leadTimeDays: s.leadTimeDays,
    costTier: s.costTier,
    rating: s.rating,
    description: s.description,
    ethicalScore: s.ethicalScore ? { overallScore: s.ethicalScore.overallScore } : null,
    certifications: s.certifications.map((c) => ({
      certification: { name: c.certification.name },
    })),
  }));

  const hubsData = hubs.map((h) => ({
    id: h.id,
    name: h.name,
    countryName: h.countryName,
    specialization: h.specialization,
    laborCostIndex: h.laborCostIndex,
    infrastructureScore: h.infrastructureScore,
    description: h.description,
    yearlyOutput: h.yearlyOutput,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sourcing Directory</h1>
        <p className="mt-2 text-gray-600">
          Find suppliers and production hubs worldwide for your apparel brand
        </p>
      </div>

      <SourcingDirectory suppliers={suppliersData} hubs={hubsData} />
    </div>
  );
}
