"use client"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import SmoothScroll from "@/components/providers/SmoothScroll"
import { Brain, GitBranch, Map, Zap, Shield, TrendingUp, ArrowRight, ChevronRight, Trophy, Wrench, Flag, HardHat } from "lucide-react"
import RoadGrid from "@/components/ui/RoadGrid"
import Aurora from "@/components/ui/Aurora"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
}



const FEATURES = [
  { icon: Brain, title: "Stacked Ensemble", body: "LightGBM, XGBoost, MLP, and TabNet feed into a meta-learner \u2014 the same architecture used in top-tier production forecasting systems." },
  { icon: Map, title: "KMeans Geo-Clustering", body: "20 Bengaluru-specific clusters learned from real GPS corridors, police station zones, and arterial road data." },
  { icon: Zap, title: "Sub-Second Prediction", body: "Python FastAPI sidecar serving pre-trained .pkl models. Four severity classes with per-class probability output." },
  { icon: Shield, title: "Resource Recommendations", body: "Every prediction includes actionable deployment advice: police posts, diversion routes, peak-hour advisories." },
  { icon: GitBranch, title: "Event-Aware Features", body: "Encodes event type, cause, time-of-day, day-of-week, corridor flags, and vehicle mix \u2014 17 engineered features total." },
  { icon: TrendingUp, title: "Live History Tracking", body: "All predictions persist in-browser. Reviewable as a time-series table with severity distribution at a glance." },
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const progressScale = useTransform(scrollY, [0, 4000], [0, 1])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 50)
    })
  }, [scrollY])

  return (
    <SmoothScroll>
      {/* scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
        style={{ background: "var(--accent-signal)", scaleX: progressScale }}
      />

      {/* Floating Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-6 pointer-events-none">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`pointer-events-auto flex items-center justify-between px-6 py-3 border rounded-full backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-4xl transition-colors duration-300 ${scrolled ? 'bg-[var(--bg-base)]/95 border-[var(--border-strong)]' : 'bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)]'}`}
        >
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[var(--data-live)] shadow-[0_0_8px_rgba(45,212,212,0.6)]"
            />
            <span className="text-[var(--text-primary)] font-semibold text-sm tracking-tight">ASTRAM</span>

          </div>

          <div className="flex items-center gap-6">
            <Link href="/model" className="hidden sm:block text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Model Details
            </Link>
            <Link href="/dashboard" className="group flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] transition-colors bg-[var(--bg-elevated-2)] hover:bg-[var(--border-hover)] px-4 py-1.5 rounded-full">
              Open App
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.header>
      </div>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 bg-[var(--bg-base)]">
        {/* Full-screen Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none" style={{ filter: "blur(30px)" }}>
          <Aurora
            colorStops={["#00ff87", "#B497CF", "#6100FF"]}
            blend={1.0}
            amplitude={2.0}
            speed={0.8}
          />
        </div>

        <RoadGrid />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[11px] text-[var(--text-secondary)] mb-8 tracking-wider uppercase">
            <span className="w-1 h-1 rounded-full bg-[var(--accent-signal)]" />
            Bengaluru Traffic Intelligence
          </motion.div>

          <motion.div custom={0.08} variants={fadeUp} initial="hidden" animate="show" className="relative mb-6">
            <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-[var(--text-primary)] relative z-10 drop-shadow-lg">
              Predict congestion
            </h1>
            <div className="flex justify-center">
              <TypewriterEffectSmooth
                words={[
                  { text: "Before ", className: "text-[var(--accent-signal)] font-display text-[clamp(2.8rem,7vw,6rem)] font-bold tracking-[-0.03em] leading-[1.05] drop-shadow-lg" },
                  { text: " it ", className: "text-[var(--accent-signal)] font-display text-[clamp(2.8rem,7vw,6rem)] font-bold tracking-[-0.03em] leading-[1.05] drop-shadow-lg" },
                  { text: "happens.", className: "text-[var(--accent-signal)] font-display text-[clamp(2.8rem,7vw,6rem)] font-bold tracking-[-0.03em] leading-[1.05] drop-shadow-lg" },
                ]
                }
                className="justify-center"
                cursorClassName="bg-[var(--accent-signal)] h-[clamp(2.8rem,7vw,5.5rem)]"
              />
            </div>
          </motion.div>

          <motion.p custom={0.16} variants={fadeUp} initial="hidden" animate="show"
            className="text-[clamp(1rem,2vw,1.2rem)] text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed mb-10 relative z-10">
            Event-driven severity classification for Bengaluru using a stacked ensemble of
            LightGBM, XGBoost, MLP, and TabNet. Input to recommendation in under 120ms.
          </motion.p>

          <motion.div custom={0.24} variants={fadeUp} initial="hidden" animate="show"
            className="flex items-center justify-center gap-3 flex-wrap pointer-events-auto">
            <Link href="/predict"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-[var(--bg-base)] overflow-hidden transition-all duration-200 hover:shadow-[0_0_30px_rgba(242,169,59,0.35)] active:scale-[0.98] bg-[var(--accent-signal)] hover:bg-[var(--accent-signal-hover)]">
              Run a Prediction
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-200 active:scale-[0.98]">
              View Dashboard
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-4 h-4 text-[var(--border-hover)]">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3v10M4 9l4 4 4-4" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-14 text-center">
            <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-[0.18em] mb-3">Under the hood</p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)]">Built for real-world traffic</h2>
          </motion.div>
          <div className="relative w-full overflow-hidden flex py-10 -mx-6 px-6"
            style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <div className="flex gap-4 anim-marquee w-max group hover:anim-marquee-paused">
              {[...FEATURES, ...FEATURES].map(({ icon: Icon, title, body }, i) => (
                <div key={`${title}-${i}`} className="group/card relative w-[300px] shrink-0 p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)] transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-elevated-2)]">
                      <Icon size={15} className="text-[var(--accent-signal)]" />
                    </div>

                    {/* Small data preview instead of generic icon */}
                    <div className="h-8 flex items-center justify-end text-[var(--text-tertiary)] opacity-60">
                      {title === "Stacked Ensemble" && (
                        <div className="flex gap-1 h-3">
                          <div className="w-4 bg-[var(--severity-low)] rounded-sm" />
                          <div className="w-3 bg-[var(--severity-medium)] rounded-sm" />
                          <div className="w-5 bg-[var(--severity-high)] rounded-sm" />
                          <div className="w-2 bg-[var(--severity-critical)] rounded-sm" />
                        </div>
                      )}
                      {title === "KMeans Geo-Clustering" && (
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                          <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] -mt-1" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                        </div>
                      )}
                      {title === "Sub-Second Prediction" && (
                        <span className="font-data text-[10px]">&lt;120ms</span>
                      )}
                      {title === "Resource Recommendations" && (
                        <div className="flex gap-1">
                          <span className="px-1.5 py-0.5 text-[8px] bg-[var(--border-subtle)] rounded uppercase">Officers</span>
                        </div>
                      )}
                      {title === "Event-Aware Features" && (
                        <div className="flex gap-0.5">
                          <span className="w-4 h-2 bg-[var(--accent-signal)] opacity-50 rounded-sm" />
                          <span className="w-2 h-2 bg-[var(--border-subtle)] rounded-sm" />
                        </div>
                      )}
                      {title === "Live History Tracking" && (
                        <div className="flex items-end gap-0.5 h-4">
                          <div className="w-1 h-2 bg-[var(--text-tertiary)]" />
                          <div className="w-1 h-4 bg-[var(--text-secondary)]" />
                          <div className="w-1 h-3 bg-[var(--text-tertiary)]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-14 text-center">
            <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-[0.18em] mb-3">Pipeline</p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)]">Input to insight in 3 steps</h2>
          </motion.div>
          <div className="relative max-w-3xl mx-auto py-10">
            {/* Connecting Vertical Line */}
            <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border-subtle)] -translate-x-1/2" />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-7 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--accent-signal)] origin-top opacity-50"
            />

            <div className="flex flex-col gap-10">
              {[
                {
                  n: "01",
                  title: "Describe the event",
                  body: "Location, type, cause, time, corridor, police zone, vehicle mix \u2014 17 features total.",
                  preview: (
                    <div className="flex flex-col gap-2 p-3 bg-[var(--bg-elevated-2)] rounded border border-[var(--border-subtle)]">
                      <div className="flex justify-between items-center"><span className="text-[9px] uppercase text-[var(--text-tertiary)]">LATITUDE</span><span className="font-data text-[10px] text-[var(--text-secondary)]">12.9716</span></div>
                      <div className="h-px bg-[var(--border-subtle)]" />
                      <div className="flex justify-between items-center"><span className="text-[9px] uppercase text-[var(--text-tertiary)]">EVENT CAUSE</span><span className="font-data text-[10px] text-[var(--text-secondary)]">Public Event</span></div>
                    </div>
                  )
                },
                {
                  n: "02",
                  title: "Ensemble inference",
                  body: "4 base models score independently. Meta-learner blends outputs into a calibrated severity class + probability distribution.",
                  preview: (
                    <div className="flex gap-2 p-3 bg-[var(--bg-elevated-2)] rounded border border-[var(--border-subtle)] justify-center">
                      {["LGBM", "XGB", "MLP", "TAB"].map(m => (
                        <div key={m} className="px-1.5 py-1 text-[9px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded text-[var(--text-secondary)]">{m}</div>
                      ))}
                    </div>
                  )
                },
                {
                  n: "03",
                  title: "Act on the output",
                  body: "Severity badge, per-class probabilities, and specific resource deployment recommendations \u2014 ready to share.",
                  preview: (
                    <div className="flex items-center gap-3 p-3 bg-[var(--bg-elevated-2)] rounded border border-[var(--border-subtle)]">
                      <div className="px-2 py-1 rounded-full bg-[#e5484d]/10 border border-[#e5484d]/20 text-[#e5484d] text-[10px] font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]" /> CRITICAL
                      </div>
                      <span className="font-data text-xs text-[var(--text-primary)]">94.2%</span>
                    </div>
                  )
                },
              ].map(({ n, title, body, preview }, i) => (
                <motion.div key={n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-center gap-6 md:gap-10 ${i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}
                >
                  {/* Preview side */}
                  <div className="hidden md:flex flex-1 items-center justify-center opacity-60">
                    <div className="w-48">
                      {preview}
                    </div>
                  </div>

                  {/* Node */}
                  <div className="relative z-10 flex shrink-0 items-center justify-center w-14 h-14 rounded-full border border-[var(--accent-signal)] bg-[var(--bg-elevated)] shadow-[0_0_15px_rgba(242,169,59,0.15)] group hover:shadow-[0_0_25px_rgba(242,169,59,0.25)] transition-shadow duration-500">
                    <span className="font-data text-base font-bold text-[var(--accent-signal)]">{n}</span>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pt-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm md:inline-block md:mx-auto md:mr-0">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-6 md:px-12 py-16 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(242, 169, 59, 0.15), transparent 60%)" }} />
            <div className="relative z-10">
              <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-[0.18em] mb-4 font-medium">Try it now</p>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)] mb-10">
                Load a demo scenario
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full mx-auto mb-10 text-left">
                {[
                  { label: "Cricket at Chinnaswamy", tag: "Critical", icon: Trophy,  color: "var(--severity-critical)", bg: "bg-[#e5484d]/10", border: "border-[#e5484d]/30" },
                  { label: "Breakdown on ORR",       tag: "High",     icon: Wrench,  color: "var(--severity-high)",     bg: "bg-[#f2873b]/10", border: "border-[#f2873b]/30" },
                  { label: "Procession in CBD",      tag: "Medium",   icon: Flag,    color: "var(--severity-medium)",   bg: "bg-[#f2a93b]/10", border: "border-[#f2a93b]/30" },
                  { label: "Road Work Off Peak",     tag: "Low",      icon: HardHat, color: "var(--severity-low)",      bg: "bg-[#34c77b]/10", border: "border-[#34c77b]/30" },
                ].map((demo, i) => (
                  <Link key={demo.label} href={`/predict?demo=${encodeURIComponent(demo.label)}`}
                    className="group relative flex flex-col justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-elevated-2)] border border-[var(--border-subtle)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-1 hover:shadow-2xl z-10"
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at top right, ${demo.color}15, transparent 70%)` }} />
                    
                    <div className="relative z-10 flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${demo.bg} ${demo.border} border shadow-inner`}>
                        <demo.icon size={18} style={{ color: demo.color }} />
                      </div>
                      <ArrowRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <div className="relative z-10 mt-2">
                      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1.5 line-clamp-2 leading-snug">{demo.label}</h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: demo.color, background: demo.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{demo.tag} SEVERITY</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap mt-8">
                <Link href="/predict"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold text-[var(--bg-base)] overflow-hidden transition-all duration-300 active:scale-[0.98] bg-[var(--accent-signal)] hover:shadow-[0_0_30px_rgba(242,169,59,0.35)]">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10">Start from scratch</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-6 bg-[var(--bg-base)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
          <span>ASTRAM Gridlock — Bengaluru Traffic Intelligence</span>
          <span>Flipkart GridLock</span>
        </div>
      </footer>
    </SmoothScroll>
  )
}
