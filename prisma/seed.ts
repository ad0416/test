import { resolve } from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: `file:${resolve(__dirname, "..", "dev.db")}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.rawDataPoint.deleteMany();
  await prisma.dataSource.deleteMany();
  await prisma.supplierCertification.deleteMany();
  await prisma.ethicalScore.deleteMany();
  await prisma.countryCompliance.deleteMany();
  await prisma.trendDataPoint.deleteMany();
  await prisma.lifecycleTrend.deleteMany();
  await prisma.lifecycleStage.deleteMany();
  await prisma.trendAgeGroup.deleteMany();
  await prisma.trendRegion.deleteMany();
  await prisma.productionHub.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.material.deleteMany();
  await prisma.trend.deleteMany();
  await prisma.country.deleteMany();
  await prisma.region.deleteMany();

  console.log("Seeding regions...");
  const regions = await Promise.all([
    prisma.region.create({ data: { name: "East Asia", code: "EA", continent: "Asia" } }),
    prisma.region.create({ data: { name: "South Asia", code: "SA", continent: "Asia" } }),
    prisma.region.create({ data: { name: "Southeast Asia", code: "SEA", continent: "Asia" } }),
    prisma.region.create({ data: { name: "Western Europe", code: "WE", continent: "Europe" } }),
    prisma.region.create({ data: { name: "Eastern Europe", code: "EE", continent: "Europe" } }),
    prisma.region.create({ data: { name: "North America", code: "NA", continent: "North America" } }),
    prisma.region.create({ data: { name: "South America", code: "SAM", continent: "South America" } }),
    prisma.region.create({ data: { name: "Africa", code: "AF", continent: "Africa" } }),
  ]);

  const [eastAsia, southAsia, seAsia, westEurope, eastEurope, northAm, southAm, africa] = regions;

  console.log("Seeding countries...");
  const countriesData = [
    { name: "China", code: "CN", regionId: eastAsia.id },
    { name: "Japan", code: "JP", regionId: eastAsia.id },
    { name: "South Korea", code: "KR", regionId: eastAsia.id },
    { name: "India", code: "IN", regionId: southAsia.id },
    { name: "Bangladesh", code: "BD", regionId: southAsia.id },
    { name: "Sri Lanka", code: "LK", regionId: southAsia.id },
    { name: "Pakistan", code: "PK", regionId: southAsia.id },
    { name: "Vietnam", code: "VN", regionId: seAsia.id },
    { name: "Cambodia", code: "KH", regionId: seAsia.id },
    { name: "Indonesia", code: "ID", regionId: seAsia.id },
    { name: "Italy", code: "IT", regionId: westEurope.id },
    { name: "France", code: "FR", regionId: westEurope.id },
    { name: "Portugal", code: "PT", regionId: westEurope.id },
    { name: "Spain", code: "ES", regionId: westEurope.id },
    { name: "United Kingdom", code: "GB", regionId: westEurope.id },
    { name: "Germany", code: "DE", regionId: westEurope.id },
    { name: "Turkey", code: "TR", regionId: eastEurope.id },
    { name: "Romania", code: "RO", regionId: eastEurope.id },
    { name: "United States", code: "US", regionId: northAm.id },
    { name: "Mexico", code: "MX", regionId: northAm.id },
    { name: "Canada", code: "CA", regionId: northAm.id },
    { name: "Brazil", code: "BR", regionId: southAm.id },
    { name: "Colombia", code: "CO", regionId: southAm.id },
    { name: "Ethiopia", code: "ET", regionId: africa.id },
    { name: "Kenya", code: "KE", regionId: africa.id },
    { name: "Morocco", code: "MA", regionId: africa.id },
  ];

  const countries: Record<string, { id: string }> = {};
  for (const c of countriesData) {
    countries[c.code] = await prisma.country.create({ data: c });
  }

  console.log("Seeding trends...");
  const trendsData = [
    { name: "Quiet Luxury", description: "Minimalist, logo-free high-quality garments emphasizing craftsmanship over branding. Think Loro Piana, The Row, and understated elegance.", category: "luxury", momentum: "rising", trendScore: 92 },
    { name: "Y2K Revival", description: "Return of early 2000s aesthetics: low-rise jeans, butterfly motifs, metallic fabrics, and chunky platform shoes.", category: "streetwear", momentum: "stable", trendScore: 78 },
    { name: "Gorpcore", description: "Outdoor and hiking-inspired fashion entering mainstream. Technical fabrics, earth tones, and utility-focused design.", category: "athleisure", momentum: "rising", trendScore: 85 },
    { name: "Regenerative Fashion", description: "Beyond sustainable — clothing made from regeneratively farmed materials that restore ecosystems.", category: "sustainable", momentum: "rising", trendScore: 88 },
    { name: "Digital Fashion", description: "Virtual clothing for social media and metaverse. AR try-ons and NFT fashion collections.", category: "streetwear", momentum: "rising", trendScore: 71 },
    { name: "Gender-Fluid Fashion", description: "Unisex and non-binary clothing lines breaking traditional gender barriers in design.", category: "casual", momentum: "rising", trendScore: 82 },
    { name: "Workleisure", description: "Hybrid work-from-anywhere wardrobes blending professional and casual elements.", category: "casual", momentum: "stable", trendScore: 75 },
    { name: "Dopamine Dressing", description: "Bold, bright colors and joyful patterns designed to boost mood and self-expression.", category: "casual", momentum: "stable", trendScore: 68 },
    { name: "Techwear", description: "Futuristic, function-first garments with waterproof fabrics, modular components, and urban utility.", category: "streetwear", momentum: "stable", trendScore: 73 },
    { name: "Cottagecore", description: "Romantic, rural-inspired fashion with floral prints, natural fabrics, and handcraft aesthetics.", category: "casual", momentum: "declining", trendScore: 55 },
    { name: "Athleisure 2.0", description: "Next-gen athletic wear with smart fabrics, biometric tracking integration, and seamless day-to-night transition.", category: "athleisure", momentum: "rising", trendScore: 90 },
    { name: "Neo-Tailoring", description: "Modern take on classic tailoring with deconstructed blazers, oversized silhouettes, and unexpected fabric choices.", category: "formal", momentum: "rising", trendScore: 79 },
    { name: "Upcycled Denim", description: "Repurposed and reconstructed denim pieces, from patchwork jeans to denim accessories.", category: "denim", momentum: "rising", trendScore: 83 },
    { name: "Sheer Layering", description: "Transparent and semi-transparent fabrics layered for depth and visual interest.", category: "luxury", momentum: "stable", trendScore: 65 },
    { name: "Artisan Knitwear", description: "Hand-knitted and crochet pieces celebrating traditional craftsmanship and slow fashion.", category: "knitwear", momentum: "rising", trendScore: 77 },
    { name: "Capsule Wardrobes", description: "Minimalist approach to fashion with versatile, high-quality core pieces that mix and match.", category: "sustainable", momentum: "rising", trendScore: 86 },
    { name: "African Print Renaissance", description: "Contemporary designs featuring traditional African wax prints and Ankara patterns in global fashion.", category: "streetwear", momentum: "rising", trendScore: 81 },
    { name: "Modular Fashion", description: "Garments with interchangeable components — detachable sleeves, convertible lengths, zip-off features.", category: "activewear", momentum: "rising", trendScore: 69 },
  ];

  const trends: Record<string, { id: string }> = {};
  for (const t of trendsData) {
    trends[t.name] = await prisma.trend.create({ data: t });
  }

  console.log("Seeding trend-region popularity...");
  const trendRegionData = [
    { trend: "Quiet Luxury", region: westEurope.id, popularity: 95 },
    { trend: "Quiet Luxury", region: northAm.id, popularity: 88 },
    { trend: "Quiet Luxury", region: eastAsia.id, popularity: 80 },
    { trend: "Y2K Revival", region: northAm.id, popularity: 85 },
    { trend: "Y2K Revival", region: eastAsia.id, popularity: 90 },
    { trend: "Y2K Revival", region: seAsia.id, popularity: 75 },
    { trend: "Gorpcore", region: northAm.id, popularity: 88 },
    { trend: "Gorpcore", region: westEurope.id, popularity: 82 },
    { trend: "Gorpcore", region: eastAsia.id, popularity: 78 },
    { trend: "Regenerative Fashion", region: westEurope.id, popularity: 92 },
    { trend: "Regenerative Fashion", region: northAm.id, popularity: 85 },
    { trend: "Regenerative Fashion", region: southAm.id, popularity: 65 },
    { trend: "Gender-Fluid Fashion", region: northAm.id, popularity: 90 },
    { trend: "Gender-Fluid Fashion", region: westEurope.id, popularity: 85 },
    { trend: "Gender-Fluid Fashion", region: eastAsia.id, popularity: 60 },
    { trend: "Athleisure 2.0", region: northAm.id, popularity: 95 },
    { trend: "Athleisure 2.0", region: eastAsia.id, popularity: 88 },
    { trend: "Athleisure 2.0", region: westEurope.id, popularity: 82 },
    { trend: "African Print Renaissance", region: africa.id, popularity: 95 },
    { trend: "African Print Renaissance", region: northAm.id, popularity: 70 },
    { trend: "African Print Renaissance", region: westEurope.id, popularity: 72 },
    { trend: "Upcycled Denim", region: westEurope.id, popularity: 85 },
    { trend: "Upcycled Denim", region: northAm.id, popularity: 80 },
    { trend: "Capsule Wardrobes", region: westEurope.id, popularity: 90 },
    { trend: "Capsule Wardrobes", region: northAm.id, popularity: 82 },
    { trend: "Capsule Wardrobes", region: eastAsia.id, popularity: 75 },
    { trend: "Neo-Tailoring", region: westEurope.id, popularity: 88 },
    { trend: "Neo-Tailoring", region: eastAsia.id, popularity: 75 },
    { trend: "Digital Fashion", region: eastAsia.id, popularity: 85 },
    { trend: "Digital Fashion", region: northAm.id, popularity: 70 },
    { trend: "Artisan Knitwear", region: westEurope.id, popularity: 82 },
    { trend: "Artisan Knitwear", region: southAm.id, popularity: 70 },
    { trend: "Workleisure", region: northAm.id, popularity: 85 },
    { trend: "Workleisure", region: westEurope.id, popularity: 78 },
    { trend: "Techwear", region: eastAsia.id, popularity: 88 },
    { trend: "Techwear", region: northAm.id, popularity: 72 },
    { trend: "Modular Fashion", region: westEurope.id, popularity: 68 },
    { trend: "Modular Fashion", region: northAm.id, popularity: 62 },
  ];

  for (const tr of trendRegionData) {
    await prisma.trendRegion.create({
      data: { trendId: trends[tr.trend].id, regionId: tr.region, popularity: tr.popularity },
    });
  }

  console.log("Seeding trend-age group data...");
  const ageGroupData = [
    { trend: "Quiet Luxury", groups: { gen_z: 65, millennial: 88, gen_x: 92, boomer: 75 } },
    { trend: "Y2K Revival", groups: { gen_z: 95, millennial: 72, gen_x: 30, boomer: 10 } },
    { trend: "Gorpcore", groups: { gen_z: 82, millennial: 88, gen_x: 65, boomer: 40 } },
    { trend: "Regenerative Fashion", groups: { gen_z: 90, millennial: 85, gen_x: 70, boomer: 55 } },
    { trend: "Digital Fashion", groups: { gen_z: 92, millennial: 65, gen_x: 25, boomer: 8 } },
    { trend: "Gender-Fluid Fashion", groups: { gen_z: 90, millennial: 75, gen_x: 45, boomer: 20 } },
    { trend: "Workleisure", groups: { gen_z: 60, millennial: 90, gen_x: 85, boomer: 50 } },
    { trend: "Athleisure 2.0", groups: { gen_z: 88, millennial: 92, gen_x: 70, boomer: 45 } },
    { trend: "Neo-Tailoring", groups: { gen_z: 55, millennial: 80, gen_x: 85, boomer: 70 } },
    { trend: "Upcycled Denim", groups: { gen_z: 88, millennial: 78, gen_x: 50, boomer: 25 } },
    { trend: "Capsule Wardrobes", groups: { gen_z: 70, millennial: 90, gen_x: 82, boomer: 65 } },
    { trend: "African Print Renaissance", groups: { gen_z: 78, millennial: 82, gen_x: 68, boomer: 55 } },
    { trend: "Artisan Knitwear", groups: { gen_z: 60, millennial: 75, gen_x: 80, boomer: 85 } },
    { trend: "Techwear", groups: { gen_z: 90, millennial: 72, gen_x: 35, boomer: 12 } },
    { trend: "Cottagecore", groups: { gen_z: 70, millennial: 65, gen_x: 45, boomer: 55 } },
    { trend: "Dopamine Dressing", groups: { gen_z: 85, millennial: 72, gen_x: 48, boomer: 30 } },
    { trend: "Sheer Layering", groups: { gen_z: 75, millennial: 70, gen_x: 40, boomer: 15 } },
    { trend: "Modular Fashion", groups: { gen_z: 72, millennial: 68, gen_x: 55, boomer: 30 } },
  ];

  for (const ag of ageGroupData) {
    for (const [group, popularity] of Object.entries(ag.groups)) {
      await prisma.trendAgeGroup.create({
        data: { trendId: trends[ag.trend].id, ageGroup: group, popularity },
      });
    }
  }

  console.log("Seeding trend data points (time series)...");
  const baseDate = new Date("2025-06-01");
  for (const trendName of Object.keys(trends)) {
    const t = trendsData.find(td => td.name === trendName)!;
    const baseScore = t.trendScore;
    for (let i = 0; i < 12; i++) {
      const date = new Date(baseDate);
      date.setMonth(date.getMonth() + i);
      let variation = (Math.random() - 0.5) * 15;
      if (t.momentum === "rising") variation += i * 1.5;
      if (t.momentum === "declining") variation -= i * 1.2;
      const value = Math.max(10, Math.min(100, baseScore + variation));
      await prisma.trendDataPoint.create({
        data: { trendId: trends[trendName].id, date, value: Math.round(value * 10) / 10 },
      });
    }
  }

  console.log("Seeding lifecycle stages...");
  const stages = [
    { name: "demand", displayName: "Consumer Demand", description: "Market signals, consumer preferences, and purchase intent data", order: 1 },
    { name: "design", displayName: "Design & Development", description: "Trend interpretation, pattern making, and sample development", order: 2 },
    { name: "sourcing", displayName: "Material Sourcing", description: "Raw material procurement, fabric selection, and supplier negotiation", order: 3 },
    { name: "production", displayName: "Manufacturing", description: "Cutting, sewing, finishing, and quality control processes", order: 4 },
    { name: "warehousing", displayName: "Warehousing & Logistics", description: "Storage, inventory management, and distribution center operations", order: 5 },
    { name: "distribution", displayName: "Distribution", description: "Shipping, wholesale channels, and retail distribution networks", order: 6 },
    { name: "retail", displayName: "Retail & Consumer", description: "Point of sale, e-commerce, consumer experience, and post-purchase", order: 7 },
  ];

  const lifecycleStages: Record<string, { id: string }> = {};
  for (const s of stages) {
    lifecycleStages[s.name] = await prisma.lifecycleStage.create({ data: s });
  }

  console.log("Seeding lifecycle-trend insights...");
  const lifecycleTrendsData = [
    { stage: "demand", trend: "Quiet Luxury", insight: "Search volume for 'quiet luxury' up 340% YoY. Consumers shifting from logo-heavy to understated premium." },
    { stage: "demand", trend: "Athleisure 2.0", insight: "Athleisure market projected to reach $842B by 2028. Smart fabric demand growing 25% annually." },
    { stage: "demand", trend: "Regenerative Fashion", insight: "68% of Gen Z willing to pay premium for regeneratively-sourced garments." },
    { stage: "design", trend: "Gender-Fluid Fashion", insight: "Major fashion houses launching dedicated unisex lines. Pattern-making evolving for inclusive sizing." },
    { stage: "design", trend: "Digital Fashion", insight: "3D design tools reducing sample waste by 60%. Virtual prototyping becoming industry standard." },
    { stage: "design", trend: "Neo-Tailoring", insight: "Deconstructed tailoring requires new pattern-making techniques. CAD adoption up 45% in tailoring ateliers." },
    { stage: "sourcing", trend: "Regenerative Fashion", insight: "Regenerative cotton farms expanding 200% in India and Turkey. Premium of 15-30% over conventional." },
    { stage: "sourcing", trend: "Upcycled Denim", insight: "Post-consumer denim collection programs scaling. Sourcing costs 40% lower than virgin denim." },
    { stage: "sourcing", trend: "Artisan Knitwear", insight: "Demand for hand-spun yarns from Peru and Nepal growing. Fair-trade wool premiums stabilizing." },
    { stage: "production", trend: "Quiet Luxury", insight: "Italian and Portuguese ateliers at capacity. Lead times extending to 16-20 weeks for premium production." },
    { stage: "production", trend: "Gorpcore", insight: "Technical fabric bonding and seam-sealing capabilities in high demand. Vietnam and China leading production." },
    { stage: "production", trend: "Modular Fashion", insight: "Modular construction requires specialized machinery. Production costs 20-35% higher but offset by versatility." },
    { stage: "warehousing", trend: "Capsule Wardrobes", insight: "Lower SKU counts reducing warehouse complexity. JIT inventory models gaining traction." },
    { stage: "warehousing", trend: "Athleisure 2.0", insight: "Smart garment storage requires climate-controlled facilities. RFID tracking adoption at 78%." },
    { stage: "distribution", trend: "Digital Fashion", insight: "Zero physical distribution for virtual fashion. NFT delivery reducing carbon footprint to near zero." },
    { stage: "distribution", trend: "African Print Renaissance", insight: "Direct-to-consumer channels bypassing traditional wholesale. Social commerce driving 60% of sales." },
    { stage: "retail", trend: "Quiet Luxury", insight: "Experiential retail replacing traditional stores. Personal shopping appointments up 120%." },
    { stage: "retail", trend: "Y2K Revival", insight: "Vintage and resale platforms driving 45% of Y2K trend purchases. Depop and Vestiaire Collective leading." },
  ];

  for (const lt of lifecycleTrendsData) {
    await prisma.lifecycleTrend.create({
      data: {
        stageId: lifecycleStages[lt.stage].id,
        trendId: trends[lt.trend].id,
        insight: lt.insight,
      },
    });
  }

  console.log("Seeding certifications...");
  const certsData = [
    { name: "GOTS", description: "Global Organic Textile Standard — ensures organic status of textiles from harvesting through manufacturing", category: "environmental", issuingBody: "Global Standard gGmbH" },
    { name: "OEKO-TEX Standard 100", description: "Tests for harmful substances in textiles at every stage of production", category: "quality", issuingBody: "International OEKO-TEX Association" },
    { name: "Fair Trade Certified", description: "Ensures fair wages, safe conditions, and environmental protection for workers", category: "labor", issuingBody: "Fair Trade USA" },
    { name: "Bluesign", description: "Holistic system for sustainable textile production eliminating harmful substances", category: "environmental", issuingBody: "Bluesign Technologies" },
    { name: "B Corp Certified", description: "Meets highest standards of social and environmental performance and transparency", category: "environmental", issuingBody: "B Lab" },
    { name: "SA8000", description: "Social accountability standard for decent working conditions across industries", category: "labor", issuingBody: "Social Accountability International" },
    { name: "WRAP", description: "Worldwide Responsible Accredited Production — lawful, humane, and ethical manufacturing", category: "labor", issuingBody: "WRAP" },
    { name: "GRS", description: "Global Recycled Standard — tracks and verifies recycled content in products", category: "environmental", issuingBody: "Textile Exchange" },
    { name: "Cradle to Cradle", description: "Products designed for circular economy — safe, circular, and responsibly made", category: "environmental", issuingBody: "Cradle to Cradle Products Innovation Institute" },
    { name: "ISO 14001", description: "Environmental management system standard for reducing environmental impact", category: "environmental", issuingBody: "International Organization for Standardization" },
  ];

  const certs: Record<string, { id: string }> = {};
  for (const c of certsData) {
    certs[c.name] = await prisma.certification.create({ data: c });
  }

  console.log("Seeding suppliers...");
  const suppliersData = [
    { name: "Guangzhou Textiles Co.", countryName: "China", regionId: eastAsia.id, type: "manufacturer", capabilities: "mass production,denim,knitwear,activewear", minOrderQty: 1000, leadTimeDays: 45, costTier: "low", rating: 4.2, description: "Full-service garment manufacturer with 15 production lines. Specializes in denim and knitwear." },
    { name: "Shanghai Silk Works", countryName: "China", regionId: eastAsia.id, type: "fabric", capabilities: "silk,satin,organza,luxury fabrics", minOrderQty: 500, leadTimeDays: 30, costTier: "mid", rating: 4.5, description: "Premium silk and luxury fabric supplier with 50+ years of heritage." },
    { name: "Dhaka Garments Ltd.", countryName: "Bangladesh", regionId: southAsia.id, type: "manufacturer", capabilities: "t-shirts,basics,casual wear,mass production", minOrderQty: 3000, leadTimeDays: 60, costTier: "low", rating: 3.8, description: "Large-scale basics manufacturer. BSCI audited with focus on improving labor conditions." },
    { name: "Chittagong Knitwear", countryName: "Bangladesh", regionId: southAsia.id, type: "manufacturer", capabilities: "knitwear,sweaters,cardigans,jersey", minOrderQty: 2000, leadTimeDays: 55, costTier: "low", rating: 3.9, description: "Knitwear specialist with modern circular knitting machinery." },
    { name: "Saigon Apparel Group", countryName: "Vietnam", regionId: seAsia.id, type: "manufacturer", capabilities: "outerwear,technical garments,sportswear", minOrderQty: 1500, leadTimeDays: 50, costTier: "low", rating: 4.3, description: "Technical garment specialist. Nike and Adidas tier-2 supplier." },
    { name: "Ho Chi Minh Fabrics", countryName: "Vietnam", regionId: seAsia.id, type: "fabric", capabilities: "polyester,nylon,technical fabrics,performance textiles", minOrderQty: 800, leadTimeDays: 35, costTier: "low", rating: 4.1, description: "Synthetic and technical fabric supplier with Bluesign certification." },
    { name: "Milano Sartoria", countryName: "Italy", regionId: westEurope.id, type: "manufacturer", capabilities: "luxury tailoring,suits,coats,premium construction", minOrderQty: 100, leadTimeDays: 90, costTier: "high", rating: 4.9, description: "Master tailor workshop in Milan. Bespoke and small-batch luxury production." },
    { name: "Biella Wool Mills", countryName: "Italy", regionId: westEurope.id, type: "fabric", capabilities: "wool,cashmere,luxury suiting,premium knits", minOrderQty: 200, leadTimeDays: 45, costTier: "high", rating: 4.8, description: "World-renowned wool and cashmere mills. Supplying top luxury houses since 1920." },
    { name: "Porto Textil", countryName: "Portugal", regionId: westEurope.id, type: "manufacturer", capabilities: "sustainable fashion,organic basics,jersey,mid-range", minOrderQty: 300, leadTimeDays: 40, costTier: "mid", rating: 4.6, description: "Sustainable manufacturer with solar-powered facility. GOTS and OEKO-TEX certified." },
    { name: "Istanbul Denim Works", countryName: "Turkey", regionId: eastEurope.id, type: "manufacturer", capabilities: "denim,jeans,denim jackets,washed finishes", minOrderQty: 500, leadTimeDays: 35, costTier: "mid", rating: 4.4, description: "Premium denim specialist. Advanced washing and finishing capabilities." },
    { name: "Bursa Cotton Mills", countryName: "Turkey", regionId: eastEurope.id, type: "fabric", capabilities: "organic cotton,conventional cotton,jersey,poplin", minOrderQty: 1000, leadTimeDays: 25, costTier: "mid", rating: 4.2, description: "Major cotton fabric supplier. Increasing organic cotton production capacity." },
    { name: "Tirupur Exports", countryName: "India", regionId: southAsia.id, type: "manufacturer", capabilities: "t-shirts,polo shirts,basics,organic cotton garments", minOrderQty: 2000, leadTimeDays: 45, costTier: "low", rating: 4.0, description: "India's knitwear capital. Integrated spinning, knitting, and garment production." },
    { name: "Jaipur Hand Block", countryName: "India", regionId: southAsia.id, type: "fabric", capabilities: "hand block print,natural dyes,artisan textiles,cotton", minOrderQty: 100, leadTimeDays: 30, costTier: "mid", rating: 4.7, description: "Traditional hand block printing with natural dyes. Fair trade certified artisan workshop." },
    { name: "Seoul Fashion Tech", countryName: "South Korea", regionId: eastAsia.id, type: "manufacturer", capabilities: "smart textiles,technical fabrics,innovation,prototyping", minOrderQty: 200, leadTimeDays: 30, costTier: "high", rating: 4.6, description: "Cutting-edge smart textile manufacturer. R&D focused with rapid prototyping." },
    { name: "Addis Ababa Garments", countryName: "Ethiopia", regionId: africa.id, type: "manufacturer", capabilities: "basics,uniforms,cotton garments", minOrderQty: 5000, leadTimeDays: 75, costTier: "low", rating: 3.5, description: "Emerging manufacturing hub. Government-supported industrial park with competitive labor costs." },
    { name: "Casablanca Leather", countryName: "Morocco", regionId: africa.id, type: "fabric", capabilities: "leather,suede,exotic leathers,handbag materials", minOrderQty: 300, leadTimeDays: 40, costTier: "mid", rating: 4.1, description: "Traditional Moroccan leather tanning with modern finishing. Proximity to European markets." },
    { name: "Medellín Activewear", countryName: "Colombia", regionId: southAm.id, type: "manufacturer", capabilities: "activewear,swimwear,shapewear,compression garments", minOrderQty: 500, leadTimeDays: 35, costTier: "mid", rating: 4.3, description: "Latin America's activewear hub. Specialized in high-performance stretch fabrics." },
    { name: "São Paulo Denim", countryName: "Brazil", regionId: southAm.id, type: "manufacturer", capabilities: "denim,casual wear,sustainable denim", minOrderQty: 800, leadTimeDays: 40, costTier: "mid", rating: 4.0, description: "Brazilian denim manufacturer with advanced laser finishing and ozone washing." },
    { name: "Phnom Penh Garments", countryName: "Cambodia", regionId: seAsia.id, type: "manufacturer", capabilities: "basics,fast fashion,casual wear", minOrderQty: 3000, leadTimeDays: 50, costTier: "low", rating: 3.7, description: "Growing garment sector with improving infrastructure and labor standards." },
    { name: "Jakarta Textiles", countryName: "Indonesia", regionId: seAsia.id, type: "fabric", capabilities: "batik,cotton,rayon,traditional prints", minOrderQty: 500, leadTimeDays: 35, costTier: "low", rating: 4.0, description: "Traditional batik and modern textile production. UNESCO-recognized batik heritage." },
  ];

  const suppliers: Record<string, { id: string }> = {};
  for (const s of suppliersData) {
    suppliers[s.name] = await prisma.supplier.create({ data: s });
  }

  // Assign certifications to suppliers
  const supplierCerts = [
    { supplier: "Porto Textil", certs: ["GOTS", "OEKO-TEX Standard 100", "B Corp Certified"] },
    { supplier: "Milano Sartoria", certs: ["OEKO-TEX Standard 100", "ISO 14001"] },
    { supplier: "Biella Wool Mills", certs: ["OEKO-TEX Standard 100", "Bluesign"] },
    { supplier: "Ho Chi Minh Fabrics", certs: ["Bluesign", "GRS"] },
    { supplier: "Saigon Apparel Group", certs: ["WRAP", "SA8000"] },
    { supplier: "Istanbul Denim Works", certs: ["OEKO-TEX Standard 100", "GRS"] },
    { supplier: "Jaipur Hand Block", certs: ["Fair Trade Certified", "GOTS"] },
    { supplier: "Tirupur Exports", certs: ["SA8000", "WRAP", "OEKO-TEX Standard 100"] },
    { supplier: "Dhaka Garments Ltd.", certs: ["WRAP"] },
    { supplier: "Medellín Activewear", certs: ["OEKO-TEX Standard 100", "WRAP"] },
    { supplier: "Seoul Fashion Tech", certs: ["ISO 14001", "Bluesign"] },
    { supplier: "São Paulo Denim", certs: ["GRS", "Cradle to Cradle"] },
    { supplier: "Bursa Cotton Mills", certs: ["GOTS", "OEKO-TEX Standard 100"] },
  ];

  for (const sc of supplierCerts) {
    for (const certName of sc.certs) {
      await prisma.supplierCertification.create({
        data: { supplierId: suppliers[sc.supplier].id, certificationId: certs[certName].id },
      });
    }
  }

  console.log("Seeding ethical scores...");
  const ethicalScores = [
    { supplier: "Porto Textil", sustainability: 92, labor: 90, transparency: 88 },
    { supplier: "Milano Sartoria", sustainability: 78, labor: 88, transparency: 82 },
    { supplier: "Biella Wool Mills", sustainability: 80, labor: 85, transparency: 85 },
    { supplier: "Jaipur Hand Block", sustainability: 85, labor: 82, transparency: 78 },
    { supplier: "Saigon Apparel Group", sustainability: 68, labor: 72, transparency: 65 },
    { supplier: "Ho Chi Minh Fabrics", sustainability: 75, labor: 70, transparency: 68 },
    { supplier: "Dhaka Garments Ltd.", sustainability: 45, labor: 55, transparency: 50 },
    { supplier: "Chittagong Knitwear", sustainability: 48, labor: 58, transparency: 52 },
    { supplier: "Istanbul Denim Works", sustainability: 72, labor: 75, transparency: 70 },
    { supplier: "Guangzhou Textiles Co.", sustainability: 55, labor: 60, transparency: 52 },
    { supplier: "Seoul Fashion Tech", sustainability: 82, labor: 88, transparency: 85 },
    { supplier: "Tirupur Exports", sustainability: 62, labor: 68, transparency: 60 },
    { supplier: "Medellín Activewear", sustainability: 70, labor: 75, transparency: 72 },
    { supplier: "São Paulo Denim", sustainability: 74, labor: 72, transparency: 68 },
    { supplier: "Addis Ababa Garments", sustainability: 40, labor: 48, transparency: 42 },
    { supplier: "Casablanca Leather", sustainability: 50, labor: 62, transparency: 55 },
    { supplier: "Phnom Penh Garments", sustainability: 42, labor: 52, transparency: 48 },
    { supplier: "Jakarta Textiles", sustainability: 58, labor: 62, transparency: 55 },
    { supplier: "Shanghai Silk Works", sustainability: 60, labor: 65, transparency: 58 },
    { supplier: "Bursa Cotton Mills", sustainability: 70, labor: 72, transparency: 68 },
  ];

  for (const es of ethicalScores) {
    const overall = (es.sustainability + es.labor + es.transparency) / 3;
    await prisma.ethicalScore.create({
      data: {
        entityType: "supplier",
        entityId: suppliers[es.supplier].id,
        sustainabilityScore: es.sustainability,
        laborScore: es.labor,
        transparencyScore: es.transparency,
        overallScore: Math.round(overall * 10) / 10,
        supplierId: suppliers[es.supplier].id,
      },
    });
  }

  console.log("Seeding production hubs...");
  const hubsData = [
    { name: "Guangzhou-Shenzhen Corridor", countryName: "China", regionId: eastAsia.id, specialization: "Mass production, fast fashion, technical fabrics", laborCostIndex: 4.5, infrastructureScore: 9.2, description: "World's largest apparel manufacturing cluster. Integrated supply chain from fiber to finished garment.", yearlyOutput: "$45B" },
    { name: "Dhaka Industrial Zone", countryName: "Bangladesh", regionId: southAsia.id, specialization: "Basics, knitwear, mass-market garments", laborCostIndex: 1.5, infrastructureScore: 5.8, description: "Second-largest garment exporter globally. Rapid infrastructure modernization post-Rana Plaza.", yearlyOutput: "$38B" },
    { name: "Ho Chi Minh City Cluster", countryName: "Vietnam", regionId: seAsia.id, specialization: "Sportswear, outerwear, technical garments", laborCostIndex: 2.8, infrastructureScore: 7.5, description: "Fastest-growing garment hub. Major supplier for Nike, Adidas, and Uniqlo.", yearlyOutput: "$32B" },
    { name: "Istanbul-Bursa Textile Belt", countryName: "Turkey", regionId: eastEurope.id, specialization: "Denim, premium cotton, fast-turn production", laborCostIndex: 5.2, infrastructureScore: 8.0, description: "Europe's gateway manufacturer. Quick turnaround times and proximity to EU markets.", yearlyOutput: "$18B" },
    { name: "Tirupur Knitwear Cluster", countryName: "India", regionId: southAsia.id, specialization: "Cotton knitwear, t-shirts, organic basics", laborCostIndex: 2.0, infrastructureScore: 6.5, description: "India's knitwear capital producing 80% of country's cotton knitwear exports.", yearlyOutput: "$5B" },
    { name: "Porto-Braga Corridor", countryName: "Portugal", regionId: westEurope.id, specialization: "Sustainable fashion, mid-range, quality basics", laborCostIndex: 6.5, infrastructureScore: 8.5, description: "Europe's sustainable fashion hub. Known for quality, ethical production, and quick delivery to EU.", yearlyOutput: "$4B" },
    { name: "Milan Fashion District", countryName: "Italy", regionId: westEurope.id, specialization: "Luxury, haute couture, premium tailoring", laborCostIndex: 9.0, infrastructureScore: 9.5, description: "Global luxury fashion capital. Unmatched craftsmanship and premium material access.", yearlyOutput: "$22B" },
    { name: "Phnom Penh Special Economic Zone", countryName: "Cambodia", regionId: seAsia.id, specialization: "Basics, casual wear, fast fashion", laborCostIndex: 1.8, infrastructureScore: 5.0, description: "Growing manufacturing base with EBA trade preferences for EU market access.", yearlyOutput: "$10B" },
    { name: "Hawassa Industrial Park", countryName: "Ethiopia", regionId: africa.id, specialization: "Basics, uniforms, cotton garments", laborCostIndex: 1.0, infrastructureScore: 4.0, description: "Africa's first zero-emissions industrial park. Attracts global brands with lowest labor costs.", yearlyOutput: "$500M" },
    { name: "Medellín Fashion Hub", countryName: "Colombia", regionId: southAm.id, specialization: "Activewear, swimwear, shapewear", laborCostIndex: 3.5, infrastructureScore: 7.0, description: "Latin America's fashion innovation center. Strong in stretch fabrics and activewear.", yearlyOutput: "$2B" },
  ];

  for (const h of hubsData) {
    await prisma.productionHub.create({ data: h });
  }

  console.log("Seeding country compliance data...");
  const complianceData = [
    { code: "CN", laborLawSummary: "Labor Contract Law governs employment. 8-hour workday standard. Overtime regulated but enforcement varies by province.", minimumWage: "$2.30-5.50/hr (varies by province)", workingHoursLimit: "44 hrs/week + max 36 hrs OT/month", riskLevel: "medium" },
    { code: "BD", laborLawSummary: "Bangladesh Labour Act 2006 (amended 2018). Post-Rana Plaza reforms improving safety. Freedom of association concerns remain.", minimumWage: "$0.58/hr ($95/month)", workingHoursLimit: "48 hrs/week + 12 hrs OT", riskLevel: "high" },
    { code: "VN", laborLawSummary: "Labor Code 2019 improved worker protections. Independent unions now permitted. Strong enforcement in export zones.", minimumWage: "$1.00-1.40/hr (by region)", workingHoursLimit: "48 hrs/week + 40 hrs OT/month", riskLevel: "medium" },
    { code: "IN", laborLawSummary: "Multiple labor codes consolidated in 2020 reforms. Implementation ongoing. Informal sector remains a challenge.", minimumWage: "$0.80-2.00/hr (varies by state)", workingHoursLimit: "48 hrs/week", riskLevel: "medium" },
    { code: "TR", laborLawSummary: "Labor Law No. 4857 provides comprehensive protections. Syrian refugee labor exploitation is an ongoing concern.", minimumWage: "$2.80/hr", workingHoursLimit: "45 hrs/week", riskLevel: "medium" },
    { code: "IT", laborLawSummary: "Strong labor protections under Italian Civil Code and collective bargaining agreements. Well-enforced standards.", minimumWage: "Sector-negotiated (avg $12-15/hr)", workingHoursLimit: "40 hrs/week", riskLevel: "low" },
    { code: "PT", laborLawSummary: "Portuguese Labour Code provides robust protections. Strong union presence in textile sector.", minimumWage: "$5.20/hr ($820/month)", workingHoursLimit: "40 hrs/week", riskLevel: "low" },
    { code: "KH", laborLawSummary: "Labor Law and Prakas provide framework. Better Factories Cambodia (ILO) monitors compliance. Union suppression concerns.", minimumWage: "$0.75/hr ($200/month)", workingHoursLimit: "48 hrs/week", riskLevel: "high" },
    { code: "ET", laborLawSummary: "Labour Proclamation provides basic protections. Enforcement capacity limited. Industrial parks have separate oversight.", minimumWage: "$0.23/hr (no statutory minimum for all)", workingHoursLimit: "48 hrs/week", riskLevel: "high" },
    { code: "US", laborLawSummary: "Fair Labor Standards Act sets federal standards. State laws may exceed. Strong enforcement through DOL.", minimumWage: "$7.25-16.50/hr (federal/state)", workingHoursLimit: "40 hrs/week (OT after)", riskLevel: "low" },
    { code: "BR", laborLawSummary: "CLT provides comprehensive labor protections. Strong labor court system. Informal sector challenges persist.", minimumWage: "$1.80/hr", workingHoursLimit: "44 hrs/week", riskLevel: "medium" },
    { code: "CO", laborLawSummary: "Código Sustantivo del Trabajo provides protections. Improving enforcement and worker safety standards.", minimumWage: "$1.60/hr", workingHoursLimit: "47 hrs/week", riskLevel: "medium" },
    { code: "PK", laborLawSummary: "Provincial labor laws post-devolution. Enforcement weak. Child labor and safety remain significant concerns.", minimumWage: "$0.55/hr", workingHoursLimit: "48 hrs/week", riskLevel: "high" },
    { code: "ID", laborLawSummary: "Omnibus Law on Job Creation (2020) reformed labor regulations. Concerns about reduced protections.", minimumWage: "$1.10-1.80/hr (by province)", workingHoursLimit: "40 hrs/week", riskLevel: "medium" },
    { code: "MA", laborLawSummary: "Labour Code provides framework. Free trade zones have special regulations. Proximity to EU aids compliance.", minimumWage: "$1.50/hr", workingHoursLimit: "44 hrs/week", riskLevel: "medium" },
  ];

  for (const c of complianceData) {
    const country = countries[c.code];
    if (country) {
      await prisma.countryCompliance.create({
        data: {
          countryId: country.id,
          laborLawSummary: c.laborLawSummary,
          minimumWage: c.minimumWage,
          workingHoursLimit: c.workingHoursLimit,
          riskLevel: c.riskLevel,
        },
      });
    }
  }

  console.log("Seeding materials...");
  const materialsData = [
    { name: "Organic Cotton", category: "natural", environmentalImpact: "low", renewability: "renewable", carbonFootprint: 5.9, waterUsage: 6800, description: "Grown without synthetic pesticides or fertilizers. Supports soil health and biodiversity.", alternatives: "Recycled Cotton,Hemp,Linen" },
    { name: "Conventional Cotton", category: "natural", environmentalImpact: "high", renewability: "renewable", carbonFootprint: 8.3, waterUsage: 10000, description: "Most widely used natural fiber. High water and pesticide usage in conventional farming.", alternatives: "Organic Cotton,Hemp,Tencel" },
    { name: "Polyester", category: "synthetic", environmentalImpact: "high", renewability: "non-renewable", carbonFootprint: 21.0, waterUsage: 62, description: "Most used fiber globally. Derived from petroleum. Sheds microplastics in washing.", alternatives: "Recycled Polyester,Tencel,Organic Cotton" },
    { name: "Recycled Polyester", category: "synthetic", environmentalImpact: "medium", renewability: "partially-renewable", carbonFootprint: 11.2, waterUsage: 45, description: "Made from post-consumer PET bottles. Reduces virgin plastic use but still sheds microplastics.", alternatives: "Tencel,Organic Cotton,Hemp" },
    { name: "Linen", category: "natural", environmentalImpact: "low", renewability: "renewable", carbonFootprint: 4.0, waterUsage: 2500, description: "Made from flax. Requires minimal water and pesticides. Naturally biodegradable.", alternatives: "Hemp,Organic Cotton" },
    { name: "Hemp", category: "natural", environmentalImpact: "low", renewability: "renewable", carbonFootprint: 3.5, waterUsage: 2100, description: "Fast-growing, requires no pesticides. Improves soil health. Naturally UV resistant.", alternatives: "Linen,Organic Cotton" },
    { name: "Tencel/Lyocell", category: "semi-synthetic", environmentalImpact: "low", renewability: "renewable", carbonFootprint: 5.5, waterUsage: 3000, description: "Made from sustainably harvested wood pulp in closed-loop process. Biodegradable.", alternatives: "Organic Cotton,Linen,Modal" },
    { name: "Viscose/Rayon", category: "semi-synthetic", environmentalImpact: "medium", renewability: "renewable", carbonFootprint: 9.2, waterUsage: 5500, description: "Wood pulp-based fiber. Chemical-intensive production process raises environmental concerns.", alternatives: "Tencel/Lyocell,Modal" },
    { name: "Wool", category: "natural", environmentalImpact: "medium", renewability: "renewable", carbonFootprint: 17.0, waterUsage: 4800, description: "Natural protein fiber from sheep. Concerns about land use, methane emissions, and mulesing.", alternatives: "Recycled Wool,Alpaca,Organic Cotton" },
    { name: "Cashmere", category: "natural", environmentalImpact: "high", renewability: "renewable", carbonFootprint: 28.0, waterUsage: 6000, description: "Luxury fiber from cashmere goats. Overgrazing causing desertification in Mongolia.", alternatives: "Recycled Cashmere,Yak Wool,Merino Wool" },
    { name: "Nylon", category: "synthetic", environmentalImpact: "high", renewability: "non-renewable", carbonFootprint: 24.0, waterUsage: 85, description: "Strong synthetic fiber from petroleum. Energy-intensive production. Used in activewear.", alternatives: "Recycled Nylon,Tencel,Hemp" },
    { name: "Recycled Nylon (Econyl)", category: "synthetic", environmentalImpact: "medium", renewability: "partially-renewable", carbonFootprint: 12.5, waterUsage: 60, description: "Made from ocean waste and discarded fishing nets. Same quality as virgin nylon.", alternatives: "Tencel,Organic Cotton" },
    { name: "Bamboo", category: "semi-synthetic", environmentalImpact: "medium", renewability: "renewable", carbonFootprint: 7.0, waterUsage: 2800, description: "Fast-growing plant but chemical processing raises concerns. Mechanical bamboo is more sustainable.", alternatives: "Tencel/Lyocell,Hemp,Linen" },
    { name: "Silk", category: "natural", environmentalImpact: "medium", renewability: "renewable", carbonFootprint: 15.0, waterUsage: 3500, description: "Luxury natural fiber. Concerns about boiling silkworms alive. Peace silk alternatives exist.", alternatives: "Tencel/Lyocell,Cupro" },
    { name: "Leather", category: "natural", environmentalImpact: "high", renewability: "renewable", carbonFootprint: 65.0, waterUsage: 17000, description: "Animal hide with heavy environmental footprint from cattle farming and tanning chemicals.", alternatives: "Mushroom Leather,Piñatex,Recycled Leather" },
  ];

  for (const m of materialsData) {
    await prisma.material.create({ data: m });
  }

  console.log("Seeding data sources...");
  const dataSources = [
    { name: "TikTok Fashion Trends", type: "social", url: "https://api.tiktok.com/trends/fashion", status: "active" },
    { name: "Instagram Style Explorer", type: "social", url: "https://graph.instagram.com/explore/fashion", status: "active" },
    { name: "Pinterest Trend Insights", type: "social", url: "https://api.pinterest.com/trends", status: "active" },
    { name: "Business of Fashion", type: "news", url: "https://www.businessoffashion.com/rss", status: "active" },
    { name: "WWD - Women's Wear Daily", type: "news", url: "https://wwd.com/feed", status: "active" },
    { name: "Vogue Business", type: "news", url: "https://www.voguebusiness.com/rss", status: "active" },
    { name: "UN Comtrade", type: "trade", url: "https://comtradeapi.un.org/data/v1", status: "active" },
    { name: "US International Trade Commission", type: "trade", url: "https://dataweb.usitc.gov/api", status: "active" },
    { name: "EU Textile Trade Data", type: "trade", url: "https://trade.ec.europa.eu/api", status: "active" },
  ];

  for (const ds of dataSources) {
    await prisma.dataSource.create({ data: ds });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
