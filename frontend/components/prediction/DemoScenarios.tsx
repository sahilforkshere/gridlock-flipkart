import { PredictRequest } from "@/types"
import { Zap, Users, AlertTriangle, Wrench, Droplets, HardHat, Flag, Crown, Trophy, Flame, MapPin } from "lucide-react"
import { SEVERITY_COLORS } from "@/lib/severity"
import SeverityBadge from "@/components/shared/SeverityBadge"

function getEventIcon(cause: string) {
  switch (cause) {
    case "public_event":      return <Users size={16} />
    case "accident":          return <AlertTriangle size={16} />
    case "vehicle_breakdown": return <Wrench size={16} />
    case "water_logging":     return <Droplets size={16} />
    case "road_work":         return <HardHat size={16} />
    case "procession":        return <Flag size={16} />
    case "vip_movement":      return <Crown size={16} />
    case "sports_event":      return <Trophy size={16} />
    case "fire":              return <Flame size={16} />
    default:                  return <MapPin size={16} />
  }
}

interface Demo {
  label: string
  tag: string
  description: string
  preset: PredictRequest
}

const DEMOS: Demo[] = [
  {
    label: "Cricket at Chinnaswamy",
    tag: "Critical",
    description: "IPL match, 6 PM Friday, MG Road corridor",
    preset: {
      latitude: 12.9788,
      longitude: 77.5996,
      event_type: "planned",
      event_cause: "public_event",
      start_hour: 18,
      day_of_week: 4,
      month: 6,
      day: 20,
      corridor: "MG Road",
      zone: "CBD 1",
      police_station: "Cubbon Park",
      duration_mins: 240,
      veh_type: undefined,
    },
  },
  {
    label: "Breakdown on Outer Ring Road",
    tag: "High",
    description: "Heavy vehicle, 9 AM Monday, ORR East",
    preset: {
      latitude: 12.9352,
      longitude: 77.6245,
      event_type: "unplanned",
      event_cause: "vehicle_breakdown",
      start_hour: 9,
      day_of_week: 0,
      month: 6,
      day: 16,
      corridor: "ORR East 1",
      zone: "East",
      police_station: "Marathahalli",
      duration_mins: 90,
      veh_type: "heavy",
    },
  },
  {
    label: "Procession in CBD",
    tag: "Medium",
    description: "Religious procession, 2 PM Sunday",
    preset: {
      latitude: 12.9762,
      longitude: 77.5929,
      event_type: "planned",
      event_cause: "procession",
      start_hour: 14,
      day_of_week: 6,
      month: 6,
      day: 22,
      corridor: undefined,
      zone: "CBD 2",
      police_station: "Indiranagar",
      duration_mins: 120,
      veh_type: undefined,
    },
  },
  {
    label: "Road Work — Off Peak",
    tag: "Low",
    description: "Scheduled repair, 2 AM, industrial area",
    preset: {
      latitude: 12.9236,
      longitude: 77.5921,
      event_type: "planned",
      event_cause: "road_work",
      start_hour: 2,
      day_of_week: 2,
      month: 6,
      day: 18,
      corridor: undefined,
      zone: "South",
      police_station: "JP Nagar",
      duration_mins: 180,
      veh_type: undefined,
    },
  },
]

interface Props {
  onLoad: (preset: PredictRequest) => void
}

export default function DemoScenarios({ onLoad }: Props) {
  return (
    <div className="surface rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
      {DEMOS.map((d, i) => {
        const color = SEVERITY_COLORS[d.tag] || "var(--border-subtle)"
        return (
          <button
            key={d.label}
            onClick={() => onLoad(d.preset)}
            className="w-full relative flex flex-col items-start hover:bg-[var(--bg-elevated-2)] transition-colors group p-4"
          >
            {/* Top border severity line */}
            <div 
              className="absolute top-0 left-0 right-0 h-[3px] opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: color }}
            />
            
            <div className="w-full flex justify-between items-start mb-2 mt-1">
              <span className="text-xl bg-[var(--bg-base)] w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-subtle)] shadow-sm shrink-0">
                {getEventIcon(d.preset.event_cause)}
              </span>
              <SeverityBadge label={d.tag} size="sm" />
            </div>

            <div className="text-left w-full mt-1">
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-signal)] transition-colors line-clamp-1">{d.label}</p>
              <p className="font-data text-[10px] text-[var(--text-secondary)] leading-relaxed">{d.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
