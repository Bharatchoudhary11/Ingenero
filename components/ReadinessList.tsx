import clsx from "clsx";
import React from "react";

export type ReadinessItem = {
  facility: string;
  readiness: number;
  status: "Green" | "Amber" | "Red";
};

type ReadinessListProps = {
  items: ReadinessItem[];
  selectedStatus: string;
};

const statusColors = {
  Green: "bg-emerald-500",
  Amber: "bg-amber-400",
  Red: "bg-rose-500"
} as const;

export function ReadinessList({ items, selectedStatus }: ReadinessListProps) {
  const filtered =
    selectedStatus === "All"
      ? items
      : items.filter((item) => item.status === selectedStatus);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Site readiness
          </h2>
          <p className="text-sm text-gray-500">
            Status transitioned in the last 24 hours
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Filter: {selectedStatus}
        </span>
      </header>

      <ol className="flex flex-col gap-4">
        {filtered.map((item) => (
          <li
            key={item.facility}
            className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "inline-flex size-2 rounded-full",
                  statusColors[item.status]
                )}
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.facility}
                </p>
                <p className="text-xs text-gray-500">Status: {item.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-24 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${item.readiness}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {item.readiness}%
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
