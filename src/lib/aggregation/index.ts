export interface AggregationAdapter {
  name: string;
  type: "social" | "news" | "trade";
  fetch(): Promise<RawDataItem[]>;
  normalize(items: RawDataItem[]): NormalizedTrendSignal[];
}

export interface RawDataItem {
  source: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface NormalizedTrendSignal {
  trendName: string;
  category: string;
  signal: number; // 0-100
  region?: string;
  ageGroup?: string;
  source: string;
  timestamp: Date;
}

export async function runAggregation(adapters: AggregationAdapter[]): Promise<NormalizedTrendSignal[]> {
  const results: NormalizedTrendSignal[] = [];

  for (const adapter of adapters) {
    try {
      const raw = await adapter.fetch();
      const normalized = adapter.normalize(raw);
      results.push(...normalized);
    } catch (error) {
      console.error(`Aggregation error for ${adapter.name}:`, error);
    }
  }

  return results;
}
