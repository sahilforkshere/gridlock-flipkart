"use client"
import { useEffect, useState } from "react"
import { PredictResponse } from "@/types"
import { SEVERITY_COLORS } from "@/lib/severity"

export default function SeverityCard({ result }: { result: PredictResponse }) {
  const { severity_label, severity_level, confidence, recommendations } = result
  const [bar, setBar] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setBar(confidence * 100), 80)
    return () => clearTimeout(t)
  }, [confidence])

  const color = SEVERITY_COLORS[severity_label] || "var(--border-strong)"

  return (
    <div className={`surface rounded-lg border-l-[3px] anim-in overflow-hidden border-r border-t border-b border-r-[var(--border-subtle)] border-t-[var(--border-subtle)] border-b-[var(--border-subtle)]`}
         style={{ borderLeftColor: color }}>
      {/* Header row */}
      <div className="px-5 py-5 flex items-start justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-elevated-1)]">
        <div>
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.1em] mb-2 font-medium">Congestion Severity</p>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-4xl font-bold tracking-tight" style={{ color }}>
              {severity_label.toUpperCase()}
            </span>
            <span className="font-data text-xs text-[var(--text-secondary)]">Level {severity_level} / 3</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.1em] mb-2 font-medium">Confidence</p>
          <span className="font-data text-3xl font-bold tabular-nums" style={{ color }}>
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="px-5 pt-4 pb-2 bg-[var(--bg-base)]">
        <div className="w-full bg-[var(--bg-elevated-2)] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full anim-bar"
            style={{ width: `${bar}%`, background: color, transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </div>
      </div>

      {/* Key metrics */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3 bg-[var(--bg-base)]">
        <div className="bg-[var(--bg-elevated-1)] rounded px-4 py-3 border border-[var(--border-subtle)]">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.1em] mb-1 font-medium">Officers</p>
          <p className="text-[var(--text-primary)] font-data text-xl tabular-nums">
            {recommendations.manpower_min}–{recommendations.manpower_max}
          </p>
        </div>
        <div className="bg-[var(--bg-elevated-1)] rounded px-4 py-3 border border-[var(--border-subtle)]">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.1em] mb-1 font-medium">Est. Delay</p>
          <p className="text-[var(--text-primary)] font-data text-xl tabular-nums">
            ~{recommendations.impact_minutes} min
          </p>
        </div>
      </div>
    </div>
  )
}
