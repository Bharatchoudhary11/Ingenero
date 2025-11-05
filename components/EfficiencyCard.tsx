import clsx from "clsx";
import React from "react";

export type EfficiencyMetric = {
  id: string;
  label: string;
  score: number;
  benchmark: number;
  trend: "up" | "down";
};

type EfficiencyCardProps = {
  metric: EfficiencyMetric;
};

export function EfficiencyCard({ metric }: EfficiencyCardProps) {
  const delta = metric.score - metric.benchmark;
  const deltaLabel = `${delta > 0 ? "+" : ""}${delta}`;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400">
          {metric.label}
        </p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metric.score}%
        </p>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Benchmark {metric.benchmark}%</span>
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            metric.trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          )}
        >
          {metric.trend === "up" ? "▲" : "▼"} {deltaLabel}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100">
        <div
          className={clsx(
            "h-2 rounded-full",
            metric.trend === "up" ? "bg-primary" : "bg-amber-400"
          )}
          style={{ width: `${metric.score}%` }}
        />
      </div>
    </article>
  );
}
