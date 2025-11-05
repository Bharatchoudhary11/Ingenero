"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { SummaryCard } from "@/components/SummaryCard";
import { ReadinessList } from "@/components/ReadinessList";
import { MaintenanceTable } from "@/components/MaintenanceTable";
import { AlertCard } from "@/components/AlertCard";
import { EfficiencyCard } from "@/components/EfficiencyCard";
import { QuickActionCard } from "@/components/QuickActionCard";
import { Modal } from "@/components/Modal";
import { dashboardData, filters } from "@/data/data";

const {
  user,
  summaryCards,
  readinessBreakdown,
  maintenanceSchedule,
  alerts,
  efficiencyHighlights,
  quickActions,
  modal
} = dashboardData;

export default function HomePage() {
  const [selectedStatus, setSelectedStatus] = useState(filters.status[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(
    filters.timeRange[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 bg-slate-25 p-6 pb-16 sm:p-10">
      <Header
        user={user}
        statusOptions={filters.status}
        timeRanges={filters.timeRange}
        selectedStatus={selectedStatus}
        selectedTimeRange={selectedTimeRange}
        onStatusChange={setSelectedStatus}
        onTimeRangeChange={setSelectedTimeRange}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.id} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-6">
          <ReadinessList
            items={readinessBreakdown}
            selectedStatus={selectedStatus}
          />

          <section className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">
                Quick actions
              </h2>
              <p className="text-sm text-gray-500">
                Based on {selectedTimeRange.toLowerCase()} activity
              </p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <QuickActionCard key={action.id} action={action} />
              ))}
            </div>
          </section>
        </div>

        <MaintenanceTable items={maintenanceSchedule} />

        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Alerts stream
                </h2>
                <p className="text-sm text-gray-500">
                  Synced with control room feed
                </p>
              </div>
              <button className="text-sm font-semibold text-primary hover:underline">
                See all
              </button>
            </header>
            <div className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <header>
              <h2 className="text-lg font-semibold text-gray-900">
                Efficiency highlights
              </h2>
              <p className="text-sm text-gray-500">
                Benchmarked against peer facilities
              </p>
            </header>
            <div className="grid gap-4">
              {efficiencyHighlights.map((metric) => (
                <EfficiencyCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modal}
      />
    </main>
  );
}
