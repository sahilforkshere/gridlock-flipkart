"use client"
import { useRef } from "react"

interface Props {
  children: React.ReactNode
  className?: string
  innerClassName?: string
}

export default function GlowBorder({ children, className = "", innerClassName = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty("--gx", `${e.clientX - r.left}px`)
    ref.current.style.setProperty("--gy", `${e.clientY - r.top}px`)
    ref.current.style.setProperty("--go", "1")
  }

  const onLeave = () => {
    ref.current?.style.setProperty("--go", "0")
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative rounded-lg p-px ${className}`}
      style={
        {
          "--gx": "50%",
          "--gy": "50%",
          "--go": "0",
          background: `radial-gradient(
            280px circle at var(--gx) var(--gy),
            rgba(124,58,237,calc(var(--go) * 0.55)),
            rgba(6,182,212,calc(var(--go) * 0.2)),
            #1c1c21 55%
          )`,
          transition: "background 0.1s ease",
        } as React.CSSProperties
      }
    >
      <div className={`rounded-[7px] bg-[#0f0f12] h-full w-full overflow-hidden ${innerClassName}`}>
        {children}
      </div>
    </div>
  )
}
