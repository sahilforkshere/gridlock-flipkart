export const SEVERITY_COLORS: Record<string, string> = {
  Low:      "#34c77b",
  Medium:   "#f2a93b",
  High:     "#f2873b",
  Critical: "#e5484d",
}

export const SEVERITY_BG: Record<string, string> = {
  Low:      "bg-[#34c77b]",
  Medium:   "bg-[#f2a93b]",
  High:     "bg-[#f2873b]",
  Critical: "bg-[#e5484d]",
}

export const SEVERITY_TEXT: Record<string, string> = {
  Low:      "text-[#34c77b]",
  Medium:   "text-[#f2a93b]",
  High:     "text-[#f2873b]",
  Critical: "text-[#e5484d]",
}

export const SEVERITY_BORDER: Record<string, string> = {
  Low:      "border-[#34c77b]",
  Medium:   "border-[#f2a93b]",
  High:     "border-[#f2873b]",
  Critical: "border-[#e5484d]",
}

export const SEVERITY_EMOJI: Record<string, string> = {
  Low:      "",
  Medium:   "",
  High:     "",
  Critical: "",
}

export const EVENT_CAUSES = [
  { value: "public_event",        label: "Public Event (Rally / Festival)" },
  { value: "accident",            label: "Accident" },
  { value: "vehicle_breakdown",   label: "Vehicle Breakdown" },
  { value: "water_logging",       label: "Water Logging" },
  { value: "road_work",           label: "Road Work / Construction" },
  { value: "procession",          label: "Procession / March" },
  { value: "vip_movement",        label: "VIP Movement" },
  { value: "sports_event",        label: "Sports Event" },
  { value: "fire",                label: "Fire" },
  { value: "other",               label: "Other" },
]

export const EVENT_TYPES = [
  { value: "planned",   label: "Planned" },
  { value: "unplanned", label: "Unplanned" },
]

export const VEH_TYPES = [
  { value: "",        label: "Not applicable" },
  { value: "private", label: "Private Car" },
  { value: "bus",     label: "Bus" },
  { value: "heavy",   label: "Heavy / Truck / LCV" },
  { value: "auto",    label: "Auto Rickshaw" },
  { value: "other",   label: "Other" },
]
