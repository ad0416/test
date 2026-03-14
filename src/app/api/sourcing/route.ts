import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type"); // suppliers or hubs
  const search = searchParams.get("q");
  const costTier = searchParams.get("costTier");
  const region = searchParams.get("region");

  if (type === "hubs") {
    const hubs = await prisma.productionHub.findMany({
      include: { region: true },
      orderBy: { infrastructureScore: "desc" },
    });

    let filtered = hubs;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.countryName.toLowerCase().includes(q) ||
          h.specialization.toLowerCase().includes(q)
      );
    }
    if (region) {
      filtered = filtered.filter((h) => h.region.code === region);
    }

    return NextResponse.json(filtered);
  }

  // Default: suppliers
  const suppliers = await prisma.supplier.findMany({
    include: {
      region: true,
      ethicalScore: true,
      certifications: { include: { certification: true } },
    },
    orderBy: { rating: "desc" },
  });

  let filtered = suppliers;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.countryName.toLowerCase().includes(q) ||
        s.capabilities.toLowerCase().includes(q)
    );
  }
  if (costTier) {
    filtered = filtered.filter((s) => s.costTier === costTier);
  }
  if (region) {
    filtered = filtered.filter((s) => s.region.code === region);
  }

  return NextResponse.json(filtered);
}
