"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Clock, Package, DollarSign, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupplierData {
  id: string;
  name: string;
  countryName: string;
  type: string;
  capabilities: string;
  minOrderQty: number;
  leadTimeDays: number;
  costTier: string;
  rating: number;
  description: string | null;
  ethicalScore: { overallScore: number } | null;
  certifications: { certification: { name: string } }[];
}

interface HubData {
  id: string;
  name: string;
  countryName: string;
  specialization: string;
  laborCostIndex: number;
  infrastructureScore: number;
  description: string;
  yearlyOutput: string | null;
}

const costColors = {
  low: "bg-emerald-100 text-emerald-800",
  mid: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function SourcingDirectory({
  suppliers,
  hubs,
}: {
  suppliers: SupplierData[];
  hubs: HubData[];
}) {
  const [activeTab, setActiveTab] = useState<"suppliers" | "hubs">("suppliers");
  const [search, setSearch] = useState("");
  const [costFilter, setCostFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredSuppliers = useMemo(() => {
    let result = suppliers;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.countryName.toLowerCase().includes(q) ||
          s.capabilities.toLowerCase().includes(q)
      );
    }
    if (costFilter) result = result.filter((s) => s.costTier === costFilter);
    if (typeFilter) result = result.filter((s) => s.type === typeFilter);
    return result;
  }, [suppliers, search, costFilter, typeFilter]);

  const filteredHubs = useMemo(() => {
    if (!search) return hubs;
    const q = search.toLowerCase();
    return hubs.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.countryName.toLowerCase().includes(q) ||
        h.specialization.toLowerCase().includes(q)
    );
  }, [hubs, search]);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("suppliers")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === "suppliers" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Suppliers ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveTab("hubs")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === "hubs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Production Hubs ({hubs.length})
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, country, or capability..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {activeTab === "suppliers" && (
          <>
            <select
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Cost Tiers</option>
              <option value="low">Low Cost</option>
              <option value="mid">Mid Cost</option>
              <option value="high">High Cost</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Types</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="fabric">Fabric</option>
              <option value="trim">Trim</option>
              <option value="packaging">Packaging</option>
            </select>
          </>
        )}
      </div>

      {/* Results */}
      {activeTab === "suppliers" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((s) => (
            <Link
              key={s.id}
              href={`/sourcing/${s.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {s.countryName}
                  </div>
                </div>
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium", costColors[s.costTier as keyof typeof costColors])}>
                  {s.costTier} cost
                </span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("w-3.5 h-3.5", i < Math.round(s.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">{s.rating}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-600 mb-3">
                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> MOQ: {s.minOrderQty.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.leadTimeDays}d</span>
                <span className="flex items-center gap-1"><Factory className="w-3 h-3" /> {s.type}</span>
              </div>
              {s.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {s.certifications.map((c, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {c.certification.name}
                    </span>
                  ))}
                </div>
              )}
              {s.ethicalScore && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Ethical Score</span>
                  <span className={cn("font-semibold text-sm",
                    s.ethicalScore.overallScore >= 75 ? "text-emerald-600" :
                    s.ethicalScore.overallScore >= 55 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {s.ethicalScore.overallScore.toFixed(0)}/100
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHubs.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">{h.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {h.countryName}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{h.description}</p>
              <div className="text-xs text-gray-500 mb-3">{h.specialization}</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Labor Cost Index</span>
                    <span className="text-gray-700">{h.laborCostIndex}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${h.laborCostIndex * 10}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Infrastructure</span>
                    <span className="text-gray-700">{h.infrastructureScore}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${h.infrastructureScore * 10}%` }} />
                  </div>
                </div>
              </div>
              {h.yearlyOutput && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-sm">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">Yearly Output: <strong>{h.yearlyOutput}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
