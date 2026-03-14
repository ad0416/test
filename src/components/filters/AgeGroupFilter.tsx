"use client";

import { cn } from "@/lib/utils";

interface AgeGroupFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const AGE_GROUPS = [
  { value: "", label: "All Age Groups" },
  { value: "gen_z", label: "Gen Z" },
  { value: "millennials", label: "Millennials" },
  { value: "gen_x", label: "Gen X" },
  { value: "boomers", label: "Boomers" },
];

export default function AgeGroupFilter({
  value,
  onChange,
  className,
}: AgeGroupFilterProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-xs font-medium text-muted">Age Group</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
      >
        {AGE_GROUPS.map((group) => (
          <option key={group.value} value={group.value}>
            {group.label}
          </option>
        ))}
      </select>
    </div>
  );
}
