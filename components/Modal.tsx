import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

type Owner = {
  name: string;
  role: string;
  contact: string;
};

export type ModalContent = {
  title: string;
  subtitle: string;
  description: string;
  checklist: string[];
  owner: Owner;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  content: ModalContent;
};

export function Modal({ open, onClose, content }: ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 px-6 py-8 backdrop-blur-sm sm:items-center sm:px-0">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <header className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Drilldown
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                  {content.title}
                </h3>
                <p className="text-sm font-medium text-primary">
                  {content.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full border border-gray-200 p-2 text-gray-400 transition hover:border-primary hover:text-primary"
              >
                ×
              </button>
            </header>

            <p className="text-sm text-gray-600">{content.description}</p>

            <section className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Immediate checklist
              </p>
              <ul className="mt-3 flex flex-col gap-3">
                {content.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                  >
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <footer className="mt-8 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gradient-to-r from-primary-50 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {content.owner.name}
                </p>
                <p className="text-xs text-gray-500">{content.owner.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${content.owner.contact}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Call {content.owner.contact}
                </a>
                <button className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
                  Assign follow-up
                </button>
              </div>
            </footer>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}
