import type { AggregationAdapter, RawDataItem, NormalizedTrendSignal } from "./index";

export class NewsFeedAdapter implements AggregationAdapter {
  name = "Fashion News & Trade Publications";
  type = "news" as const;

  async fetch(): Promise<RawDataItem[]> {
    // Mock data simulating fashion news RSS/API feeds
    // In production, this would parse RSS feeds from BoF, WWD, Vogue Business
    return [
      { source: "business_of_fashion", content: JSON.stringify({ headline: "Quiet Luxury Continues to Dominate Spring Collections", sentiment: 0.85, relevance: 95, category: "luxury" }), timestamp: new Date() },
      { source: "wwd", content: JSON.stringify({ headline: "Sustainability Takes Center Stage at Paris Fashion Week", sentiment: 0.78, relevance: 88, category: "sustainable" }), timestamp: new Date() },
      { source: "vogue_business", content: JSON.stringify({ headline: "Gen Z Drives Demand for Gender-Neutral Fashion Lines", sentiment: 0.72, relevance: 82, category: "casual" }), timestamp: new Date() },
      { source: "business_of_fashion", content: JSON.stringify({ headline: "Technical Outdoor Fabrics See 40% Growth in Luxury Segment", sentiment: 0.80, relevance: 90, category: "athleisure" }), timestamp: new Date() },
      { source: "wwd", content: JSON.stringify({ headline: "African Designers Break Into Global Fashion Market", sentiment: 0.90, relevance: 85, category: "streetwear" }), timestamp: new Date() },
      { source: "vogue_business", content: JSON.stringify({ headline: "Smart Textiles Market Expected to Triple by 2028", sentiment: 0.75, relevance: 78, category: "activewear" }), timestamp: new Date() },
    ];
  }

  normalize(items: RawDataItem[]): NormalizedTrendSignal[] {
    return items.map((item) => {
      const data = JSON.parse(item.content);
      const signal = Math.round(data.sentiment * data.relevance);

      return {
        trendName: data.headline,
        category: data.category,
        signal: Math.min(100, signal),
        source: item.source,
        timestamp: item.timestamp,
      };
    });
  }
}
