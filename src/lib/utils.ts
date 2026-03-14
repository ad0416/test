import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-800";
  if (score >= 60) return "bg-yellow-100 text-yellow-800";
  if (score >= 40) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export function getMomentumColor(momentum: string): string {
  switch (momentum) {
    case "rising": return "text-emerald-600";
    case "stable": return "text-blue-600";
    case "declining": return "text-red-600";
    default: return "text-gray-600";
  }
}

export function getMomentumIcon(momentum: string): string {
  switch (momentum) {
    case "rising": return "trending-up";
    case "stable": return "minus";
    case "declining": return "trending-down";
    default: return "minus";
  }
}

export const AGE_GROUPS = [
  { value: "gen_z", label: "Gen Z (18-27)" },
  { value: "millennial", label: "Millennials (28-43)" },
  { value: "gen_x", label: "Gen X (44-59)" },
  { value: "boomer", label: "Boomers (60+)" },
];

export const CATEGORIES = [
  "streetwear", "luxury", "athleisure", "sustainable",
  "casual", "formal", "activewear", "denim", "knitwear",
];

export const RISK_LEVELS = {
  low: { color: "bg-emerald-100 text-emerald-800", label: "Low Risk" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium Risk" },
  high: { color: "bg-red-100 text-red-800", label: "High Risk" },
};
