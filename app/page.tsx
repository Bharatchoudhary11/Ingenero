"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
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
  initials: "JD",
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

  return electrolyzers.reduce<FleetState>((acc, electro) => {
    acc[electro.id] = base.map((item) => ({ ...item }));
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

  const idsLabel =
    elementIds.length > 0 ? elementIds.join(", ") : "selected element part IDs";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Confirm Status</h2>
          <button
            aria-label="Close"
            onClick={onCancel}
            className="text-xl text-gray-400 transition hover:text-gray-600"
          >
            ×
          </button>
        </header>

        <div className="space-y-6 px-6 py-6 text-sm text-gray-700">
          <p>
            Update status of Element Part ID{" "}
            <span className="font-semibold text-gray-900">{idsLabel}</span> to{" "}
            <span className="font-semibold text-gray-900">
              &ldquo;
              {action === "repair"
                ? STATUS_COPY.repair
                : STATUS_COPY.assemble}
              &rdquo;
            </span>
            {action === "repair" && (
              <>
                {" "}
                with {checklistCount} checklist item
                {checklistCount === 1 ? "" : "s"}.
              </>
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

function Page() {
  const [fleet, setFleet] = useState<FleetState>(() => createInitialFleet());
  const [search, setSearch] = useState("");
  const [selectedElectrolyzer, setSelectedElectrolyzer] = useState<
    number | undefined
  >(electrolyzers[0]?.id);
  const [selectedElementsByElectrolyzer, setSelectedElementsByElectrolyzer] =
    useState<Record<number, string[]>>({});
  const [commentsByElectrolyzer, setCommentsByElectrolyzer] = useState<
    Record<number, Record<string, string>>
  >({});
  const selectedElements =
    (selectedElectrolyzer &&
      selectedElementsByElectrolyzer[selectedElectrolyzer]) ||
    [];
  const currentComments =
    (selectedElectrolyzer && commentsByElectrolyzer[selectedElectrolyzer]) ||
    {};
  const allSelectedEntries = useMemo(
    () =>
      Object.entries(selectedElementsByElectrolyzer).flatMap(
        ([electroId, items]) =>
          items.map((elementId) => ({
            electrolyzerId: Number(electroId),
            elementId
          }))
      ),
    [selectedElementsByElectrolyzer]
  );
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>([]);
  const [cutOutComment, setCutOutComment] = useState("");
  const [feedback, setFeedback] = useState<string>();
  const [pendingAction, setPendingAction] = useState<ElementAction>();
  const listRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

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
    if (
      !selectedElectrolyzer ||
      (selectedElementsByElectrolyzer[selectedElectrolyzer] ?? []).length > 0
    ) {
      return;
    }
    setSelectedChecklist([]);
    setCutOutComment("");
    setFeedback(undefined);
    setPendingAction(undefined);
  }, [selectedElectrolyzer, selectedElementsByElectrolyzer]);

  useEffect(() => {
    if (filteredElectrolyzers.length === 0) {
      setSelectedElectrolyzer(undefined);
      return;
    }
    if (
      selectedElectrolyzer &&
      filteredElectrolyzers.some((item) => item.id === selectedElectrolyzer)
    ) {
      return;
    }
    setSelectedElectrolyzer(filteredElectrolyzers[0].id);
  }, [filteredElectrolyzers, selectedElectrolyzer]);

  useEffect(() => {
    if (!filteredElectrolyzers.length) {
      return;
    }
    const trimmed = search.trim();
    const exactMatch = filteredElectrolyzers.find(
      (item) => item.id.toString() === trimmed
    );
    if (selectedElectrolyzer && trimmed.length === 0) {
      return;
    }
    if (exactMatch) {
      setSelectedElectrolyzer(exactMatch.id);
    } else if (
      selectedElectrolyzer &&
      filteredElectrolyzers.some((item) => item.id === selectedElectrolyzer)
    ) {
      return;
    } else {
      setSelectedElectrolyzer(filteredElectrolyzers[0].id);
    }
  }, [search, filteredElectrolyzers, selectedElectrolyzer]);

  function handleElectrolyzerChange(id: number) {
    if (id === selectedElectrolyzer) {
      return;
    }
    setSelectedElectrolyzer(id);
  }

  function toggleElement(element: ElementState) {
    if (element.disabled) return;
    setSelectedElementsByElectrolyzer((prev) => {
      if (!selectedElectrolyzer) return prev;
      const current = prev[selectedElectrolyzer] ?? [];
      let nextSelection: string[];
      if (current.includes(element.id)) {
        nextSelection = current.filter((id) => id !== element.id);
        setCommentsByElectrolyzer((prevComments) => {
          if (!selectedElectrolyzer) return prevComments;
          const currentComments = prevComments[selectedElectrolyzer] ?? {};
          if (!currentComments[element.id]) return prevComments;
          const { [element.id]: _, ...rest } = currentComments;
          return { ...prevComments, [selectedElectrolyzer]: rest };
        });
      } else {
        nextSelection = [...current, element.id];
      }
      return { ...prev, [selectedElectrolyzer]: nextSelection };
    });
    setFeedback(undefined);
  }

  function toggleSelectAll() {
    if (selectableElements.length === 0) return;
    if (allSelected) {
      setSelectedElementsByElectrolyzer((prev) => {
        if (!selectedElectrolyzer) return prev;
        return { ...prev, [selectedElectrolyzer]: [] };
      });
      return;
    }
    setSelectedElementsByElectrolyzer((prev) => {
      if (!selectedElectrolyzer) return prev;
      return {
        ...prev,
        [selectedElectrolyzer]: selectableElements.map((item) => item.id)
      };
    });
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

  function handleCommentChange(
    electrolyzerId: number,
    elementId: string,
    value: string
  ) {
    setCommentsByElectrolyzer((prev) => {
      const current = prev[electrolyzerId] ?? {};
      const next =
        value.length > 0
          ? { ...current, [elementId]: value }
          : (() => {
              const { [elementId]: _, ...rest } = current;
              return rest;
            })();
      return { ...prev, [electrolyzerId]: next };
    });
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
      next[selectedElectrolyzer] = next[selectedElectrolyzer].map((element) => {
        if (!selectedElements.includes(element.id)) {
          return element;
        }
        if (pendingAction === "repair") {
          return {
            ...element,
            status: "repair",
            disabled: true,
            checklistCount: selectedChecklist.length,
            comment: currentComments[element.id]
          };
        }
        return {
          ...element,
          status: "ready",
          disabled: true,
          checklistCount: 0,
          comment: currentComments[element.id]
        };
      });
      return next;
    });

    setSelectedElementsByElectrolyzer((prev) => {
      if (!selectedElectrolyzer) return prev;
      return { ...prev, [selectedElectrolyzer]: [] };
    });
    setCommentsByElectrolyzer((prev) => {
      if (!selectedElectrolyzer) return prev;
      const current = prev[selectedElectrolyzer] ?? {};
      const next = { ...current };
      selectedElements.forEach((id) => {
        delete next[id];
      });
      return { ...prev, [selectedElectrolyzer]: next };
    });
    setSelectedChecklist([]);
    setCutOutComment("");
    setFeedback(undefined);
    setPendingAction(undefined);
  }

  const checklistDisabled = selectedElements.length === 0;

  return (
    <main className="min-h-screen bg-[#f1f1f3] text-gray-700">
      <header className="border-b border-gray-300 bg-white">
        <div className="flex w-full items-center justify-between px-10 py-5">
          <h1 className="text-xl font-semibold text-gray-900">{HEADER_TITLE}</h1>
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
              {USER.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{USER.name}</p>
              <p className="text-xs text-gray-500">{USER.role}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-gray-300 bg-[#ececee]">
        <div className="px-10 py-3">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-600">
            {SUB_HEADER}
          </p>
        </div>
      </section>

      <section className="px-10 py-8">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
          <header className="grid grid-cols-[240px_minmax(0,1.2fr)_minmax(0,0.9fr)] items-center gap-6 bg-[#efefef] px-8 py-5">
            <button
              type="button"
              onClick={() => {
                if (!selectedElectrolyzer && filteredElectrolyzers.length > 0) {
                  handleElectrolyzerChange(filteredElectrolyzers[0].id);
                }
                listRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
                searchRef.current?.focus();
              }}
              className="text-left text-xs font-medium text-gray-900 underline-offset-2 transition hover:text-[#b65d1f] hover:underline"
            >
              Available Electrolyzers ID
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xs font-medium text-gray-900">
                {selectedElectrolyzer
                  ? `Electrolyzer Id: ${selectedElectrolyzer}`
                  : "Electrolyzer Id"}
              </h2>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                <input
                  type="checkbox"
                  disabled={!selectedElectrolyzer || selectableElements.length === 0}
                  checked={selectableElements.length > 0 && allSelected}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-gray-400 text-[#e16f33] focus:ring-[#e16f33]"
                />
                Select all
              </label>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
                Cut out & Actions
              </p>
              <p className="text-xs text-gray-500">Comments & readiness panel</p>
            </div>
          </header>

          <div className="grid grid-cols-[240px_minmax(0,1.2fr)_minmax(0,0.9fr)] gap-6 px-6 py-6">
            <aside
              ref={listRef}
              className="border-r border-gray-200 bg-[#f7f7f7] px-6 py-6"
            >
              <div className="space-y-4">
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search Electrolyzer ID"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition hover:border-gray-400 focus:border-gray-500"
                />
                <nav className="flex flex-col gap-3">
                  {filteredElectrolyzers.map((item) => {
                    const isActive = selectedElectrolyzer === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleElectrolyzerChange(item.id)}
                        className={clsx(
                          "w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm font-semibold transition",
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
              </div>
            </aside>

            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-[#efefef] text-xs uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Position</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Element Part ID
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {selectedElectrolyzer ? (
                      elementsForSelected.map((element) => {
                        const checked = selectedElements.includes(element.id);
                        const rowClasses = clsx(
                          "transition",
                          element.disabled
                            ? "bg-[#e0e0e0] text-gray-500"
                            : checked
                              ? "bg-[#e5a07d] text-gray-900"
                              : "bg-[#f3f3f3] text-gray-800 hover:bg-[#e7e7e7]"
                        );
                        return (
                          <tr key={element.id} className={rowClasses}>
                            <td className="px-4 py-3 font-semibold">
                              {element.position}
                            </td>
                            <td className="px-4 py-3">
                              <label className="flex items-center gap-3 font-semibold text-gray-800">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={element.disabled}
                                  onChange={() => toggleElement(element)}
                                  className={clsx(
                                    "size-4 rounded border-gray-400 text-[#d76235]",
                                    element.disabled
                                      ? "cursor-not-allowed opacity-50"
                                      : "cursor-pointer"
                                  )}
                                />
                                <span
                                  className={clsx(
                                    "inline-flex rounded px-3 py-1",
                                    checked
                                      ? "bg-white/80 text-gray-900"
                                      : "bg-[#c6c6c6] text-gray-800"
                                  )}
                                >
                                  {element.id}
                                </span>
                              </label>
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
                          colSpan={3}
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

            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6">
              {!selectedElectrolyzer ? (
                <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#b0b6d9] bg-[#d6daf2] px-6 text-center text-sm font-medium text-[#3e4a7a]">
                  Select an Electrolyzer ID and then select one or more element part
                  IDs to start disassembly.
                </div>
              ) : allSelectedEntries.length === 0 ? (
                <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#b0b6d9] bg-[#d6daf2] px-6 text-center text-sm font-medium text-[#3e4a7a]">
                  Choose element part IDs from the list to enable the checklist and
                  comments.
                </div>
              ) : (
                <div className="flex h-full flex-col gap-6">
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                        Cut out Comments
                      </h3>
                      <span className="text-xs text-gray-500">
                        {allSelectedEntries.length} element
                        {allSelectedEntries.length === 1 ? "" : "s"} selected
                        across units
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                        Disassembly Checklist
                      </h3>
                      <button
                        onClick={() => setSelectedChecklist([])}
                        disabled={
                          checklistDisabled || selectedChecklist.length === 0
                        }
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

                  <section className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                      Element Comments
                    </h3>
                    <div className="overflow-hidden rounded-2xl border border-gray-200">
                      <div className="grid grid-cols-[200px_1fr] bg-[#efefef] text-xs font-semibold uppercase tracking-widest text-gray-500">
                        <div className="px-4 py-3">Electrolyzer • Element</div>
                        <div className="px-4 py-3">Comments</div>
                      </div>
                      <div className="divide-y divide-gray-200 bg-white">
                        {allSelectedEntries.map(({ electrolyzerId, elementId }) => (
                          <div
                            key={`${electrolyzerId}-${elementId}`}
                            className="grid grid-cols-[200px_1fr] items-center gap-4 px-4 py-3 text-sm"
                          >
                            <span className="font-semibold text-gray-800">
                              {electrolyzerId} • {elementId}
                            </span>
                            <input
                              type="text"
                              value={
                                commentsByElectrolyzer[electrolyzerId]?.[
                                  elementId
                                ] ?? ""
                              }
                              onChange={(event) =>
                                handleCommentChange(
                                  electrolyzerId,
                                  elementId,
                                  event.target.value
                                )
                              }
                              placeholder="Write your comment"
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
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
                          selectedElements.length === 0 ||
                            selectedChecklist.length === 0
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
          </div>
        </div>
      </section>

      <ConfirmActionModal
        open={Boolean(pendingAction)}
        action={pendingAction}
        elementIds={selectedElements}
        checklistCount={selectedChecklist.length}
        onCancel={() => setPendingAction(undefined)}
        onConfirm={completeAction}
      />
    </main>
  );
}

export default Page;
