"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

interface Material {
  id: string;
  name: string;
  category: string;
  environmentalImpact: string;
  renewability: string;
  carbonFootprint: number;
  waterUsage: number;
  description: string;
}

export function MaterialsTable({ materials }: { materials: Material[] }) {
  const [sortKey, setSortKey] = useState<"carbonFootprint" | "waterUsage">("carbonFootprint");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = [...materials].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    return (a[sortKey] - b[sortKey]) * mul;
  });

  function toggleSort(key: "carbonFootprint" | "waterUsage") {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const impactColors = {
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const categoryColors = {
    natural: "bg-green-100 text-green-800",
    synthetic: "bg-gray-100 text-gray-800",
    "semi-synthetic": "bg-blue-100 text-blue-800",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Material</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Impact</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Renewability</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort("carbonFootprint")}>
              <span className="flex items-center gap-1">
                CO2 (kg/kg) <ArrowUpDown className="w-3 h-3" />
              </span>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort("waterUsage")}>
              <span className="flex items-center gap-1">
                Water (L/kg) <ArrowUpDown className="w-3 h-3" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{m.description}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[m.category as keyof typeof categoryColors] ?? "bg-gray-100 text-gray-800"}`}>
                  {m.category}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full ${impactColors[m.environmentalImpact as keyof typeof impactColors]}`}>
                  {m.environmentalImpact}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">{m.renewability}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (m.carbonFootprint / 65) * 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-700">{m.carbonFootprint}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (m.waterUsage / 17000) * 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-700">{m.waterUsage.toLocaleString()}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
