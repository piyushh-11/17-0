"use client";

import { useEffect, useRef, useState } from "react";
import type { SeasonResult } from "@/types/season";

type CopyState = "idle" | "copied" | "failed";

type CopyResultButtonProps = {
  seasonResult: SeasonResult;
};

function formatBulletList(items: string[]) {
  if (items.length === 0) {
    return "- None";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function buildShareText(seasonResult: SeasonResult) {
  const identities =
    seasonResult.identities.length > 0
      ? seasonResult.identities.map((identity) => identity.label).join(", ")
      : "No clear identity";
  const topStrengths = seasonResult.strengths.slice(0, 3);
  const weaknesses = seasonResult.weaknesses.map((weakness) => weakness.label);

  return [
    `I drafted a ${seasonResult.record} team in Perfect Season Draft.`,
    "",
    `Identity: ${identities}`,
    "",
    "Strengths:",
    formatBulletList(topStrengths),
    "",
    "Weaknesses:",
    formatBulletList(weaknesses),
    "",
    "Can you build a 17-0 team?",
  ].join("\n");
}

export default function CopyResultButton({
  seasonResult,
}: CopyResultButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function showTemporaryCopyState(nextCopyState: CopyState) {
    setCopyState(nextCopyState);
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopyState("idle");
    }, 2500);
  }

  async function handleCopyResult() {
    if (!navigator.clipboard?.writeText) {
      showTemporaryCopyState("failed");
      return;
    }

    try {
      await navigator.clipboard.writeText(buildShareText(seasonResult));
      showTemporaryCopyState("copied");
    } catch {
      showTemporaryCopyState("failed");
    }
  }

  const buttonText =
    copyState === "copied"
      ? "Copied"
      : copyState === "failed"
        ? "Copy Failed"
        : "Copy Result";
  const statusText =
    copyState === "copied"
      ? "Result copied to clipboard."
      : copyState === "failed"
        ? "Could not copy result. Try again."
        : "";

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleCopyResult}
        data-testid="copy-result"
        className={`rounded-md px-5 py-3 text-sm font-black uppercase tracking-wide transition ${
          copyState === "copied"
            ? "bg-emerald-300 text-slate-950"
            : copyState === "failed"
              ? "bg-red-300 text-slate-950"
              : "bg-white text-slate-950 hover:bg-slate-200"
        }`}
      >
        {buttonText}
      </button>
      <p
        className="min-h-5 text-sm font-semibold text-slate-300"
        aria-live="polite"
      >
        {statusText}
      </p>
    </div>
  );
}
