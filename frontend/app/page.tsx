"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { HistoryEntry } from "@/types"
import { getHistory } from "@/lib/history"
import { SEVERITY_COLORS, SEVERITY_EMOJI } from "@/lib/severity"
import SeverityBadge from "@/components/shared/SeverityBadge"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { ArrowRight, TrendingUp, AlertOctagon, AlertTriangle, Target, Radar } from "lucide-react"

const BengaluruMap = dynamic(() => import("@/components/map/BengaluruMap"), { ssr: false })

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
    setMounted(true)
  }, [])

  const recent = history.slice(0, 5)

  const sevCounts = ["Low", "Medium", "High", "Critical"].map(label => ({
    name: label,
    value: history.filter(h => h.severity_label === label).length,
    fill: SEVERITY_COLORS[label],
  })).filter(d => d.value > 0)

  const avgConf = history.length
    ? (history.reduce((s, h) => s + h.confidence, 0) / history.length * 100).toFixed(1)
    : "—"

  const stats = [
    { label: "Total Predictions", value: history.length.toString(), icon: Target,        color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
    { label: "Critical Events",   value: history.filter(h => h.severity_level === 3).length.toString(), icon: AlertOctagon, color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20" },
    { label: "High Severity",     value: history.filter(h => h.severity_level === 2).length.toString(), icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Avg Confidence",    value: `${avgConf}%`,                                                 icon: TrendingUp,   color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
  ]

  return (
    <div className="bg-grid min-h-full">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-live-pulse" />
            <span className="text-orange-400 text-xs uppercase tracking-widest font-semibold">Live Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Traffic Intelligence Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Bengaluru Event-Driven Congestion Monitor</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`glass rounded-2xl p-4 border ${s.border} card-hover animate-fade-in-up opacity-0`}
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "forwards" }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-gray-500 text-xs uppercase tracking-wide leading-tight">{s.label}</p>
                <div className={`${s.bg} rounded-lg p-1.5`}>
                  <s.icon size={13} className={s.color} />
                </div>
              </div>
              <p className={`text-3xl font-black ${s.color} animate-count-up`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Map */}
          <div className="lg:col-span-2 animate-fade-in-up delay-200 opacity-0" style={{ animationFillMode: "forwards" }}>
            <div className="glass rounded-2xl p-4 border border-white/8 h-full">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-white font-semibold">Incident Map</h2>
                <span className="text-gray-500 text-xs">— Bengaluru</span>
              </div>
              <BengaluruMap entries={history} height="390px" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Severity Split */}
            <div className="glass rounded-2xl p-4 border border-white/8 animate-fade-in-up delay-300 opacity-0" style={{ animationFillMode: "forwards" }}>
              <h2 className="text-white font-semibold mb-1">Severity Split</h2>
              {sevCounts.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={sevCounts} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={4}>
                        {sevCounts.map((d, i) => <Cell key={i} fill={d.fill} stroke="transparent" />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }}
                        formatter={(v: any, n: any) => [v, n]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {sevCounts.map(d => (
                      <span key={d.name} className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.fill }} />
                        {d.name}: <strong className="text-white">{d.value}</strong>
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-gray-600 text-sm text-center py-10">No prediction data yet</div>
              )}
            </div>

            {/* Recent Events */}
            <div className="glass rounded-2xl p-4 border border-white/8 flex-1 animate-fade-in-up delay-400 opacity-0" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">Recent Events</h2>
                <Link href="/history" className="text-orange-400 text-xs flex items-center gap-1 hover:text-orange-300 transition-colors">
                  View all <ArrowRight size={11} />
                </Link>
              </div>
              {recent.length === 0 ? (
                <div className="text-gray-600 text-sm py-4 text-center">
                  No predictions yet.{" "}
                  <Link href="/predict" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
                    Make your first one
                  </Link>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {recent.map((e, i) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 hover:bg-white/3 rounded-lg px-1 transition-colors"
                    >
                      <div>
                        <p className="text-white text-sm font-medium capitalize">{e.input.event_cause.replace(/_/g, " ")}</p>
                        <p className="text-gray-600 text-xs">{new Date(e.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <SeverityBadge label={e.severity_label} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA when empty */}
        {history.length === 0 && (
          <div className="mt-10 text-center animate-fade-in delay-500 opacity-0" style={{ animationFillMode: "forwards" }}>
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Radar size={28} className="text-orange-400" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">No data yet</p>
                <p className="text-gray-500 text-sm mb-4">Run your first prediction to see the dashboard come alive.</p>
              </div>
              <Link
                href="/predict"
                className="btn-shimmer inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-sm"
              >
                Predict Your First Event <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
