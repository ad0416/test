import { prisma } from "@/lib/db";
import Link from "next/link";
import { Shield, Leaf, Users, Eye, AlertTriangle } from "lucide-react";
import { MaterialsTable } from "@/components/ethics/MaterialsTable";
import { SustainabilityOverview } from "@/components/ethics/SustainabilityOverview";

export const metadata = {
  title: "Ethics & Sustainability | Apparel Trends Monitor",
  description: "Ethical frameworks, sustainability scores, and compliance data for the global apparel industry",
};

export default async function EthicsPage() {
  const [materials, certifications, countryCompliances, ethicalScores] = await Promise.all([
    prisma.material.findMany({ orderBy: { carbonFootprint: "asc" } }),
    prisma.certification.findMany({ orderBy: { category: "asc" } }),
    prisma.countryCompliance.findMany({
      include: { country: { include: { region: true } } },
      orderBy: { riskLevel: "asc" },
    }),
    prisma.ethicalScore.findMany({
      where: { entityType: "supplier" },
      include: { supplier: true },
    }),
  ]);

  const avgScores = {
    sustainability: ethicalScores.reduce((sum, s) => sum + s.sustainabilityScore, 0) / ethicalScores.length,
    labor: ethicalScores.reduce((sum, s) => sum + s.laborScore, 0) / ethicalScores.length,
    transparency: ethicalScores.reduce((sum, s) => sum + s.transparencyScore, 0) / ethicalScores.length,
    overall: ethicalScores.reduce((sum, s) => sum + s.overallScore, 0) / ethicalScores.length,
  };

  const riskCounts = {
    low: countryCompliances.filter((c) => c.riskLevel === "low").length,
    medium: countryCompliances.filter((c) => c.riskLevel === "medium").length,
    high: countryCompliances.filter((c) => c.riskLevel === "high").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ethics & Sustainability</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive ethical framework covering sustainability, labor compliance, and transparency
        </p>
      </div>

      {/* Overview Scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Sustainability</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{avgScores.sustainability.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Labor Score</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{avgScores.labor.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Transparency</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{avgScores.transparency.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Overall Score</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{avgScores.overall.toFixed(1)}</p>
        </div>
      </div>

      {/* Sustainability Overview Chart */}
      <SustainabilityOverview scores={ethicalScores.map((s) => ({
        name: s.supplier?.name ?? "Unknown",
        sustainability: s.sustainabilityScore,
        labor: s.laborScore,
        transparency: s.transparencyScore,
      }))} />

      {/* Country Compliance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Country Compliance</h2>
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Low Risk ({riskCounts.low})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500" /> Medium ({riskCounts.medium})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500" /> High ({riskCounts.high})
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {countryCompliances.map((cc) => {
            const riskColors = {
              low: "border-emerald-200 bg-emerald-50",
              medium: "border-yellow-200 bg-yellow-50",
              high: "border-red-200 bg-red-50",
            };
            const riskBadge = {
              low: "bg-emerald-100 text-emerald-800",
              medium: "bg-yellow-100 text-yellow-800",
              high: "bg-red-100 text-red-800",
            };
            return (
              <Link
                key={cc.id}
                href={`/ethics/${cc.country.code.toLowerCase()}`}
                className={`block rounded-lg border-2 p-4 hover:shadow-md transition-shadow ${riskColors[cc.riskLevel as keyof typeof riskColors]}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{cc.country.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${riskBadge[cc.riskLevel as keyof typeof riskBadge]}`}>
                    {cc.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Min. Wage: {cc.minimumWage}</p>
                <p className="text-sm text-gray-600">Hours: {cc.workingHoursLimit}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Materials Impact */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Material Environmental Impact</h2>
        <MaterialsTable materials={materials.map((m) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          environmentalImpact: m.environmentalImpact,
          renewability: m.renewability,
          carbonFootprint: m.carbonFootprint,
          waterUsage: m.waterUsage,
          description: m.description,
        }))} />
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Industry Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => {
            const catColors = {
              environmental: "bg-emerald-100 text-emerald-800",
              labor: "bg-blue-100 text-blue-800",
              quality: "bg-purple-100 text-purple-800",
            };
            return (
              <div key={cert.id} className="flex gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${catColors[cert.category as keyof typeof catColors]}`}>
                      {cert.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Issued by: {cert.issuingBody}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
