"use client"
import { useEffect, useState, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"
import { HistoryEntry } from "@/types"
import { getHistory } from "@/lib/history"
import { SEVERITY_COLORS } from "@/lib/severity"
import SeverityBadge from "@/components/shared/SeverityBadge"
import GlowBorder from "@/components/shared/GlowBorder"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import {
  IconArrowRight,
  IconAlertTriangle,
  IconChartPie,
  IconMapPin,
  IconClockHour4,
  IconBolt,
} from "@tabler/icons-react"
import { pageContainer as container, fadeUp as item } from "@/lib/motion"

const BengaluruMap = dynamic(() => import("@/components/map/BengaluruMap"), { ssr: false })

function useCountUp(target: number, duration = 600, enabled = true) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (!enabled || target === 0) { setValue(target); return }
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round(p * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, enabled])

  return value
}

function StatCard({
  label,
  rawValue,
  displayValue,
  icon: Icon,
  accent,
  delay,
}: {
  label: string
  rawValue: number
  displayValue: string
  icon: any
  accent?: boolean
  delay: number
}) {
  const reduced = useReducedMotion()
  const count = useCountUp(rawValue, 500, !reduced)

  return (
    <GlowBorder className="h-full">
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 flex flex-col gap-3 h-full"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
          <Icon
            size={14}
            stroke={1.5}
            className={accent && rawValue > 0 ? "text-orange-500" : "text-zinc-600"}
          />
        </div>
        <p
          className={`text-2xl font-medium tabular-nums transition-colors ${
            accent && rawValue > 0 ? "text-orange-400" : "text-zinc-50"
          }`}
        >
          {typeof rawValue === "number" && displayValue.endsWith("%")
            ? displayValue
            : typeof rawValue === "number"
            ? count
            : displayValue}
        </p>
      </motion.div>
    </GlowBorder>
  )
}

export default function Dashboard() {
  const reduced = useReducedMotion()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  useEffect(() => { setHistory(getHistory()) }, [])

  const recent = history.slice(0, 6)
  const sevCounts = ["Low", "Medium", "High", "Critical"].map(label => ({
    name: label,
    value: history.filter(h => h.severity_label === label).length,
    fill: SEVERITY_COLORS[label],
  })).filter(d => d.value > 0)

  const avgConf = history.length
    ? (history.reduce((s, h) => s + h.confidence, 0) / history.length * 100).toFixed(1)
    : null

  const criticalCount = history.filter(h => h.severity_level === 3).length
  const highCount     = history.filter(h => h.severity_level === 2).length

  const stats = [
    { label: "Total Predictions", rawValue: history.length,  displayValue: String(history.length), icon: IconBolt,          accent: false },
    { label: "Critical",          rawValue: criticalCount,   displayValue: String(criticalCount),   icon: IconAlertTriangle, accent: true  },
    { label: "High Severity",     rawValue: highCount,       displayValue: String(highCount),       icon: IconChartPie,      accent: true  },
    { label: "Avg Confidence",    rawValue: 0,               displayValue: avgConf ? `${avgConf}%` : "—", icon: IconClockHour4, accent: false },
  ]

  return (
    <motion.div
      variants={reduced ? {} : container}
      initial="hidden"
      animate="show"
      className="relative px-6 py-6 max-w-7xl mx-auto space-y-6 pb-6"
    >
      {/* Ambient gradient — ties visually to landing hero */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.04] blur-[80px]"
        style={{ background: "radial-gradient(ellipse at center, #7C3AED 0%, #06B6D4 100%)" }}
        aria-hidden
      />

      {/* Page title */}
      <motion.div variants={reduced ? {} : item}>
        <h1 className="text-xl font-medium text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-400 leading-relaxed mt-0.5">Bengaluru congestion monitoring</p>
      </motion.div>

      {/* Stat row */}
      <motion.div variants={reduced ? {} : item}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <GlowBorder className="lg:col-span-2 h-full" innerClassName="flex flex-col">
          <motion.div variants={reduced ? {} : item} className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-[#1c1c21] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <IconMapPin size={13} stroke={1.5} className="text-zinc-500" />
                <span className="text-xs text-zinc-400">Incident Map</span>
              </div>
              <span className="text-xs uppercase tracking-widest text-zinc-600">Bengaluru</span>
            </div>
            <div className="p-3 flex-1 relative min-h-[370px]">
              <div className="absolute inset-3">
                <BengaluruMap entries={history} height="100%" />
              </div>
            </div>
          </motion.div>
        </GlowBorder>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Severity split */}
          <GlowBorder>
            <motion.div variants={reduced ? {} : item}>
              <div className="px-4 py-3 border-b border-[#1c1c21] flex items-center gap-2">
                <IconChartPie size={13} stroke={1.5} className="text-zinc-500" />
                <span className="text-xs text-zinc-400">Severity Distribution</span>
              </div>
              <div className="p-4">
                {sevCounts.length > 0 ? (
                  <>
                    <div className="relative">
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={sevCounts} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={3} isAnimationActive={!reduced}>
                            {sevCounts.map((d, i) => <Cell key={i} fill={d.fill} stroke="transparent" />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: "#0f0f12", border: "1px solid #1c1c21", borderRadius: 6, fontSize: 11 }} itemStyle={{ color: "#a1a1aa" }} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center label */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <p className="text-lg font-medium text-zinc-50 tabular-nums">{history.length}</p>
                          <p className="text-[9px] uppercase tracking-widest text-zinc-600">total</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      {sevCounts.map(d => (
                        <div key={d.name} className="flex items-center justify-between py-1">
                          <SeverityBadge label={d.name} size="sm" />
                          <span className="text-xs text-zinc-400 tabular-nums font-medium">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <IconChartPie size={28} stroke={1} className="text-zinc-700" />
                    <p className="text-xs text-zinc-500">No data yet</p>
                    <p className="text-xs text-zinc-600">Predictions will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </GlowBorder>

          {/* Recent events */}
          <motion.div variants={reduced ? {} : item}
            className="bg-[#0f0f12] border border-[#1c1c21] rounded-lg overflow-hidden flex-1">
            <div className="px-4 py-3 border-b border-[#1c1c21] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconClockHour4 size={13} stroke={1.5} className="text-zinc-500" />
                <span className="text-xs text-zinc-400">Recent Events</span>
              </div>
              <Link href="/history" className="btn-ghost !py-0.5 !px-2 !text-[11px] !gap-1">
                All <IconArrowRight size={11} />
              </Link>
            </div>
            <div className="divide-y divide-[#1c1c21]">
              {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-10 gap-2">
                  <IconClockHour4 size={28} stroke={1} className="text-zinc-700" />
                  <p className="text-xs text-zinc-500">No data yet</p>
                  <Link href="/predict" className="btn-primary mt-2">
                    Run First Prediction <IconArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                recent.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={reduced ? {} : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.2 }}
                    className="px-4 py-2.5 flex items-center justify-between hover:bg-[#141417] transition-colors"
                  >
                    <div>
                      <p className="text-xs font-medium text-zinc-50 capitalize">{e.input.event_cause.replace(/_/g, " ")}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <SeverityBadge label={e.severity_label} size="sm" />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

    </motion.div>
  )
}
