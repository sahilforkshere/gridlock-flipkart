"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { IconX, IconArrowRight, IconCheck } from "@tabler/icons-react"
import { PredictResponse } from "@/types"

const MODELS = ["LightGBM", "XGBoost", "MLP", "TabNet", "Meta-learner"]
const TICK_INTERVAL = 400 // ms between each checklist item
const RESULT_DELAY = 300  // ms pause after last checkmark before result appears

const SEV_COLOR: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
}

/* ── Typewriter hook ── */
function useTypewriter(text: string, speed = 18, enabled = true) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return }
    setDisplayed("")
    setDone(false)
    if (!text) return
    let i = 0
    let cancelled = false
    const tick = () => {
      if (cancelled) return
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
    return () => { cancelled = true; clearTimeout(t) }
  }, [text, speed, enabled])

  return { displayed, done }
}

/* ── Glow result card wrapper ── */
function ResultGlow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className={`relative rounded-lg p-px ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.4), rgba(124,58,237,0.3))`,
        backgroundSize: "200% 200%",
        animation: "glowShift 3s ease-in-out infinite alternate",
      }}
    >
      <div className="rounded-[7px] bg-[#0f0f12] h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  )
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

  // Animation phase states
  const [checkedCount, setCheckedCount] = useState(0)
  const loadingStartedRef = useRef(false)
  const [checklistDone, setChecklistDone] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showSeverity, setShowSeverity] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  // Hold API result until animation is ready
  const apiResultRef = useRef<PredictResponse | null>(null)
  const apiDoneRef = useRef(false)
  const checklistDoneRef = useRef(false)

  const summaryText = (apiResultRef.current || result)
    ? `${(apiResultRef.current || result)!.severity_label} severity detected with ${((apiResultRef.current || result)!.confidence * 100).toFixed(1)}% confidence. Zone ${(apiResultRef.current || result)!.location_cluster} cluster.`
    : ""

  const { displayed, done: twDone } = useTypewriter(summaryText, 18, !reduced && showResult)

  // Show buttons after typewriter finishes
  useEffect(() => {
    if (twDone && showResult) {
      const t = setTimeout(() => setShowButtons(true), 200)
      return () => clearTimeout(t)
    }
  }, [twDone, showResult])

  // Try to reveal result — only when BOTH API done + checklist done
  const tryRevealResult = useCallback(() => {
    if (apiDoneRef.current && checklistDoneRef.current) {
      setTimeout(() => {
        setShowResult(true)
        setTimeout(() => setShowSeverity(true), 100)
      }, RESULT_DELAY)
    }
  }, [])

  // Track loading/error via refs so the checklist animation doesn't get cancelled
  const loadingRef = useRef(loading)
  const errorRef = useRef(error)
  loadingRef.current = loading
  errorRef.current = error

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setCheckedCount(0)
      setChecklistDone(false)
      setShowResult(false)
      setShowSeverity(false)
      setShowButtons(false)
      apiResultRef.current = null
      apiDoneRef.current = false
      checklistDoneRef.current = false
      loadingStartedRef.current = false
      return
    }
  }, [open])

  // Sequential checklist animation — starts once when popup opens with loading=true
  // Only depends on `open` so it NEVER gets cancelled by loading/error state changes
  useEffect(() => {
    if (!open) return
    // Wait a tick for loading to be true (it's set in the same render)
    const startTimer = setTimeout(() => {
      if (!loadingRef.current) return
      if (loadingStartedRef.current) return
      loadingStartedRef.current = true

      setCheckedCount(0)
      setChecklistDone(false)
      checklistDoneRef.current = false
      let i = 0

      const next = () => {
        if (!loadingStartedRef.current) return // popup was closed
        i++
        setCheckedCount(i)
        if (i < MODELS.length) {
          setTimeout(next, TICK_INTERVAL)
        } else {
          // Checklist finished
          setChecklistDone(true)
          checklistDoneRef.current = true
          tryRevealResult()
        }
      }

      setTimeout(next, TICK_INTERVAL)
    }, 10)

    return () => clearTimeout(startTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // When API result arrives — store it, DON'T force checkmarks
  useEffect(() => {
    if (!loading && result && open) {
      apiResultRef.current = result
      apiDoneRef.current = true
      // Only reveal if checklist already finished; otherwise checklist will call tryRevealResult when it's done
      if (checklistDoneRef.current) {
        tryRevealResult()
      }
    }
  }, [loading, result, open, tryRevealResult])

  const displayResult = apiResultRef.current || result
  const color = displayResult ? (SEV_COLOR[displayResult.severity_label] ?? "#f97316") : "#f97316"

  return (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center p-6"
              style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.75)", zIndex: 10000 }}

              onClick={onClose}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative rounded-lg p-px bg-[#1c1c21]">
                  <div className="rounded-[7px] bg-[#0f0f12] h-full w-full overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-[#1c1c21] flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-zinc-50 whitespace-nowrap">
                        {error ? "Prediction Failed" : !checklistDone ? "Running Analysis\u2026" : showResult ? "Analysis Complete" : "Finalizing\u2026"}
                      </p>
                      <button onClick={onClose} className="btn-ghost !p-1.5">
                        <IconX size={15} stroke={1.5} />
                      </button>
                    </div>

                    <div className="px-5 py-5 space-y-5">
                      {/* Model checklist */}
                      <div className="space-y-2.5">
                        {MODELS.map((m, i) => {
                          const checked = i < checkedCount
                          const active = i === checkedCount && !checklistDone
                          return (
                            <div
                              key={m}
                              className="flex items-center gap-3 transition-opacity duration-200"
                              style={{ opacity: checked ? 1 : active ? 0.7 : 0.3 }}
                            >
                              <div
                                className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${checked ? "anim-check" : ""}`}
                                style={{
                                  borderColor: checked ? color : active ? "#3f3f46" : "#2a2a32",
                                  background: checked ? color : "transparent",
                                  width: "18px",
                                  height: "18px",
                                }}
                              >
                                {checked && <IconCheck size={10} stroke={2.5} color="#000" />}
                                {active && (
                                  <div
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ background: "#52525b" }}
                                  />
                                )}
                              </div>
                              <span className={`text-xs font-medium transition-colors duration-200 ${checked ? "text-zinc-200" : "text-zinc-600"}`}>
                                {m}
                              </span>
                              {active && (
                                <span className="text-[10px] text-zinc-600 animate-pulse ml-auto">
                                  processing…
                                </span>
                              )}
                              {checked && (
                                <span className="text-[10px] text-zinc-600 ml-auto">
                                  ✓
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Progress bar (during checklist) */}
                      {!checklistDone && (
                        <div className="w-full h-[2px] bg-[#1c1c21] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(to right, #7C3AED, #06B6D4)" }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${(checkedCount / MODELS.length) * 85}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </div>
                      )}

                      {/* Result reveal */}
                      <AnimatePresence>
                        {showResult && displayResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <ResultGlow>
                              <div className="p-4 space-y-3">
                                {/* Severity + confidence — pop in with scale */}
                                <AnimatePresence>
                                  {showSeverity && (
                                    <motion.div
                                      initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                      className="flex items-baseline justify-between"
                                    >
                                      <span
                                        className="text-2xl font-bold tracking-tight"
                                        style={{ color }}
                                      >
                                        {displayResult.severity_label.toUpperCase()}
                                      </span>
                                      <span className="text-lg font-medium tabular-nums text-zinc-50">
                                        {(displayResult.confidence * 100).toFixed(1)}%
                                      </span>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <div className="h-px w-full" style={{ background: `${color}30` }} />

                                {/* Typewriter description */}
                                <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">
                                  {reduced ? summaryText : displayed}
                                  {!reduced && !twDone && (
                                    <span className="inline-block w-[2px] h-[12px] bg-zinc-400 ml-0.5 animate-pulse" />
                                  )}
                                </p>
                              </div>
                            </ResultGlow>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Error */}
                      {error && !loading && (
                        <div className="rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/5 px-4 py-3">
                          <p className="text-xs text-[#ef4444]">{error}</p>
                        </div>
                      )}
                    </div>

                    {/* Footer buttons — fade in LAST */}
                    <AnimatePresence>
                      {showButtons && displayResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
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
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )
    }
