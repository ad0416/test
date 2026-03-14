import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const region = searchParams.get("region");
  const ageGroup = searchParams.get("ageGroup");
  const momentum = searchParams.get("momentum");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (momentum) where.momentum = momentum;

  const trends = await prisma.trend.findMany({
    where,
    include: {
      regions: { include: { region: true } },
      ageGroups: true,
      dataPoints: { orderBy: { date: "asc" } },
    },
    orderBy: { trendScore: "desc" },
  });

  let filtered = trends;

  if (region) {
    filtered = filtered.filter((t) =>
      t.regions.some((r) => r.region.code === region)
    );
  }

  if (ageGroup) {
    filtered = filtered.filter((t) =>
      t.ageGroups.some((ag) => ag.ageGroup === ageGroup && ag.popularity > 50)
    );
  }

  return NextResponse.json(filtered);
}
