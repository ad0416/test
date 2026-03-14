"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RegionMapProps {
  data: Array<{ region: string; popularity: number }>;
}

export default function RegionMap({ data }: RegionMapProps) {
  const sortedData = [...data].sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">
          Trend Popularity by Region
        </h3>
        <p className="mt-1 text-sm text-muted">
          Average trend popularity across regions
        </p>
      </div>
      <div className="px-6 py-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              domain={[0, 100]}
            />
            <YAxis
              dataKey="region"
              type="category"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}`, "Popularity"]}
            />
            <Bar dataKey="popularity" radius={[0, 4, 4, 0]}>
              {sortedData.map((_, index) => {
                const opacity = 1 - index * 0.12;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(59, 130, 246, ${Math.max(opacity, 0.3)})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
