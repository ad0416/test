import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Clock, Package, Factory, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      region: true,
      ethicalScore: true,
      certifications: { include: { certification: true } },
    },
  });

  if (!supplier) {
    notFound();
  }

  const costColors = {
    low: "bg-emerald-100 text-emerald-800",
    mid: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      <Link href="/sourcing" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Sourcing Directory
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {supplier.countryName}</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {supplier.region.name}</span>
              <span className="flex items-center gap-1"><Factory className="w-4 h-4" /> {supplier.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("px-3 py-1 rounded-full text-sm font-medium", costColors[supplier.costTier as keyof typeof costColors])}>
              {supplier.costTier} cost
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("w-4 h-4", i < Math.round(supplier.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">{supplier.rating}</span>
            </div>
          </div>
        </div>
        {supplier.description && (
          <p className="mt-4 text-gray-700 leading-relaxed">{supplier.description}</p>
        )}
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Package className="w-5 h-5" />
            <span className="text-sm">Minimum Order Quantity</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{supplier.minOrderQty.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">units per order</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Lead Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{supplier.leadTimeDays}</p>
          <p className="text-xs text-gray-500 mt-1">days average</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Factory className="w-5 h-5" />
            <span className="text-sm">Capabilities</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {supplier.capabilities.split(",").map((cap) => (
              <span key={cap} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {cap.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ethical Score */}
      {supplier.ethicalScore && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ethical Score</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Overall", value: supplier.ethicalScore.overallScore, color: "bg-blue-500" },
              { label: "Sustainability", value: supplier.ethicalScore.sustainabilityScore, color: "bg-emerald-500" },
              { label: "Labor", value: supplier.ethicalScore.laborScore, color: "bg-purple-500" },
              { label: "Transparency", value: supplier.ethicalScore.transparencyScore, color: "bg-amber-500" },
            ].map((score) => (
              <div key={score.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{score.label}</span>
                  <span className="font-semibold text-gray-900">{score.value.toFixed(0)}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={cn("h-3 rounded-full transition-all", score.color)}
                    style={{ width: `${score.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {supplier.certifications.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supplier.certifications.map((sc) => {
              const catColors = {
                environmental: "border-emerald-200 bg-emerald-50",
                labor: "border-blue-200 bg-blue-50",
                quality: "border-purple-200 bg-purple-50",
              };
              return (
                <div
                  key={sc.id}
                  className={cn("p-4 rounded-lg border-2", catColors[sc.certification.category as keyof typeof catColors] ?? "border-gray-200")}
                >
                  <h3 className="font-semibold text-gray-900">{sc.certification.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{sc.certification.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Issued by: {sc.certification.issuingBody}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
