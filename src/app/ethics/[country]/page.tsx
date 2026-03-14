import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react";

export async function generateStaticParams() {
  const countries = await prisma.country.findMany({
    where: { compliance: { isNot: null } },
    select: { code: true },
  });
  return countries.map((c) => ({ country: c.code.toLowerCase() }));
}

export default async function CountryCompliancePage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countryCode } = await params;
  const country = await prisma.country.findFirst({
    where: { code: { equals: countryCode.toUpperCase() } },
    include: {
      compliance: true,
      region: true,
    },
  });

  if (!country || !country.compliance) {
    notFound();
  }

  const cc = country.compliance;

  const suppliers = await prisma.supplier.findMany({
    where: { countryName: country.name },
    include: {
      ethicalScore: true,
      certifications: { include: { certification: true } },
    },
  });

  const riskConfig = {
    low: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800", icon: CheckCircle },
    medium: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-800", icon: AlertTriangle },
    high: { bg: "bg-red-50", border: "border-red-300", text: "text-red-800", icon: AlertTriangle },
  };

  const risk = riskConfig[cc.riskLevel as keyof typeof riskConfig];
  const RiskIcon = risk.icon;

  return (
    <div className="space-y-8">
      <Link href="/ethics" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Ethics Dashboard
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{country.name}</h1>
          <p className="text-gray-500 mt-1">{country.region.name} &middot; {country.region.continent}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${risk.bg} ${risk.border}`}>
          <RiskIcon className={`w-5 h-5 ${risk.text}`} />
          <span className={`font-semibold ${risk.text}`}>{cc.riskLevel.toUpperCase()} RISK</span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Minimum Wage</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{cc.minimumWage}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Working Hours Limit</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{cc.workingHoursLimit}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Suppliers Listed</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{suppliers.length}</p>
        </div>
      </div>

      {/* Labor Law Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Labor Law Summary</h2>
        <p className="text-gray-700 leading-relaxed">{cc.laborLawSummary}</p>
      </div>

      {/* Suppliers in this country */}
      {suppliers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Suppliers in {country.name}
          </h2>
          <div className="space-y-4">
            {suppliers.map((s) => (
              <div key={s.id} className="flex items-start justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex-1">
                  <Link href={`/sourcing/${s.id}`} className="font-semibold text-blue-600 hover:text-blue-800">
                    {s.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{s.type} &middot; {s.capabilities}</p>
                  <div className="flex gap-2 mt-2">
                    {s.certifications.map((sc) => (
                      <span key={sc.id} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {sc.certification.name}
                      </span>
                    ))}
                  </div>
                </div>
                {s.ethicalScore && (
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">{s.ethicalScore.overallScore.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">Overall Score</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
