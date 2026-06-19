import { SEVERITY_EMOJI } from "@/lib/severity"

const BADGE_STYLES: Record<string, string> = {
  Low:      "bg-green-500/15 text-green-400 border border-green-500/25",
  Medium:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  High:     "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  Critical: "bg-red-500/15 text-red-400 border border-red-500/25",
}

interface Props {
  label: string
  size?: "sm" | "md" | "lg"
}

export default function SeverityBadge({ label, size = "md" }: Props) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5 gap-1" : size === "lg" ? "text-sm px-3.5 py-1.5 gap-1.5" : "text-sm px-2.5 py-1 gap-1.5"
  return (
    <span className={`inline-flex items-center rounded-lg font-semibold ${BADGE_STYLES[label] ?? "bg-gray-500/15 text-gray-400 border border-gray-500/25"} ${sizeClass}`}>
      {SEVERITY_EMOJI[label]} {label}
    </span>
  )
}
