import React from "react";

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
};

type QuickActionCardProps = {
  action: QuickAction;
};

export function QuickActionCard({ action }: QuickActionCardProps) {
  return (
    <a
      href={action.href}
      className="group flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-xl"
    >
      <span className="text-sm font-semibold text-gray-900 group-hover:text-primary">
        {action.label}
      </span>
      <p className="text-sm text-gray-500">{action.description}</p>
      <span className="text-xs font-semibold uppercase tracking-widest text-primary group-hover:underline">
        Open
      </span>
    </a>
  );
}
