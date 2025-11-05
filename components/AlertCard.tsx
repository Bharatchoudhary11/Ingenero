import clsx from "clsx";
import React from "react";

export type Alert = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "Critical" | "Warning";
};

type AlertCardProps = {
  alert: Alert;
};

export function AlertCard({ alert }: AlertCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            alert.type === "Critical"
              ? "bg-rose-50 text-rose-600"
              : "bg-amber-50 text-amber-600"
          )}
        >
          {alert.type}
        </span>
        <span className="text-xs uppercase tracking-wider text-gray-400">
          {alert.time}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
      </div>
      <button className="self-start text-sm font-semibold text-primary hover:underline">
        View incident
      </button>
    </article>
  );
}
