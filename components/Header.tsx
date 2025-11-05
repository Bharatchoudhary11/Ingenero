import React from "react";

type UserInfo = {
  name: string;
  title: string;
  location: string;
  message: string;
};

type HeaderProps = {
  user: UserInfo;
  statusOptions: string[];
  timeRanges: string[];
  selectedStatus: string;
  selectedTimeRange: string;
  onStatusChange: (value: string) => void;
  onTimeRangeChange: (value: string) => void;
  onOpenModal: () => void;
};

export function Header({
  user,
  statusOptions,
  timeRanges,
  selectedStatus,
  selectedTimeRange,
  onStatusChange,
  onTimeRangeChange,
  onOpenModal
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-8 rounded-3xl bg-white p-8 shadow-card lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-widest text-gray-400">
          Operational command center
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">
          Good morning, {user.name}
        </h1>
        <p className="text-sm text-gray-500">
          {user.title} • {user.location}
        </p>
        <p className="mt-3 max-w-xl rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          {user.message}
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 lg:max-w-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Status filter
            <select
              value={selectedStatus}
              onChange={(event) => onStatusChange(event.target.value)}
              className="rounded-xl border-gray-200 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {statusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Time range
            <select
              value={selectedTimeRange}
              onChange={(event) => onTimeRangeChange(event.target.value)}
              className="rounded-xl border-gray-200 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {timeRanges.map((range) => (
                <option key={range}>{range}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          onClick={onOpenModal}
          className="inline-flex items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          <span className="px-4 py-3">Open readiness drilldown</span>
        </button>
      </div>
    </header>
  );
}
