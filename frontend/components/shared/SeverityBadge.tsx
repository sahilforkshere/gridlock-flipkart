import { SEVERITY_COLORS } from "@/lib/severity"

interface Props {
  label: string
  size?: "sm" | "md" | "lg"
}

export default function SeverityBadge({ label, size = "md" }: Props) {
  const color = SEVERITY_COLORS[label] ?? "#9a9ea5"
  const dotSize = size === "lg" ? "w-2 h-2" : "w-1.5 h-1.5"
  const textSize = size === "sm" ? "text-[11px]" : size === "lg" ? "text-sm" : "text-xs"
  const padding = size === "sm" ? "px-2 py-0.5" : size === "lg" ? "px-3 py-1" : "px-2.5 py-1"

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${textSize} ${padding}`}
      style={{ 
        backgroundColor: `${color}26`, // 15% opacity
        color: color,
        border: `1px solid ${color}33` // 20% opacity border
      }}
    >
      <span 
        className={`${dotSize} rounded-full shrink-0`} 
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}
