import { NextResponse } from "next/server";
import { runAggregation } from "@/lib/aggregation";
import { SocialMediaAdapter } from "@/lib/aggregation/social-media";
import { NewsFeedAdapter } from "@/lib/aggregation/news-feeds";
import { TradeDataAdapter } from "@/lib/aggregation/trade-data";

export async function POST() {
  const adapters = [
    new SocialMediaAdapter(),
    new NewsFeedAdapter(),
    new TradeDataAdapter(),
  ];

  const results = await runAggregation(adapters);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    signalsCollected: results.length,
    signals: results,
    sources: adapters.map((a) => ({ name: a.name, type: a.type })),
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    adapters: [
      { name: "Social Media Trends", type: "social", sources: ["TikTok", "Instagram", "Pinterest"] },
      { name: "Fashion News & Trade Publications", type: "news", sources: ["Business of Fashion", "WWD", "Vogue Business"] },
      { name: "Government & Trade Data", type: "trade", sources: ["UN Comtrade", "USITC", "EU Trade"] },
    ],
    note: "POST to this endpoint to trigger data aggregation. Currently using mock data adapters.",
  });
}
