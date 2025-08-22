import React, { useRef, useEffect, useState } from 'react'
interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}
interface RegionSelectorProps {
  imageSrc: string
  onRegionsChange: (regions: Rectangle[]) => void
  regions: Rectangle[]
}
export default function RegionSelector({ imageSrc, onRegionsChange, regions }: RegionSelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(new Image())
  useEffect(() => {
    const img = imgRef.current
    img.onload = () => {
      setImageLoaded(true)
      drawCanvas()
    }
    img.src = imageSrc
  }, [imageSrc])
  useEffect(() => {
    if (imageLoaded) {
      drawCanvas()
    }
  }, [regions, imageLoaded])
  const drawCanvas = () => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Set canvas size to match image
    canvas.width = img.width
    canvas.height = img.height
    // Draw image
    ctx.drawImage(img, 0, 0)
    // Draw ignore regions
    regions.forEach((rect) => {
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 2
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    })
  }
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)
    setStartPos(pos)
    setIsDrawing(true)
  }
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const pos = getMousePos(e)
    const newRect: Rectangle = {
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: Math.abs(pos.x - startPos.x),
      height: Math.abs(pos.y - startPos.y)
    }
    if (newRect.width > 5 && newRect.height > 5) {
      onRegionsChange([...regions, newRect])
    }
    setIsDrawing(false)
  }
  const clearRegions = () => {
    onRegionsChange([])
  }
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Ignore Regions: {regions.length}
        </span>
        <button
          onClick={clearRegions}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          maxWidth: '100%',
          maxHeight: '300px',
          cursor: isDrawing ? 'crosshair' : 'pointer',
          border: '1px solid #ddd'
        }}
      />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        Click and drag to draw ignore regions (shown in red)
      </p>
    </div>
  )
}
