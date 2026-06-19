"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import EventForm from "@/components/prediction/EventForm"
import SeverityCard from "@/components/prediction/SeverityCard"
import ProbabilityChart from "@/components/prediction/ProbabilityChart"
import PredictionSkeleton from "@/components/prediction/PredictionSkeleton"
import ResourcePanel from "@/components/prediction/ResourcePanel"
import { PredictRequest, PredictResponse } from "@/types"
import { predictEvent } from "@/lib/api"
import { saveEntry } from "@/lib/history"
import { Radar, MapPin, Info } from "lucide-react"

const BengaluruMap = dynamic(() => import("@/components/map/BengaluruMap"), { ssr: false })

export default function PredictPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [lastReq, setLastReq] = useState<PredictRequest | null>(null)

  const handleSubmit = async (req: PredictRequest) => {
    setLoading(true)
    setError(null)
    setLastReq(req)
    try {
      const res = await predictEvent(req)
      setResult(res)
      saveEntry(req, res)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-grid min-h-full">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Radar size={14} className="text-orange-400" />
            <span className="text-orange-400 text-xs uppercase tracking-widest font-semibold">Prediction Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Predict Congestion Impact</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in event details or click the map to set location</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left — Form + Map */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5 border border-white/8 animate-fade-in-up delay-100 opacity-0" style={{ animationFillMode: "forwards" }}>
              <EventForm onSubmit={handleSubmit} loading={loading} pickedLocation={pickedLocation} />
            </div>

            <div className="glass rounded-2xl p-4 border border-white/8 animate-fade-in-up delay-200 opacity-0" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <MapPin size={12} className="text-orange-400" />
                <p className="text-orange-400/80 text-xs uppercase tracking-widest font-semibold">Click to set location</p>
              </div>
              <BengaluruMap
                onMapClick={(lat, lng) => setPickedLocation({ lat, lng })}
                pickedLocation={pickedLocation}
                entries={[]}
                height="240px"
              />
            </div>
          </div>

          {/* Right — Results */}
          <div className="lg:col-span-3 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 flex items-center gap-2.5 animate-fade-in">
                <span className="text-red-500 text-lg">⚠</span>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!result && !loading && (
              <div className="glass rounded-2xl border border-white/8 p-14 text-center animate-fade-in delay-300 opacity-0" style={{ animationFillMode: "forwards" }}>
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <Radar size={28} className="text-orange-400" />
                </div>
                <p className="text-white font-semibold mb-2">Ready to Predict</p>
                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Fill in the event details and click <strong className="text-orange-400">Predict Congestion</strong> to see severity, confidence, and deployment recommendations.
                </p>
              </div>
            )}

            {loading && <PredictionSkeleton />}

            {result && !loading && (
              <div className="space-y-4">
                <SeverityCard result={result} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProbabilityChart probs={result.class_probabilities} />

                  {/* Event Details */}
                  <div className="glass rounded-2xl p-5 border border-white/8 animate-fade-in-up delay-100 opacity-0" style={{ animationFillMode: "forwards" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Info size={14} className="text-orange-400" />
                      <h3 className="text-white font-semibold">Event Details</h3>
                    </div>
                    {lastReq && (
                      <div className="space-y-2.5">
                        {[
                          { label: "Cause",    value: lastReq.event_cause.replace(/_/g, " ") },
                          { label: "Type",     value: lastReq.event_type },
                          { label: "Hour",     value: `${lastReq.start_hour}:00` },
                          { label: "Cluster",  value: `Zone ${result.location_cluster}` },
                          ...(lastReq.corridor ? [{ label: "Corridor", value: lastReq.corridor }] : []),
                          ...(lastReq.zone ? [{ label: "Zone", value: lastReq.zone }] : []),
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
                            <span className="text-white text-sm font-medium capitalize">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <ResourcePanel rec={result.recommendations} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
