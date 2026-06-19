"use client"
import { useEffect, useRef } from "react"

export default function RoadGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    // A simplified road grid map
    const roads: { x1: number, y1: number, x2: number, y2: number }[] = []
    
    // Create an arbitrary grid pattern. Over-provision to handle resizing.
    const maxDimension = Math.max(window.screen?.width || 2000, window.screen?.height || 2000, 3000)
    const gridSize = 100
    for(let x=0; x<maxDimension; x+=gridSize) {
      roads.push({ x1: x, y1: 0, x2: x + (Math.random()*40-20), y2: maxDimension })
    }
    for(let y=0; y<maxDimension; y+=gridSize) {
      roads.push({ x1: 0, y1: y, x2: maxDimension, y2: y + (Math.random()*40-20) })
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      // Draw roads
      ctx.lineWidth = 1
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)" // More solid line
      roads.forEach(r => {
        ctx.beginPath()
        ctx.moveTo(r.x1, r.y1)
        ctx.lineTo(r.x2, r.y2)
        ctx.stroke()
      })
    }

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      render()
    }

    window.addEventListener("resize", handleResize)
    render()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  )
}
