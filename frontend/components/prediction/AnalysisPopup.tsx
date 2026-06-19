"use client"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { IconX, IconArrowRight, IconCheck } from "@tabler/icons-react"
import { PredictResponse } from "@/types"
import GlowBorder from "@/components/shared/GlowBorder"

const MODELS = ["LightGBM", "XGBoost", "MLP", "TabNet", "Meta-learner"]

const SEV_COLOR: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
}

function useTypewriter(text: string, speed = 22, enabled = true) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return }
    setDisplayed("")
    setDone(false)
    if (!text) return
    let i = 0
    const tick = () => {
      i++
      setDisplayed(text.slice(0, i))
      if (i < text.length) {
        const delay = [",", ".", "!"].includes(text[i - 1]) ? speed * 6 : speed
        setTimeout(tick, delay)
      } else {
        setDone(true)
      }
    }
    const t = setTimeout(tick, speed)
    return () => clearTimeout(t)
  }, [text, speed, enabled])

  return { displayed, done }
}

interface Props {
  open: boolean
  loading: boolean
  result: PredictResponse | null
  error: string | null
  onClose: () => void
  onViewFull: () => void
}

export default function AnalysisPopup({ open, loading, result, error, onClose, onViewFull }: Props) {
  const reduced = useReducedMotion()
  const [checkedCount, setCheckedCount] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const summaryText = result
    ? `${result.severity_label} severity detected with ${(result.confidence * 100).toFixed(1)}% confidence. Zone ${result.location_cluster} cluster.`
    : ""

  const { displayed, done: twDone } = useTypewriter(summaryText, 20, !reduced && showResult)

  useEffect(() => {
    if (!open) {
      setCheckedCount(0)
      setShowResult(false)
      return
    }
    if (loading) {
      setCheckedCount(0)
      setShowResult(false)
      let i = 0
      const next = () => {
        if (i < MODELS.length) {
          i++
          setCheckedCount(i)
          tickRef.current = setTimeout(next, 180)
        }
      }
      tickRef.current = setTimeout(next, 120)
      return () => { if (tickRef.current) clearTimeout(tickRef.current) }
    }
  }, [open, loading])

  useEffect(() => {
    if (!loading && result && open) {
      setCheckedCount(MODELS.length)
      const t = setTimeout(() => setShowResult(true), 300)
      return () => clearTimeout(t)
    }
  }, [loading, result, open])

  const color = result ? (SEV_COLOR[result.severity_label] ?? "#f97316") : "#f97316"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.75)" }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <GlowBorder className="w-full" innerClassName="">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#1c1c21] flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-50">
                  {loading ? "Running Analysis…" : error ? "Prediction Failed" : "Analysis Complete"}
                </p>
                <button onClick={onClose} className="btn-ghost !p-1.5">
                  <IconX size={15} stroke={1.5} />
                </button>
              </div>

              <div className="px-5 py-5 space-y-5">
                {/* Model checklist */}
                <div className="space-y-2">
                  {MODELS.map((m, i) => {
                    const checked = i < checkedCount
                    const active = i === checkedCount && loading
                    return (
                      <motion.div
                        key={m}
                        initial={reduced ? {} : { opacity: 0, x: -6 }}
                        animate={{ opacity: checked || active ? 1 : 0.35, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200"
                          style={{
                            borderColor: checked ? color : "#2a2a32",
                            background: checked ? color : "transparent",
                          }}
                        >
                          {checked && <IconCheck size={9} stroke={2.5} color="#000" />}
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">{m}</span>
                        {active && (
                          <span className="text-[10px] text-zinc-600 animate-pulse">running…</span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Result reveal */}
                <AnimatePresence>
                  {showResult && result && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        className="rounded-lg border p-4 space-y-3"
                        style={{ borderColor: `${color}40`, background: `${color}08` }}
                      >
                        <div className="flex items-baseline justify-between">
                          <span
                            className="text-2xl font-bold tracking-tight"
                            style={{ color }}
                          >
                            {result.severity_label.toUpperCase()}
                          </span>
                          <span className="text-lg font-medium tabular-nums text-zinc-50">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-px w-full" style={{ background: `${color}30` }} />
                        <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">
                          {reduced ? summaryText : displayed}
                          {!reduced && !twDone && (
                            <span className="inline-block w-[2px] h-[12px] bg-zinc-400 ml-0.5 animate-pulse" />
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                {error && !loading && (
                  <div className="rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/08 px-4 py-3">
                    <p className="text-xs text-[#ef4444]">{error}</p>
                  </div>
                )}

                {/* Loading bar */}
                {loading && (
                  <div className="w-full h-[2px] bg-[#1c1c21] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(to right, #7C3AED, #06B6D4)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.2 }}
                  className="px-5 pb-5 flex items-center gap-2"
                >
                  <button onClick={onViewFull} className="btn-primary flex-1 justify-center gap-1.5">
                    View Full Analysis <IconArrowRight size={13} />
                  </button>
                  <button onClick={onClose} className="btn-secondary">
                    Close
                  </button>
                </motion.div>
              )}
            </GlowBorder>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
