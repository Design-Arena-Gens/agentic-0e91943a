"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SourceItem {
  title: string;
  url: string | null;
  author: string | null;
  createdAt: string;
  points?: number;
}

export interface GenerationMetadata {
  topic: string;
  tone: string;
  audience: string;
  timeframe: string;
  generatedAt: string;
}

export interface GenerationResult {
  newsletter: string | null;
  blog: string | null;
  ideaPitches: string[];
  sources: SourceItem[];
  metadata: GenerationMetadata;
}

interface AgentOutputProps {
  result: GenerationResult | null;
  loading: boolean;
  error: string | null;
}

export function AgentOutput({ result, loading, error }: AgentOutputProps) {
  const [activeTab, setActiveTab] = useState<"newsletter" | "blog">("newsletter");

  const isReady = Boolean(result);
  const hasNewsletter = Boolean(result?.newsletter);
  const hasBlog = Boolean(result?.blog);

  const copyToClipboard = async (content?: string | null) => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
  };

  const downloadMarkdown = (content?: string | null, filename?: string) => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename ?? "agent-output.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest Pulse Agent</p>
            <h2 className="text-2xl font-semibold text-slate-900">Output Console</h2>
          </div>
          {result ? (
            <div className="text-sm text-slate-600">
              <p>
                Topic focus: <span className="font-semibold text-slate-900">{result.metadata.topic}</span>
              </p>
              <p>
                Generated {format(new Date(result.metadata.generatedAt), "PPpp")}
              </p>
            </div>
          ) : null}
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "newsletter" ? "primary" : "ghost"}
            onClick={() => setActiveTab("newsletter")}
            disabled={!hasNewsletter}
          >
            Newsletter
          </Button>
          <Button
            variant={activeTab === "blog" ? "primary" : "ghost"}
            onClick={() => setActiveTab("blog")}
            disabled={!hasBlog}
          >
            Blog Article
          </Button>
        </div>

        {!isReady && !loading ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-slate-500">
            Generated content will appear here.
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 animate-pulse space-y-4">
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
          </div>
        ) : null}

        {isReady ? (
          <div className="mt-6 space-y-6">
            {activeTab === "newsletter" && hasNewsletter ? (
              <OutputBlock
                heading="Newsletter Edition"
                content={result!.newsletter}
                onCopy={() => copyToClipboard(result!.newsletter)}
                onDownload={() => downloadMarkdown(result!.newsletter, "newsletter.md")}
              />
            ) : null}
            {activeTab === "blog" && hasBlog ? (
              <OutputBlock
                heading="Long-Form Blog"
                content={result!.blog}
                onCopy={() => copyToClipboard(result!.blog)}
                onDownload={() => downloadMarkdown(result!.blog, "blog.md")}
              />
            ) : null}

            {result?.ideaPitches?.length ? (
              <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Idea follow-ups</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {result.ideaPitches.map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {result?.sources?.length ? (
              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-slate-900">Research Sources</h3>
                <ul className="mt-3 space-y-3 text-sm text-slate-600">
                  {result.sources.map((source) => (
                    <li key={source.url ?? source.title}>
                      <a
                        href={source.url ?? "#"}
                        className={cn(
                          "font-medium text-sky-600 hover:text-sky-700 hover:underline",
                          !source.url && "pointer-events-none text-slate-400"
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.title}
                      </a>
                      <div className="text-xs text-slate-500">
                        {source.author ? `by ${source.author}` : "Unknown author"} • {format(new Date(source.createdAt), "PP")}
                        {source.points ? ` • ${source.points} points` : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

interface OutputBlockProps {
  heading: string;
  content: string | null;
  onCopy: () => void;
  onDownload: () => void;
}

function OutputBlock({ heading, content, onCopy, onDownload }: OutputBlockProps) {
  if (!content) return null;

  return (
    <article className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCopy}>
            Copy markdown
          </Button>
          <Button variant="ghost" size="sm" onClick={onDownload}>
            Download .md
          </Button>
        </div>
      </div>
      <pre className="max-h-[480px] overflow-auto rounded-xl border border-slate-200 bg-slate-950/95 p-4 font-mono text-sm text-slate-100 shadow-inner">
        {content}
      </pre>
    </article>
  );
}
