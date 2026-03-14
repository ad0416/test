"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LifecycleTrendItem {
  id: string;
  insight: string;
  trend: { name: string; category: string };
}

interface StageData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  order: number;
  trends: LifecycleTrendItem[];
}

const stageColors: Record<string, string> = {
  demand: "border-blue-400 bg-blue-50 text-blue-800",
  design: "border-purple-400 bg-purple-50 text-purple-800",
  sourcing: "border-amber-400 bg-amber-50 text-amber-800",
  production: "border-green-400 bg-green-50 text-green-800",
  warehousing: "border-slate-400 bg-slate-50 text-slate-800",
  distribution: "border-cyan-400 bg-cyan-50 text-cyan-800",
  retail: "border-rose-400 bg-rose-50 text-rose-800",
};

const stageAccent: Record<string, string> = {
  demand: "bg-blue-500",
  design: "bg-purple-500",
  sourcing: "bg-amber-500",
  production: "bg-green-500",
  warehousing: "bg-slate-500",
  distribution: "bg-cyan-500",
  retail: "bg-rose-500",
};

export function LifecycleFlow({ stages }: { stages: StageData[] }) {
  const [activeStage, setActiveStage] = useState<string>(stages[0]?.id ?? "");

  const activeData = stages.find((s) => s.id === activeStage);

  return (
    <div className="space-y-8">
      {/* Flow visualization */}
      <div className="flex flex-col md:flex-row items-stretch gap-2 overflow-x-auto pb-4">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all hover:shadow-md min-w-[140px]",
                stageColors[stage.name],
                activeStage === stage.id && "ring-2 ring-offset-2 ring-blue-500 shadow-lg"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold", stageAccent[stage.name])}>
                  {stage.order}
                </span>
                <span className="font-semibold text-sm">{stage.displayName}</span>
              </div>
              <p className="text-xs opacity-75 mt-1">{stage.trends.length} insights</p>
            </button>
            {i < stages.length - 1 && (
              <ChevronRight className="w-5 h-5 text-gray-400 hidden md:block flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Detail section */}
      {activeData && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={cn("w-8 h-8 rounded-full text-white flex items-center justify-center font-bold", stageAccent[activeData.name])}>
              {activeData.order}
            </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{activeData.displayName}</h3>
              <p className="text-sm text-gray-500">{activeData.description}</p>
            </div>
          </div>

          {activeData.trends.length > 0 ? (
            <div className="space-y-4 mt-6">
              {activeData.trends.map((lt) => (
                <div key={lt.id} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex-shrink-0">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {lt.trend.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{lt.insight}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-4">No trend insights available for this stage yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
