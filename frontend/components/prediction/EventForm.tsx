"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { PredictRequest, MetaResponse } from "@/types"
import { getMeta } from "@/lib/api"
import { validatePredictRequest } from "@/lib/validate"
import { EVENT_CAUSES, EVENT_TYPES, VEH_TYPES } from "@/lib/severity"
import { Loader2 } from "lucide-react"

interface Props {
  onSubmit: (req: PredictRequest) => void
  loading: boolean
  pickedLocation?: { lat: number; lng: number } | null
  externalPreset?: PredictRequest | null
}

const now = new Date()

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.08em] mb-1.5">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm rounded px-3 py-2 placeholder:text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-strong)] focus:border-[var(--accent-signal)] focus:outline-none"
const selectCls = `${inputCls} cursor-pointer`

export default function EventForm({ onSubmit, loading, pickedLocation, externalPreset }: Props) {
  const [meta, setMeta] = useState<MetaResponse | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<PredictRequest>({
    latitude: 12.9716,
    longitude: 77.5946,
    event_type: "planned",
    event_cause: "public_event",
    start_hour: now.getHours(),
    day_of_week: now.getDay() === 0 ? 6 : now.getDay() - 1,
    month: now.getMonth() + 1,
    day: now.getDate(),
    corridor: undefined,
    police_station: undefined,
    zone: undefined,
    veh_type: undefined,
    duration_mins: undefined,
  })

  useEffect(() => { getMeta().then(setMeta).catch(() => { }) }, [])
  useEffect(() => {
    if (pickedLocation) setForm(f => ({ ...f, latitude: pickedLocation.lat, longitude: pickedLocation.lng }))
  }, [pickedLocation])
  useEffect(() => {
    if (externalPreset) setForm(externalPreset)
  }, [externalPreset])

  const set = (k: keyof PredictRequest, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validatePredictRequest(form)
    if (err) { setFormError(err); return }
    setFormError(null)
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0 divide-y divide-[var(--border-subtle)] h-full flex flex-col">
      {formError && (
        <div className="px-4 py-2.5 text-[var(--severity-critical)] text-xs bg-[var(--severity-critical)]/10 border-b border-[var(--severity-critical)]/20 shrink-0">
          {formError}
        </div>
      )}

      <div className="overflow-auto flex-1">
        {/* Location */}
        <div className="px-4 py-4 space-y-3 bg-[var(--bg-elevated-1)]">
          <p className="text-[10px] text-[var(--accent-signal)] uppercase tracking-[0.12em] font-medium">Location</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude">
              <input type="number" step="any" placeholder="12.9716" value={form.latitude} min={12} max={14} required
                onChange={e => set("latitude", parseFloat(e.target.value))}
                className={`${inputCls} font-data`} />
            </Field>
            <Field label="Longitude">
              <input type="number" step="any" placeholder="77.5946" value={form.longitude} min={77} max={78.5} required
                onChange={e => set("longitude", parseFloat(e.target.value))}
                className={`${inputCls} font-data`} />
            </Field>
          </div>
          {pickedLocation && (
            <p className="text-[10px] text-[var(--accent-signal)] font-medium bg-[var(--accent-signal)]/10 px-2 py-1 rounded inline-block">Location set from map</p>
          )}
        </div>

        {/* Event */}
        <div className="px-4 py-4 space-y-3">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.12em] font-medium">Event</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select value={form.event_type} onChange={e => set("event_type", e.target.value)} className={selectCls}>
                {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Cause">
              <select value={form.event_cause} onChange={e => set("event_cause", e.target.value)} className={selectCls}>
                {EVENT_CAUSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Date & Time */}
        <div className="px-4 py-4 space-y-3 bg-[var(--bg-elevated-1)]">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.12em] font-medium">Date & Time</p>
          <Field label="Select Event Time">
            <input
              type="datetime-local"
              min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              value={`${new Date().getFullYear()}-${form.month.toString().padStart(2, '0')}-${form.day.toString().padStart(2, '0')}T${form.start_hour.toString().padStart(2, '0')}:00`}
              onChange={(e) => {
                if (!e.target.value) return;
                const d = new Date(e.target.value);
                setForm(f => ({
                  ...f,
                  month: d.getMonth() + 1,
                  day: d.getDate(),
                  start_hour: d.getHours(),
                  day_of_week: d.getDay() === 0 ? 6 : d.getDay() - 1 // 0=Mon, 6=Sun
                }));
              }}
              className={`${inputCls} font-data`}
              style={{ colorScheme: 'dark' }} // Forces dark theme for native calendar popups
            />
          </Field>
        </div>

        {/* Context */}
        <div className="px-4 py-4 space-y-3">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.12em] font-medium">Location Context</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Corridor">
              <select value={form.corridor ?? ""} onChange={e => set("corridor", e.target.value || undefined)} className={selectCls}>
                <option value="">Non-corridor</option>
                {(meta?.corridors ?? []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Zone">
              <select value={form.zone ?? ""} onChange={e => set("zone", e.target.value || undefined)} className={selectCls}>
                <option value="">Unknown</option>
                {(meta?.zones ?? []).map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Police Station">
            <select value={form.police_station ?? ""} onChange={e => set("police_station", e.target.value || undefined)} className={selectCls}>
              <option value="">Unknown</option>
              {(meta?.police_stations ?? []).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        {/* Additional */}
        <div className="px-4 py-4 space-y-3 bg-[var(--bg-elevated-1)]">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.12em] font-medium">Additional</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vehicle Type">
              <select value={form.veh_type ?? ""} onChange={e => set("veh_type", e.target.value || undefined)} className={selectCls}>
                <option value="">Unknown / NA</option>
                {VEH_TYPES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </Field>
            <Field label="Duration (min)">
              <input type="number" min={0} placeholder="e.g. 120"
                value={form.duration_mins ?? ""}
                onChange={e => set("duration_mins", e.target.value ? parseFloat(e.target.value) : undefined)}
                className={`${inputCls} font-data`} />
            </Field>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="px-4 py-4 bg-[var(--bg-elevated-1)] shrink-0 border-t border-[var(--border-subtle)]">
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 !text-sm"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin mr-1.5" /> Analyzing...</>
          ) : (
            "Run Prediction"
          )}
        </button>
      </div>
    </form>
  )
}
