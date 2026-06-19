"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"
import EventForm from "@/components/prediction/EventForm"
import DemoScenarios from "@/components/prediction/DemoScenarios"
import AnalysisPopup from "@/components/prediction/AnalysisPopup"
import { PredictRequest, PredictResponse } from "@/types"
import { predictEvent } from "@/lib/api"
import { saveEntry } from "@/lib/history"
import { IconScanEye, IconMapPin } from "@tabler/icons-react"
import { pageContainer as container, fadeUp as item } from "@/lib/motion"

const BengaluruMap = dynamic(() => import("@/components/map/BengaluruMap"), { ssr: false })


export default function PredictPage() {
  const reduced = useReducedMotion()
  const router = useRouter()
  const [loading, setLoading]               = useState(false)
  const [result, setResult]                 = useState<PredictResponse | null>(null)
  const [error, setError]                   = useState<string | null>(null)
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [demoPreset, setDemoPreset]         = useState<PredictRequest | null>(null)
  const [popupOpen, setPopupOpen]           = useState(false)
  const [savedId, setSavedId]               = useState<string | null>(null)

  const handleSubmit = async (req: PredictRequest) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setSavedId(null)
    setPopupOpen(true)
    try {
      const res = await predictEvent(req)
      const entry = saveEntry(req, res)
      setResult(res)
      setSavedId(entry.id)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLoad = (preset: PredictRequest) => {
    setDemoPreset(preset)
    setPickedLocation({ lat: preset.latitude, lng: preset.longitude })
    setResult(null)
    setError(null)
  }

  const handleViewFull = () => {
    if (savedId) {
      setPopupOpen(false)
      router.push(`/predict/${savedId}`)
    }
  }

  return (
    <>
      <AnalysisPopup
        open={popupOpen}
        loading={loading}
        result={result}
        error={error}
        onClose={() => setPopupOpen(false)}
        onViewFull={handleViewFull}
      />

      <motion.div
        variants={reduced ? {} : container}
        initial="hidden"
        animate="show"
        className="px-6 py-6 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={reduced ? {} : item} className="mb-6">
          <h1 className="text-xl font-medium text-zinc-50">Predict Congestion</h1>
          <p className="text-sm text-zinc-400 leading-relaxed mt-0.5">Fill in event details or load a demo scenario</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left — Demo + Form + Map */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <motion.div variants={reduced ? {} : item}>
              <DemoScenarios onLoad={handleDemoLoad} />
            </motion.div>

            <motion.div variants={reduced ? {} : item}
              className="bg-[#0f0f12] border border-[#1c1c21] rounded-lg overflow-hidden">
              <EventForm
                onSubmit={handleSubmit}
                loading={loading}
                pickedLocation={pickedLocation}
                externalPreset={demoPreset}
              />
            </motion.div>

            <motion.div variants={reduced ? {} : item}
              className="bg-[#0f0f12] border border-[#1c1c21] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1c1c21] flex items-center gap-2">
                <IconMapPin size={13} stroke={1.5} className="text-zinc-500" />
                <span className="text-xs uppercase tracking-widest text-zinc-500">Click map to set coordinates</span>
              </div>
              <div className="p-2">
                <BengaluruMap
                  onMapClick={(lat, lng) => setPickedLocation({ lat, lng })}
                  pickedLocation={pickedLocation}
                  entries={[]}
                  height="220px"
                />
              </div>
            </motion.div>
          </div>

          {/* Right — idle state / prompt */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div variants={reduced ? {} : item}
              className="bg-[#0f0f12] border border-[#1c1c21] rounded-lg flex flex-col items-center justify-center px-6 py-20 gap-3 text-center">
              <IconScanEye size={36} stroke={1} className="text-zinc-700" />
              <p className="text-sm text-zinc-400">No prediction yet</p>
              <p className="text-xs text-zinc-600">
                Load a demo scenario or configure the event, then click{" "}
                <span className="text-zinc-500 font-medium">Run Prediction</span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
