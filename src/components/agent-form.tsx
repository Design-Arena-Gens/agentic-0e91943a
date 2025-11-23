"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export interface AgentFormState {
  topic: string;
  tone: string;
  audience: string;
  cadence: string;
  writingStyle: string;
  includeNewsletter: boolean;
  includeBlog: boolean;
  extraNotes: string;
  focusRegion: string;
}

interface AgentFormProps {
  state: AgentFormState;
  onStateChange: <K extends keyof AgentFormState>(key: K, value: AgentFormState[K]) => void;
  onSubmit: () => void;
  loading: boolean;
  onPresetSelect: (topic: string, notes: string) => void;
}

const presetTopics: { label: string; topic: string; notes: string }[] = [
  {
    label: "AI Research",
    topic: "frontier AI safety and regulation",
    notes: "Highlight model evaluations, governance moves, and implications for enterprise teams."
  },
  {
    label: "Climate Tech",
    topic: "latest climate tech funding rounds",
    notes: "Spotlight moonshot solutions and chart policy developments across EU & US."
  },
  {
    label: "Consumer Apps",
    topic: "trending consumer social products",
    notes: "Analyze retention hooks and monetization signals for early-stage founders."
  }
];

const tones = ["Analytical", "Optimistic", "Candid", "Urgent", "Story-driven"];
const cadences = ["Weekly Pulse", "Bi-weekly Deep Dive", "Monthly Flagship"];
const styles = ["Concise", "Editorial", "Narrative", "Playful", "Investor Update"];
const regions = ["Global", "United States", "Europe", "Asia-Pacific", "Latin America"];

export function AgentForm({ state, onStateChange, onSubmit, loading, onPresetSelect }: AgentFormProps) {
  const canSubmit = useMemo(() => state.topic.trim().length > 0 && (state.includeNewsletter || state.includeBlog), [state]);

  return (
    <form
      className="space-y-6 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit || loading) return;
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Briefing canvas</p>
          <h2 className="text-2xl font-semibold text-slate-900">Define the brief</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetTopics.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onPresetSelect(preset.topic, preset.notes)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Focus topic*</span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none"
            placeholder="Example: frontier AI model launches"
            value={state.topic}
            onChange={(event) => onStateChange("topic", event.target.value)}
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Audience</span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none"
            placeholder="Example: product leaders in fast-scaling SaaS startups"
            value={state.audience}
            onChange={(event) => onStateChange("audience", event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Tone</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none"
            value={state.tone}
            onChange={(event) => onStateChange("tone", event.target.value)}
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Cadence</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none"
            value={state.cadence}
            onChange={(event) => onStateChange("cadence", event.target.value)}
          >
            {cadences.map((cadence) => (
              <option key={cadence} value={cadence}>
                {cadence}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Region focus</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none"
            value={state.focusRegion}
            onChange={(event) => onStateChange("focusRegion", event.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Writing style</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none"
            value={state.writingStyle}
            onChange={(event) => onStateChange("writingStyle", event.target.value)}
          >
            {styles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-1">
          <legend className="text-sm font-medium text-slate-700">Deliverables</legend>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                checked={state.includeNewsletter}
                onChange={(event) => onStateChange("includeNewsletter", event.target.checked)}
              />
              Newsletter
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                checked={state.includeBlog}
                onChange={(event) => onStateChange("includeBlog", event.target.checked)}
              />
              Blog article
            </label>
          </div>
        </fieldset>
      </div>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Agent notes</span>
        <textarea
          className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none"
          placeholder="Emphasize actionable takeaways, include quote snippets, reference data points, etc."
          value={state.extraNotes}
          onChange={(event) => onStateChange("extraNotes", event.target.value)}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Agent runs live checks against real-time discussions. Outputs include markdown structure and recommended follow-ups.
        </p>
        <Button type="submit" size="lg" disabled={!canSubmit || loading}>
          {loading ? "Running agent…" : "Generate content"}
        </Button>
      </div>
    </form>
  );
}
