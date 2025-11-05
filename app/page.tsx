"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import {
  ElementPart,
  electrolyzers,
  elementParts,
  repairChecklistItems
} from "@/data/data";

type ElementStatus = "available" | "repair" | "ready";
type ElementAction = "repair" | "assemble";

type ElementState = ElementPart & {
  status: ElementStatus;
  disabled: boolean;
  checklistCount: number;
  comment?: string;
};

type FleetState = Record<number, ElementState[]>;

const HEADER_TITLE = "Tephram Assent Management Solution";
const SUB_HEADER = "Disassembly Electrolyzer";
const USER = {
  name: "Diso",
  role: "Cell Renewal Group"
};

const ACTION_LABEL: Record<ElementAction, string> = {
  repair: "Send to Repair",
  assemble: "Ready to Assemble"
};

const STATUS_COPY: Record<ElementAction, string> = {
  repair: "Ready for Repair",
  assemble: "Ready for Assemble"
};

function createInitialFleet(): FleetState {
  const base = elementParts.map<ElementState>((part) => ({
    ...part,
    status: "available",
    disabled: false,
    checklistCount: 0
  }));

  return electrolyzers.reduce<FleetState>((acc, item) => {
    acc[item.id] = base.map((element) => ({ ...element }));
    return acc;
  }, {});
}

type ConfirmActionModalProps = {
  open: boolean;
  action?: ElementAction;
  elementIds: string[];
  checklistCount: number;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmActionModal({
  open,
  action,
  elementIds,
  checklistCount,
  onCancel,
  onConfirm
}: ConfirmActionModalProps) {
  if (!open || !action) {
    return null;
  }

  const label = STATUS_COPY[action];
  const idsLabel =
    elementIds.length > 0
      ? elementIds.join(", ")
      : "the selected element part IDs";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Confirm Status</h2>
          <button
            aria-label="Close"
            onClick={onCancel}
            className="text-xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </header>
        <div className="space-y-6 px-6 py-6 text-sm text-gray-700">
          <p>
            Update status of Element Part ID{" "}
            <span className="font-semibold text-gray-900">{idsLabel}</span> to{" "}
            <span className="font-semibold text-gray-900">"{label}"</span>
            {action === "repair" && checklistCount > 0 ? (
              <>
                {" "}
                with {checklistCount} checklist
                {checklistCount > 1 ? " items." : " item."}
              </>
            ) : (
              "."
            )}
          </p>
        </div>
        <footer className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-[#b65d1f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#9f4e12]"
          >
            Confirm
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function ElectrolyzerDisassemblyPage() {
  const [fleet, setFleet] = useState<FleetState>(() => createInitialFleet());
  const [search, setSearch] = useState("");
  const [selectedElectrolyzer, setSelectedElectrolyzer] = useState<number>();
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [cutOutComment, setCutOutComment] = useState("");
  const [feedback, setFeedback] = useState<string>();
  const [pendingAction, setPendingAction] = useState<ElementAction>();

  const filteredElectrolyzers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return electrolyzers;
    return electrolyzers.filter(
      (item) =>
        item.id.toString().includes(term) ||
        item.tag.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
    );
  }, [search]);

  const elementsForSelected = useMemo(() => {
    if (!selectedElectrolyzer) return [];
    return fleet[selectedElectrolyzer] ?? [];
  }, [fleet, selectedElectrolyzer]);

  const selectableElements = elementsForSelected.filter(
    (item) => !item.disabled
  );
  const allSelected =
    selectableElements.length > 0 &&
    selectableElements.every((item) => selectedElements.includes(item.id));

  useEffect(() => {
    setSelectedElements([]);
    setSelectedChecklist([]);
    setComments({});
    setFeedback(undefined);
    setPendingAction(undefined);
    setCutOutComment("");
  }, [selectedElectrolyzer]);

  useEffect(() => {
    if (selectedElements.length === 0) {
      setSelectedChecklist([]);
      setComments({});
      setCutOutComment("");
    }
  }, [selectedElements]);

  function toggleElement(element: ElementState) {
    if (element.disabled) {
      return;
    }
    setSelectedElements((prev) => {
      if (prev.includes(element.id)) {
        const next = prev.filter((id) => id !== element.id);
        setComments((current) => {
          if (!current[element.id]) return current;
          const { [element.id]: _, ...rest } = current;
          return rest;
        });
        return next;
      }
      return [...prev, element.id];
    });
    setFeedback(undefined);
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedElements([]);
      setComments({});
      return;
    }
    const ids = selectableElements.map((item) => item.id);
    setSelectedElements(ids);
  }

  function toggleChecklistItem(item: string) {
    setSelectedChecklist((prev) => {
      if (prev.includes(item)) {
        return prev.filter((entry) => entry !== item);
      }
      return [...prev, item];
    });
    setFeedback(undefined);
  }

  function clearChecklist() {
    setSelectedChecklist([]);
  }

  function handleCommentChange(id: string, value: string) {
    setComments((prev) => ({
      ...prev,
      [id]: value
    }));
  }

  function requestAction(action: ElementAction) {
    if (selectedElements.length === 0) {
      setFeedback("Select one or more element part IDs to continue.");
      return;
    }
    if (action === "repair" && selectedChecklist.length === 0) {
      setFeedback(
        "Select at least one disassembly checklist item for repair routing."
      );
      return;
    }
    setFeedback(undefined);
    setPendingAction(action);
  }

  function completeAction() {
    if (!selectedElectrolyzer || !pendingAction) return;

    setFleet((prev) => {
      const next = { ...prev };
      const updated = next[selectedElectrolyzer].map((element) => {
        if (!selectedElements.includes(element.id)) {
          return element;
        }
        if (pendingAction === "repair") {
          return {
            ...element,
            status: "repair",
            disabled: true,
            checklistCount: selectedChecklist.length,
            comment: comments[element.id]
          };
        }
        return {
          ...element,
          status: "ready",
          disabled: true,
          checklistCount: 0,
          comment: comments[element.id]
        };
      });
      next[selectedElectrolyzer] = updated;
      return next;
    });

    setSelectedElements([]);
    setSelectedChecklist([]);
    setComments({});
    setPendingAction(undefined);
  }

  const checklistDisabled = selectedElements.length === 0;

  return (
    <div className="min-h-screen bg-[#f1f1f3] text-gray-700">
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-xl font-semibold text-gray-900">{HEADER_TITLE}</h1>
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{USER.name}</p>
              <p className="text-xs text-gray-500">{USER.role}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-gray-300 bg-[#ececee]">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-600">
            {SUB_HEADER}
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <aside className="w-60 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">
            Available Electrolyzers ID
          </h2>
          <div className="mt-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Electrolyzer ID"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition hover:border-gray-400 focus:border-gray-500"
            />
          </div>
          <nav className="mt-4 flex flex-col gap-3">
            {filteredElectrolyzers.map((item) => {
              const isActive = selectedElectrolyzer === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedElectrolyzer(item.id)}
                  className={clsx(
                    "rounded-lg border border-transparent px-3 py-2 text-left text-sm font-semibold transition",
                    isActive
                      ? "border-dashed border-[#d76235] bg-[#f5d4c7] text-[#7d3416]"
                      : "bg-[#d9d9d9] text-gray-700 hover:bg-[#ccc]"
                  )}
                >
                  {item.id}
                </button>
              );
            })}
            {filteredElectrolyzers.length === 0 && (
              <span className="rounded-lg border border-dashed border-gray-300 px-3 py-10 text-center text-xs text-gray-500">
                No IDs match the search.
              </span>
            )}
          </nav>
        </aside>

        <section className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm">
            <header className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedElectrolyzer
                    ? `Electrolyzer Id: ${selectedElectrolyzer}`
                    : "Electrolyzer Id"}
                </h2>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-500">
                <input
                  type="checkbox"
                  disabled={!selectedElectrolyzer || selectableElements.length === 0}
                  checked={selectableElements.length > 0 && allSelected}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-gray-400 text-[#e16f33] focus:ring-[#e16f33]"
                />
                Select all
              </label>
            </header>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-[#efefef] text-xs uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Position</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Element Part ID
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">Select</th>
                    <th className="px-4 py-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {selectedElectrolyzer ? (
                    elementsForSelected.map((element) => {
                      const checked = selectedElements.includes(element.id);
                      const disabled = element.disabled;
                      const baseClasses = clsx(
                        "transition",
                        disabled
                          ? "bg-[#e0e0e0] text-gray-500"
                          : checked
                            ? "bg-[#e5a07d] text-gray-900"
                            : "bg-[#f3f3f3] text-gray-800 hover:bg-[#e7e7e7]"
                      );
                      return (
                        <tr key={element.id} className={baseClasses}>
                          <td className="px-4 py-3 font-semibold">
                            {element.position}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={clsx(
                                "inline-flex rounded px-3 py-1 font-semibold",
                                checked
                                  ? "bg-white/80 text-gray-900"
                                  : "bg-[#c6c6c6] text-gray-800"
                              )}
                            >
                              {element.id}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => toggleElement(element)}
                              className={clsx(
                                "size-4 rounded border-gray-400 text-[#d76235]",
                                disabled
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer"
                              )}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {element.status === "repair" && (
                                <>
                                  <span className="rounded-full bg-[#b93e27] px-3 py-1 text-xs font-semibold text-white">
                                    {STATUS_COPY.repair}
                                  </span>
                                  {element.checklistCount > 0 && (
                                    <span className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                                      {element.checklistCount}
                                    </span>
                                  )}
                                </>
                              )}
                              {element.status === "ready" && (
                                <span className="rounded-full bg-[#348f63] px-3 py-1 text-xs font-semibold text-white">
                                  {STATUS_COPY.assemble}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-16 text-center text-sm text-gray-500"
                      >
                        Select an Electrolyzer ID from the left panel to view element
                        part IDs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {!selectedElectrolyzer ? (
              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-[#b0b6d9] bg-[#d6daf2] px-6 text-center text-sm font-medium text-[#3e4a7a]">
                Select an Electrolyzer ID and then select one or more element part
                IDs to start disassembly.
              </div>
            ) : selectedElements.length === 0 ? (
              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-[#b0b6d9] bg-[#d6daf2] px-6 text-center text-sm font-medium text-[#3e4a7a]">
                Choose element part IDs from the list to enable the checklist and
                comments.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                      Cut out Comments
                    </h3>
                    <span className="text-xs text-gray-500">
                      {selectedElements.length} element
                      {selectedElements.length > 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <textarea
                    value={cutOutComment}
                    onChange={(event) => setCutOutComment(event.target.value)}
                    rows={4}
                    placeholder="Cut out comments here"
                    className="w-full rounded-2xl border border-gray-200 bg-[#f5f5f7] px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-400"
                  />
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                    Element Comments
                  </h3>
                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-[160px_1fr] bg-[#efefef] text-xs font-semibold uppercase tracking-widest text-gray-500">
                      <div className="px-4 py-3">Element Part ID</div>
                      <div className="px-4 py-3">Comments</div>
                    </div>
                    <div className="divide-y divide-gray-200 bg-white">
                      {selectedElements.map((id) => (
                        <div
                          key={id}
                          className="grid grid-cols-[160px_1fr] items-center gap-4 px-4 py-3 text-sm"
                        >
                          <span className="font-semibold text-gray-800">{id}</span>
                          <input
                            type="text"
                            value={comments[id] ?? ""}
                            onChange={(event) =>
                              handleCommentChange(id, event.target.value)
                            }
                            placeholder="Write your comment"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                      Disassembly Checklist
                    </h3>
                    <button
                      onClick={clearChecklist}
                      disabled={checklistDisabled || selectedChecklist.length === 0}
                      className="text-xs font-semibold uppercase tracking-widest text-[#b65d1f] disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      Clear Selection
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {repairChecklistItems.map((item) => {
                      const active = selectedChecklist.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleChecklistItem(item)}
                          disabled={checklistDisabled}
                          className={clsx(
                            "rounded-full border px-4 py-2 text-xs font-semibold transition",
                            checklistDisabled
                              ? "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400"
                              : active
                                ? "border-[#d76235] bg-[#f5d4c7] text-[#7d3416]"
                                : "border-gray-300 bg-white text-gray-600 hover:border-[#d76235] hover:bg-[#f5e5df]"
                          )}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                  <span className="self-end text-xs text-gray-500">
                    {selectedChecklist.length} checklist item
                    {selectedChecklist.length === 1 ? "" : "s"} selected
                  </span>
                </section>

                <section className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                  {feedback && (
                    <p className="text-xs font-semibold text-[#b93e27]">
                      {feedback}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => requestAction("repair")}
                      className={clsx(
                        "min-w-[160px] rounded-full px-5 py-2 text-sm font-semibold transition",
                        selectedElements.length === 0 || selectedChecklist.length === 0
                          ? "cursor-not-allowed bg-gray-300 text-gray-500"
                          : "bg-black text-white hover:bg-gray-900"
                      )}
                      disabled={
                        selectedElements.length === 0 ||
                        selectedChecklist.length === 0
                      }
                    >
                      {ACTION_LABEL.repair}
                    </button>
                    <button
                      onClick={() => requestAction("assemble")}
                      className={clsx(
                        "min-w-[180px] rounded-full px-5 py-2 text-sm font-semibold transition",
                        selectedElements.length === 0
                          ? "cursor-not-allowed bg-gray-300 text-gray-500"
                          : "bg-[#1f1f1f] text-white hover:bg-black"
                      )}
                      disabled={selectedElements.length === 0}
                    >
                      {ACTION_LABEL.assemble}
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfirmActionModal
        open={Boolean(pendingAction)}
        action={pendingAction}
        elementIds={selectedElements}
        checklistCount={selectedChecklist.length}
        onCancel={() => setPendingAction(undefined)}
        onConfirm={completeAction}
      />
    </div>
  );
}
