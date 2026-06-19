"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PredictRequest, MetaResponse } from "@/types"
import { getMeta } from "@/lib/api"
import { validatePredictRequest } from "@/lib/validate"
import { EVENT_CAUSES, EVENT_TYPES, VEH_TYPES } from "@/lib/severity"
import { MapPin, Loader2, Zap, Clock, Building2, Car, Calendar, ChevronDown } from "lucide-react"

interface Props {
  onSubmit: (req: PredictRequest) => void
  loading: boolean
  pickedLocation?: { lat: number; lng: number } | null
}

const now = new Date()

const SectionLabel = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-1.5 mb-3">
    <Icon size={12} className="text-orange-400" />
    <span className="text-xs font-semibold text-orange-400/80 uppercase tracking-widest">{text}</span>
  </div>
)

const SelectField = ({ value, onChange, children, className = "" }: any) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all hover:border-white/20 ${className}`}
  >
    {children}
  </select>
)

export default function EventForm({ onSubmit, loading, pickedLocation }: Props) {
  const [meta, setMeta] = useState<MetaResponse | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<PredictRequest>({
    latitude:       12.9716,
    longitude:      77.5946,
    event_type:     "planned",
    event_cause:    "public_event",
    start_hour:     now.getHours(),
    day_of_week:    now.getDay() === 0 ? 6 : now.getDay() - 1,
    month:          now.getMonth() + 1,
    day:            now.getDate(),
    corridor:       undefined,
    police_station: undefined,
    zone:           undefined,
    veh_type:       undefined,
    duration_mins:  undefined,
  })

  useEffect(() => { getMeta().then(setMeta).catch(() => {}) }, [])
  useEffect(() => {
    if (pickedLocation) setForm(f => ({ ...f, latitude: pickedLocation.lat, longitude: pickedLocation.lng }))
  }, [pickedLocation])

  const set = (k: keyof PredictRequest, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validatePredictRequest(form)
    if (err) { setFormError(err); return }
    setFormError(null)
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
          <span className="text-red-500">⚠</span> {formError}
        </div>
      )}

      {/* Location */}
      <div>
        <SectionLabel icon={MapPin} text="Location" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Latitude</label>
            <Input
              type="number" step="any" placeholder="12.9716"
              value={form.latitude}
              onChange={e => set("latitude", parseFloat(e.target.value))}
              min={12} max={13}
              className="bg-white/5 border-white/10 text-white rounded-xl focus:border-orange-500/50 focus:ring-orange-500/20"
              required
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Longitude</label>
            <Input
              type="number" step="any" placeholder="77.5946"
              value={form.longitude}
              onChange={e => set("longitude", parseFloat(e.target.value))}
              min={77} max={78}
              className="bg-white/5 border-white/10 text-white rounded-xl focus:border-orange-500/50 focus:ring-orange-500/20"
              required
            />
          </div>
        </div>
        {pickedLocation && (
          <p className="text-orange-400 text-xs mt-1.5 flex items-center gap-1">
            <MapPin size={10} /> Location picked from map
          </p>
        )}
      </div>

      {/* Event */}
      <div>
        <SectionLabel icon={Zap} text="Event Details" />
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Event Type</label>
            <SelectField value={form.event_type} onChange={(e: any) => set("event_type", e.target.value)}>
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </SelectField>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Event Cause</label>
            <SelectField value={form.event_cause} onChange={(e: any) => set("event_cause", e.target.value)}>
              {EVENT_CAUSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </SelectField>
          </div>
        </div>
      </div>

      {/* Time */}
      <div>
        <SectionLabel icon={Clock} text="Date & Time" />
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Hour", key: "start_hour", min: 0, max: 23 },
            { label: "Day",  key: "day",        min: 1, max: 31 },
            { label: "Month",key: "month",      min: 1, max: 12 },
          ].map(f => (
            <div key={f.key}>
              <label className="text-gray-500 text-xs mb-1 block">{f.label}</label>
              <Input
                type="number" min={f.min} max={f.max}
                value={(form as any)[f.key]}
                onChange={e => set(f.key as keyof PredictRequest, parseInt(e.target.value))}
                className="bg-white/5 border-white/10 text-white rounded-xl focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>
          ))}
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Weekday</label>
            <SelectField value={form.day_of_week} onChange={(e: any) => set("day_of_week", parseInt(e.target.value))}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => <option key={i} value={i}>{d}</option>)}
            </SelectField>
          </div>
        </div>
      </div>

      {/* Location Context */}
      <div>
        <SectionLabel icon={Building2} text="Location Context" />
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Corridor</label>
              <SelectField value={form.corridor ?? ""} onChange={(e: any) => set("corridor", e.target.value || undefined)}>
                <option value="">Non-corridor</option>
                {(meta?.corridors ?? []).map(c => <option key={c} value={c}>{c}</option>)}
              </SelectField>
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Zone</label>
              <SelectField value={form.zone ?? ""} onChange={(e: any) => set("zone", e.target.value || undefined)}>
                <option value="">Unknown</option>
                {(meta?.zones ?? []).map(z => <option key={z} value={z}>{z}</option>)}
              </SelectField>
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Police Station</label>
            <SelectField value={form.police_station ?? ""} onChange={(e: any) => set("police_station", e.target.value || undefined)}>
              <option value="">Unknown</option>
              {(meta?.police_stations ?? []).map(p => <option key={p} value={p}>{p}</option>)}
            </SelectField>
          </div>
        </div>
      </div>

      {/* Vehicle & Duration */}
      <div>
        <SectionLabel icon={Car} text="Additional Info" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Vehicle Type</label>
            <SelectField value={form.veh_type ?? ""} onChange={(e: any) => set("veh_type", e.target.value || undefined)}>
              {VEH_TYPES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </SelectField>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Duration (mins)</label>
            <Input
              type="number" min={0} placeholder="e.g. 120"
              value={form.duration_mins ?? ""}
              onChange={e => set("duration_mins", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="bg-white/5 border-white/10 text-white rounded-xl focus:border-orange-500/50 focus:ring-orange-500/20"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-shimmer text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing Traffic Data...
          </>
        ) : (
          <>
            <Zap size={15} />
            Predict Congestion
          </>
        )}
      </button>
    </form>
  )
}
