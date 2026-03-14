"use client";

import { cn } from "@/lib/utils";

interface FilterConfig {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  className?: string;
}

export default function FilterPanel({ filters, className }: FilterPanelProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {filters.map((filter) => (
        <div key={filter.label} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">
            {filter.label}
          </label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
