import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const section = searchParams.get("section"); // materials, certifications, compliance, scores

  switch (section) {
    case "materials": {
      const materials = await prisma.material.findMany({
        orderBy: { carbonFootprint: "asc" },
      });
      return NextResponse.json(materials);
    }

    case "certifications": {
      const certs = await prisma.certification.findMany({
        include: { suppliers: { include: { supplier: true } } },
        orderBy: { category: "asc" },
      });
      return NextResponse.json(certs);
    }

    case "compliance": {
      const compliance = await prisma.countryCompliance.findMany({
        include: { country: { include: { region: true } } },
        orderBy: { riskLevel: "asc" },
      });
      return NextResponse.json(compliance);
    }

    case "scores": {
      const scores = await prisma.ethicalScore.findMany({
        include: { supplier: true },
        orderBy: { overallScore: "desc" },
      });
      return NextResponse.json(scores);
    }

    default: {
      const [materialCount, certCount, complianceCount, avgScore] = await Promise.all([
        prisma.material.count(),
        prisma.certification.count(),
        prisma.countryCompliance.count(),
        prisma.ethicalScore.aggregate({ _avg: { overallScore: true } }),
      ]);
      return NextResponse.json({
        materials: materialCount,
        certifications: certCount,
        countriesWithCompliance: complianceCount,
        averageEthicalScore: avgScore._avg.overallScore,
      });
    }
  }
}
