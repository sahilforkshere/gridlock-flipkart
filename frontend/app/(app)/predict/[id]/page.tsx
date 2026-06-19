"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { HistoryEntry } from "@/types"
import { getHistory } from "@/lib/history"
import SeverityCard from "@/components/prediction/SeverityCard"
import ProbabilityChart from "@/components/prediction/ProbabilityChart"
import ResourcePanel from "@/components/prediction/ResourcePanel"
import SeverityBadge from "@/components/shared/SeverityBadge"
import {
  IconArrowLeft,
  IconEdit,
  IconMapPin,
  IconClock,
  IconCalendar,
  IconBuildingArch,
  IconAlertCircle,
} from "@tabler/icons-react"
import { pageContainer as container, fadeUp as item } from "@/lib/motion"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function PredictDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const reduced = useReducedMotion()
  const [entry, setEntry] = useState<HistoryEntry | null | undefined>(undefined)

  useEffect(() => {
    const history = getHistory()
    const found = history.find(e => e.id === id)
    setEntry(found ?? null)
  }, [id])

  if (entry === undefined) return null

  if (entry === null) {
    return (
      <div className="px-6 py-6 max-w-7xl mx-auto flex flex-col items-center justify-center py-24 gap-3 text-center">
        <IconAlertCircle size={36} stroke={1} className="text-zinc-700" />
        <p className="text-sm text-zinc-400">Prediction not found</p>
        <button onClick={() => router.push("/predict")} className="btn-secondary mt-2">
          <IconArrowLeft size={13} /> Back to Predict
        </button>
      </div>
    )
  }

  const inp = entry.input
  const inputRows = [
    { label: "Event Cause", value: inp.event_cause.replace(/_/g, " "), icon: IconBuildingArch },
    { label: "Event Type",  value: inp.event_type,                      icon: IconAlertCircle },
    { label: "Time",        value: `${String(inp.start_hour).padStart(2, "0")}:00`, icon: IconClock },
    { label: "Day",         value: DAYS[inp.day_of_week] ?? `Day ${inp.day_of_week}`, icon: IconCalendar },
    { label: "Date",        value: `${inp.day} ${MONTHS[inp.month - 1] ?? ""}`,        icon: IconCalendar },
    { label: "Coordinates", value: `${inp.latitude.toFixed(4)}, ${inp.longitude.toFixed(4)}`, icon: IconMapPin },
    ...(inp.corridor       ? [{ label: "Corridor",       value: inp.corridor,       icon: IconBuildingArch }] : []),
    ...(inp.police_station ? [{ label: "Police Station", value: inp.police_station, icon: IconBuildingArch }] : []),
    ...(inp.zone           ? [{ label: "Zone",           value: inp.zone,           icon: IconBuildingArch }] : []),
    ...(inp.duration_mins  ? [{ label: "Duration",       value: `${inp.duration_mins} min`, icon: IconClock }] : []),
  ]

  return (
    <motion.div
      variants={reduced ? {} : container}
      initial="hidden"
      animate="show"
      className="px-6 py-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Back + header */}
      <motion.div variants={reduced ? {} : item} className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/predict")}
            className="btn-ghost !px-0 !py-0 !gap-1 mb-2 text-zinc-500 hover:text-zinc-300"
          >
            <IconArrowLeft size={13} /> Back
          </button>
          <h1 className="text-xl font-medium text-zinc-50">Full Analysis</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {new Date(entry.timestamp).toLocaleString([], {
              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <SeverityBadge label={entry.severity_label} />
          <button
            onClick={() => router.push("/predict")}
            className="btn-secondary gap-1.5"
          >
            <IconEdit size={13} /> Edit &amp; Re-run
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left — Input summary */}
        <motion.div
          variants={reduced ? {} : item}
          className="lg:col-span-2 bg-[#0f0f12] border border-[#1c1c21] rounded-lg overflow-hidden self-start"
        >
          <div className="px-4 py-3 border-b border-[#1c1c21]">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Your Input</span>
          </div>
          <div className="px-4 py-1 divide-y divide-[#1c1c21]">
            {inputRows.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-2.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon size={12} stroke={1.5} className="text-zinc-600 shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
                </div>
                <span className="text-xs text-zinc-300 font-medium capitalize text-right truncate max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Full results */}
        <motion.div
          variants={reduced ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
          className="lg:col-span-3 space-y-4"
        >
          <motion.div variants={reduced ? {} : item}>
            <SeverityCard result={entry} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={reduced ? {} : item}>
              <ProbabilityChart probs={entry.class_probabilities} />
            </motion.div>

            <motion.div variants={reduced ? {} : item}
              className="bg-[#0f0f12] border border-[#1c1c21] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1c1c21]">
                <span className="text-xs uppercase tracking-widest text-zinc-500">Geo Context</span>
              </div>
              <div className="px-4 py-1 divide-y divide-[#1c1c21]">
                {[
                  { k: "Location Cluster", v: `Zone ${entry.location_cluster}` },
                  { k: "Severity Level",   v: `Level ${entry.severity_level} / 3` },
                  { k: "Model",            v: "Stacked Ensemble" },
                  { k: "Base Learners",    v: "LGBM · XGB · MLP · TabNet" },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center py-2.5">
                    <span className="text-xs uppercase tracking-widest text-zinc-500">{k}</span>
                    <span className="text-xs text-zinc-300 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={reduced ? {} : item}>
            <ResourcePanel rec={entry.recommendations} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
