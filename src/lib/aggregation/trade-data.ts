import type { AggregationAdapter, RawDataItem, NormalizedTrendSignal } from "./index";

export class TradeDataAdapter implements AggregationAdapter {
  name = "Government & Trade Data";
  type = "trade" as const;

  async fetch(): Promise<RawDataItem[]> {
    // Mock data simulating government trade APIs
    // In production, this would call UN Comtrade, USITC, EU trade APIs
    return [
      { source: "un_comtrade", content: JSON.stringify({ commodity: "Cotton textiles", exportVolume: 45000000000, yoyChange: 8.5, topExporter: "China", topImporter: "EU" }), timestamp: new Date() },
      { source: "un_comtrade", content: JSON.stringify({ commodity: "Synthetic fabrics", exportVolume: 32000000000, yoyChange: 12.3, topExporter: "China", topImporter: "US" }), timestamp: new Date() },
      { source: "usitc", content: JSON.stringify({ commodity: "Knitted garments", importValue: 28000000000, tariffRate: 12, origin: "Vietnam", yoyChange: 15.2 }), timestamp: new Date() },
      { source: "usitc", content: JSON.stringify({ commodity: "Denim products", importValue: 8500000000, tariffRate: 8, origin: "Bangladesh", yoyChange: 6.7 }), timestamp: new Date() },
      { source: "eu_trade", content: JSON.stringify({ commodity: "Luxury apparel", importValue: 18000000000, yoyChange: -2.1, origin: "Italy", destination: "Intra-EU" }), timestamp: new Date() },
      { source: "eu_trade", content: JSON.stringify({ commodity: "Sustainable textiles", importValue: 4500000000, yoyChange: 28.5, origin: "Portugal", destination: "EU" }), timestamp: new Date() },
    ];
  }

  normalize(items: RawDataItem[]): NormalizedTrendSignal[] {
    return items.map((item) => {
      const data = JSON.parse(item.content);
      const signal = Math.min(100, Math.max(0, 50 + data.yoyChange * 2));

      return {
        trendName: data.commodity,
        category: "trade",
        signal: Math.round(signal),
        region: data.topExporter || data.origin,
        source: item.source,
        timestamp: item.timestamp,
      };
    });
  }
}
