"use client";

import { cn } from "@/lib/utils";

interface RegionFilterProps {
  regions: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function RegionFilter({
  regions,
  value,
  onChange,
  className,
}: RegionFilterProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-xs font-medium text-muted">Region</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
    </div>
  );
}
