import { useEffect, useRef } from 'react'

export function InteractiveBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Grid dimensions
    const cols = 50
    const rows = 35
    const spacing = 35 // distance between grid lines
    const damping = 0.98 // wave energy decay rate
    
    // Wave state buffers
    let current = Array(cols).fill(0).map(() => Array(rows).fill(0))
    let previous = Array(cols).fill(0).map(() => Array(rows).fill(0))
    let next = Array(cols).fill(0).map(() => Array(rows).fill(0))

    // Handle canvas resizing
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    // 3D Projection parameters
    const tilt = 0.65 // tilt angle of the grid (radians)
    const perspective = 800
    const scale = 0.35 // amplitude scaling

    // Convert grid coordinates to 2D screen coordinates
    const project = (col, row, z, cx, cy) => {
      // Offset coordinates from grid center
      const x3d = (col - cols / 2) * spacing
      const y3d_base = (row - rows / 2) * spacing

      // Rotate around X-axis for 3D tilt
      const y3d = y3d_base * Math.cos(tilt) - z * scale * Math.sin(tilt)
      const z3d = y3d_base * Math.sin(tilt) + z * scale * Math.cos(tilt)

      // Perspective projection
      const dist = perspective + y3d
      const scaleProj = perspective / dist
      
      const screenX = cx + x3d * scaleProj
      const screenY = cy + z3d * scaleProj

      return { x: screenX, y: screenY }
    }

    // Handle clicks to generate waves
    const handleMouseInteraction = (e) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // Find the grid node closest to the cursor screen position
      let minDist = Infinity
      let targetCol = -1
      let targetRow = -1

      // Search a sub-grid to find close nodes
      for (let c = 1; c < cols - 1; c++) {
        for (let r = 1; r < rows - 1; r++) {
          const pt = project(c, r, current[c][r], cx, cy)
          const dx = clickX - pt.x
          const dy = clickY - pt.y
          const dist = dx * dx + dy * dy

          if (dist < minDist) {
            minDist = dist
            targetCol = c
            targetRow = r
          }
        }
      }

      // If close enough, inject energy
      if (minDist < 6400 && targetCol !== -1) { // 80px radius
        current[targetCol][targetRow] = 200
        
        // Ripple outwards slightly to make it smoother
        const dirs = [
          [-1, 0], [1, 0], [0, -1], [0, 1],
          [-1, -1], [-1, 1], [1, -1], [1, 1]
        ]
        dirs.forEach(([dc, dr]) => {
          const nc = targetCol + dc
          const nr = targetRow + dr
          if (nc > 0 && nc < cols - 1 && nr > 0 && nr < rows - 1) {
            current[nc][nr] = 120
          }
        })
      }
    }

    window.addEventListener('mousedown', handleMouseInteraction)

    const updateWaves = () => {
      for (let c = 1; c < cols - 1; c++) {
        for (let r = 1; r < rows - 1; r++) {
          // Solve 2D wave equation finite differences
          let val = (
            current[c - 1][r] +
            current[c + 1][r] +
            current[c][r - 1] +
            current[c][r + 1]
          ) / 2 - previous[c][r]

          val *= damping
          next[c][r] = val
        }
      }

      // Swap buffers
      let temp = previous
      previous = current
      current = next
      next = temp
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2 - 20 // lift grid up slightly for aesthetics

      updateWaves()

      // Set style for grid lines (very faint slate blue for academic theme)
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.045)'
      ctx.lineWidth = 1

      // Draw grid rows (horizontal-ish lines)
      for (let r = 0; r < rows; r++) {
        ctx.beginPath()
        for (let c = 0; c < cols; c++) {
          const pt = project(c, r, current[c][r], cx, cy)
          if (c === 0) {
            ctx.moveTo(pt.x, pt.y)
          } else {
            ctx.lineTo(pt.x, pt.y)
          }
        }
        ctx.stroke()
      }

      // Draw grid columns (vertical-ish lines)
      for (let c = 0; c < cols; c++) {
        ctx.beginPath()
        for (let r = 0; r < rows; r++) {
          const pt = project(c, r, current[c][r], cx, cy)
          if (r === 0) {
            ctx.moveTo(pt.x, pt.y)
          } else {
            ctx.lineTo(pt.x, pt.y)
          }
        }
        ctx.stroke()
      }

      // Draw active particles/nodes at wave crests for subtle glowing effect
      ctx.fillStyle = 'rgba(37, 99, 235, 0.15)'
      for (let c = 1; c < cols - 1; c += 2) {
        for (let r = 1; r < rows - 1; r += 2) {
          const amp = Math.abs(current[c][r])
          if (amp > 8) {
            const pt = project(c, r, current[c][r], cx, cy)
            ctx.beginPath()
            ctx.arc(pt.x, pt.y, Math.min(2.5, amp * 0.02), 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousedown', handleMouseInteraction)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas id="bg-canvas" ref={canvasRef} />
}
