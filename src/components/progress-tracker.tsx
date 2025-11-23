"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import type { AgentStep } from "@/lib/types";

interface ProgressTrackerProps {
  steps: AgentStep[];
}

export function ProgressTracker({ steps }: ProgressTrackerProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3" aria-label="Agent workflow progress">
      {steps.map((step) => (
        <li
          key={step.id}
          className={cn(
            "rounded-xl border p-4 transition",
            step.status === "complete"
              ? "border-sky-400 bg-sky-50/70"
              : step.status === "active"
                ? "border-slate-300 bg-white shadow"
                : "border-slate-200 bg-white/80"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Step
            </span>
            {step.status === "complete" ? (
              <CheckCircleIcon className="h-5 w-5 text-sky-500" aria-hidden="true" />
            ) : null}
          </div>
          <p className="mt-1 text-lg font-semibold text-slate-800">{step.label}</p>
          <p className="mt-1 text-sm text-slate-600">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
