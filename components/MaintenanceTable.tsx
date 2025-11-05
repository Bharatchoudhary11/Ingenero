import clsx from "clsx";
import React from "react";

export type MaintenanceItem = {
  id: string;
  task: string;
  facility: string;
  owner: string;
  dueInDays: number;
  status: "In progress" | "Blocked" | "Scheduled";
  priority: "Critical" | "High" | "Medium" | "Low";
};

type MaintenanceTableProps = {
  items: MaintenanceItem[];
};

const statusBadgeStyles = {
  "In progress": "bg-blue-50 text-blue-600",
  Blocked: "bg-rose-50 text-rose-600",
  Scheduled: "bg-emerald-50 text-emerald-600"
} as const;

const priorityStyles = {
  Critical:
    "border-rose-200 bg-rose-50 text-rose-600 before:bg-rose-500 before:shadow-[0_0_0_2px_rgba(244,63,94,0.25)]",
  High: "border-amber-200 bg-amber-50 text-amber-600 before:bg-amber-400",
  Medium: "border-blue-200 bg-blue-50 text-blue-600 before:bg-blue-400",
  Low: "border-gray-200 bg-gray-50 text-gray-500 before:bg-gray-300"
} as const;

export function MaintenanceTable({ items }: MaintenanceTableProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Maintenance pipeline
          </h2>
          <p className="text-sm text-gray-500">
            Immediate actions sorted by criticality
          </p>
        </div>
        <button className="text-sm font-semibold text-primary hover:underline">
          Export CSV
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Facility</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Due in</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4 font-semibold text-gray-900">
                  <div className="flex flex-col">
                    <span>{item.task}</span>
                    <span className="text-xs font-medium text-gray-400">
                      {item.id}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600">{item.facility}</td>
                <td className="px-4 py-4 text-gray-600">{item.owner}</td>
                <td className="px-4 py-4 text-gray-600">
                  {item.dueInDays} days
                </td>
                <td className="px-4 py-4">
                  <span
                    className={clsx(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                      statusBadgeStyles[item.status]
                    )}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={clsx(
                      "relative inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold before:inline-block before:h-2 before:w-2 before:rounded-full",
                      priorityStyles[item.priority]
                    )}
                  >
                    {item.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
