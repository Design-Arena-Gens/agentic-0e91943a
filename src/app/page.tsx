"use client";

import { useMemo, useState } from "react";
import { AgentForm, type AgentFormState } from "@/components/agent-form";
import { AgentOutput, type GenerationResult } from "@/components/agent-output";
import { ProgressTracker } from "@/components/progress-tracker";
import type { AgentStep, AgentStepStatus } from "@/lib/types";

const defaultSteps: AgentStep[] = [
  {
    id: "brief",
    label: "Brief understanding",
    description: "Parse intent, persona, and tone guidance",
    status: "pending"
  },
  {
    id: "intel",
    label: "Signal sweep",
    description: "Collect breaking headlines & trending insights",
    status: "pending"
  },
  {
    id: "compose",
    label: "Craft narratives",
    description: "Assemble newsletter and blog deliverables",
    status: "pending"
  }
];

const initialFormState: AgentFormState = {
  topic: "latest AI infrastructure updates",
  tone: "Analytical",
  audience: "Product and platform leads at venture-backed startups",
  cadence: "Weekly Pulse",
  writingStyle: "Editorial",
  includeNewsletter: true,
  includeBlog: true,
  extraNotes: "Highlight real-world adoption stories and include POV on strategic implications.",
  focusRegion: "Global"
};

export default function Page() {
  const [formState, setFormState] = useState<AgentFormState>(initialFormState);
  const [steps, setSteps] = useState<AgentStep[]>(defaultSteps);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStateChange = <K extends keyof AgentFormState>(key: K, value: AgentFormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const queuedSteps: AgentStep[] = defaultSteps.map((step) => ({ ...step }));
    queuedSteps[0].status = "active";
    setSteps(queuedSteps);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState
        })
      });

      if (!response.ok) {
        throw new Error("Agent encountered an error while generating content.");
      }

      const payload = (await response.json()) as { result: GenerationResult; steps: AgentStep[] };
      setResult(payload.result);
      setSteps(payload.steps ?? queuedSteps);
    } catch (err) {
      console.error(err);
      setError("Unable to complete generation. Please retry with a refined brief or check network connectivity.");
      setSteps(defaultSteps.map((step) => ({ ...step })));
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (topic: string, notes: string) => {
    setFormState((prev) => ({
      ...prev,
      topic,
      extraNotes: notes
    }));
  };

  const liveSteps = useMemo(() => {
    if (!loading && !result) return steps;
    if (loading) {
      return steps.map((step, index) => {
        if (index === 0) return { ...step, status: "active" as AgentStepStatus };
        if (index === 1 && steps[0].status === "complete") return { ...step, status: "active" as AgentStepStatus };
        return step;
      });
    }
    return steps;
  }, [loading, result, steps]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-4 pb-20 pt-16">
      <header className="space-y-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          Latest Pulse Agent
        </span>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Automated newsroom for newsletters & blogs</h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
          Feed the agent your focus topic and audience. It scans live discussions, curates signals, and drafts ready-to-send newsletters plus companion blog essays—all in exportable markdown.
        </p>
      </header>

      <ProgressTracker steps={liveSteps} />

      <AgentForm
        state={formState}
        onStateChange={handleStateChange}
        onSubmit={handleSubmit}
        loading={loading}
        onPresetSelect={handlePresetSelect}
      />

      <AgentOutput result={result} loading={loading} error={error} />
    </main>
  );
}
