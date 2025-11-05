import clsx from "clsx";
import React from "react";

export type SummaryCardProps = {
  label: string;
  value: string | number;
  change: string;
  changeDirection: "up" | "down";
  description: string;
  accent: string;
};

export function SummaryCard({
  label,
  value,
  change,
  changeDirection,
  description,
  accent
}: SummaryCardProps) {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-center gap-4">
        <div
          className="size-12 rounded-2xl"
          style={{ background: `${accent}1a`, color: accent }}
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            changeDirection === "up"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          )}
        >
          {changeDirection === "up" ? "▲" : "▼"} {change}
        </span>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </article>
  );
}
