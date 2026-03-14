import type { AggregationAdapter, RawDataItem, NormalizedTrendSignal } from "./index";

export class SocialMediaAdapter implements AggregationAdapter {
  name = "Social Media Trends";
  type = "social" as const;

  async fetch(): Promise<RawDataItem[]> {
    // Mock data simulating social media trend signals
    // In production, this would call TikTok, Instagram, Pinterest APIs
    return [
      { source: "tiktok", content: JSON.stringify({ trend: "Quiet Luxury", hashtag_count: 2400000, growth_rate: 45 }), timestamp: new Date() },
      { source: "tiktok", content: JSON.stringify({ trend: "Gorpcore", hashtag_count: 1800000, growth_rate: 38 }), timestamp: new Date() },
      { source: "instagram", content: JSON.stringify({ trend: "Y2K Revival", post_count: 5600000, engagement_rate: 4.2 }), timestamp: new Date() },
      { source: "instagram", content: JSON.stringify({ trend: "Athleisure 2.0", post_count: 3200000, engagement_rate: 5.1 }), timestamp: new Date() },
      { source: "pinterest", content: JSON.stringify({ trend: "Capsule Wardrobes", pin_count: 890000, save_rate: 12.5 }), timestamp: new Date() },
      { source: "pinterest", content: JSON.stringify({ trend: "Regenerative Fashion", pin_count: 450000, save_rate: 18.2 }), timestamp: new Date() },
      { source: "tiktok", content: JSON.stringify({ trend: "Gender-Fluid Fashion", hashtag_count: 980000, growth_rate: 62 }), timestamp: new Date() },
      { source: "instagram", content: JSON.stringify({ trend: "Upcycled Denim", post_count: 1200000, engagement_rate: 3.8 }), timestamp: new Date() },
    ];
  }

  normalize(items: RawDataItem[]): NormalizedTrendSignal[] {
    return items.map((item) => {
      const data = JSON.parse(item.content);
      let signal = 50;

      if (data.growth_rate) signal = Math.min(100, data.growth_rate * 1.5);
      else if (data.engagement_rate) signal = Math.min(100, data.engagement_rate * 15);
      else if (data.save_rate) signal = Math.min(100, data.save_rate * 5);

      return {
        trendName: data.trend,
        category: "detected",
        signal: Math.round(signal),
        source: item.source,
        timestamp: item.timestamp,
      };
    });
  }
}
