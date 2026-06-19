"use client"
import { useEffect, useState } from "react"
import { PredictResponse } from "@/types"
import { SEVERITY_BORDER, SEVERITY_EMOJI } from "@/lib/severity"

const SEVERITY_GRADIENT: Record<string, string> = {
  Low:      "from-green-500/20 to-transparent",
  Medium:   "from-yellow-500/20 to-transparent",
  High:     "from-orange-500/20 to-transparent",
  Critical: "from-red-500/20 to-transparent",
}

const SEVERITY_BAR_COLOR: Record<string, string> = {
  Low:      "#22c55e",
  Medium:   "#eab308",
  High:     "#f97316",
  Critical: "#ef4444",
}

const SEVERITY_TEXT_COLOR: Record<string, string> = {
  Low:      "text-green-400",
  Medium:   "text-yellow-400",
  High:     "text-orange-400",
  Critical: "text-red-400",
}

const SEVERITY_GLOW: Record<string, string> = {
  Low:      "glow-green",
  Medium:   "glow-yellow",
  High:     "glow-orange",
  Critical: "glow-red",
}

export default function SeverityCard({ result }: { result: PredictResponse }) {
  const { severity_label, severity_level, confidence, recommendations } = result
  const [barWidth, setBarWidth] = useState(0)
  const textClass = SEVERITY_TEXT_COLOR[severity_label] ?? "text-gray-400"
  const glowClass = SEVERITY_GLOW[severity_label] ?? ""

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(confidence * 100), 100)
    return () => clearTimeout(t)
  }, [confidence])

  return (
    <div className={`relative overflow-hidden glass rounded-2xl border-2 ${SEVERITY_BORDER[severity_label] ?? "border-gray-700"} ${glowClass} animate-scale-in`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${SEVERITY_GRADIENT[severity_label] ?? ""} pointer-events-none`} />

      <div className="relative p-6">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Congestion Severity</p>
            <div className={`flex items-center gap-3 ${textClass}`}>
              <span className="text-5xl">{SEVERITY_EMOJI[severity_label]}</span>
              <div>
                <span className="text-4xl font-black tracking-tight">{severity_label.toUpperCase()}</span>
                <p className="text-gray-500 text-xs mt-0.5">Level {severity_level} of 3</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-1">Model Confidence</p>
            <p className={`text-4xl font-black ${textClass}`}>{(confidence * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-600 mb-1.5">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${barWidth}%`, background: SEVERITY_BAR_COLOR[severity_label] ?? "#888" }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/8">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Officers Required</p>
            <p className="text-white font-bold text-xl">{recommendations.manpower_min}–{recommendations.manpower_max}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/8">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Est. Delay</p>
            <p className="text-white font-bold text-xl">~{recommendations.impact_minutes} min</p>
          </div>
        </div>
      </div>
    </div>
  )
}
