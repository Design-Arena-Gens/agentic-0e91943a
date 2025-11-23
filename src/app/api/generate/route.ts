import { NextResponse } from "next/server";
import { collectSignals, composeArtifacts, type AgentRequest } from "@/lib/agent";
import type { AgentStep } from "@/lib/types";

export const runtime = "nodejs";

function normalizePayload(body: Partial<AgentRequest>): AgentRequest {
  return {
    topic: body.topic?.trim() || "emerging technology",
    tone: body.tone || "Analytical",
    audience: body.audience?.trim() || "General readership",
    cadence: body.cadence || "Weekly Pulse",
    writingStyle: body.writingStyle || "Editorial",
    includeNewsletter: body.includeNewsletter ?? true,
    includeBlog: body.includeBlog ?? true,
    extraNotes: body.extraNotes?.trim() || "",
    focusRegion: body.focusRegion || "Global"
  };
}

const baseSteps: AgentStep[] = [
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

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as Partial<AgentRequest>;
    const agentPayload = normalizePayload(rawPayload);

    const steps = baseSteps.map((step) => ({ ...step }));

    steps[0].status = "active";
    const signals = await collectSignals(agentPayload);
    steps[0].status = "complete";
    steps[1].status = "active";

    const artifacts = composeArtifacts(agentPayload, signals);

    steps[1].status = "complete";
    steps[2].status = "complete";

    return NextResponse.json({ result: artifacts, steps });
  } catch (error) {
    console.error("Agent failure", error);
    return NextResponse.json(
      { error: "Agent failed to generate outputs. Please refine the brief and retry." },
      { status: 500 }
    );
  }
}
