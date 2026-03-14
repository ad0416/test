"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "streetwear", label: "Streetwear" },
  { value: "luxury", label: "Luxury" },
  { value: "athleisure", label: "Athleisure" },
  { value: "sustainable", label: "Sustainable" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "activewear", label: "Activewear" },
  { value: "denim", label: "Denim" },
  { value: "knitwear", label: "Knitwear" },
];

export default function CategoryFilter({
  value,
  onChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-xs font-medium text-muted">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
