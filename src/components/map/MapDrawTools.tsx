'use client'

import { useEffect, useState } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import { Polygon as LeafletPolygon, LatLng } from 'leaflet'
import { Polygon } from 'react-leaflet'
import { Trash2, MousePointer } from 'lucide-react'

interface MapDrawToolsProps {
  onAreaDrawn?: (coordinates: Array<[number, number]>) => void
  onAreaCleared?: () => void
  isDrawing?: boolean
  onDrawingStateChange?: (isDrawing: boolean) => void
}

export default function MapDrawTools({
  onAreaDrawn,
  onAreaCleared,
  isDrawing = false,
  onDrawingStateChange
}: MapDrawToolsProps) {
  const [drawnArea, setDrawnArea] = useState<Array<[number, number]>>([])
  const [isActive, setIsActive] = useState(false)
  const map = useMap()

  // Handle map clicks for drawing
  useMapEvents({
    click: (e) => {
      if (isActive) {
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
        setDrawnArea(prev => [...prev, newPoint])
      }
    }
  })

  const startDrawing = () => {
    setIsActive(true)
    setDrawnArea([])
    onDrawingStateChange?.(true)
    map.getContainer().style.cursor = 'crosshair'
  }

  const finishDrawing = () => {
    setIsActive(false)
    onDrawingStateChange?.(false)
    map.getContainer().style.cursor = ''

    if (drawnArea.length >= 3) {
      onAreaDrawn?.(drawnArea)
    }
  }

  const clearArea = () => {
    setDrawnArea([])
    setIsActive(false)
    onDrawingStateChange?.(false)
    map.getContainer().style.cursor = ''
    onAreaCleared?.()
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isActive) {
          finishDrawing()
        } else if (drawnArea.length > 0) {
          clearArea()
        }
      } else if (e.key === 'Enter' && isActive && drawnArea.length >= 3) {
        finishDrawing()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isActive, drawnArea.length])

  return (
    <>
      {/* Draw Tools UI */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {!isActive && drawnArea.length === 0 && (
          <button
            onClick={startDrawing}
            className="bg-surface shadow-lg border border-border rounded-lg p-3 hover:bg-secondary transition-colors group"
            title="Draw search area"
          >
            <svg className="w-5 h-5 text-text-primary group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}

        {isActive && (
          <div className="bg-surface shadow-lg border border-border rounded-lg p-3">
            <div className="text-sm text-text-primary font-medium mb-2">
              Draw Search Area
            </div>
            <div className="text-xs text-text-secondary mb-3">
              Click to add points ({drawnArea.length}/∞)
            </div>
            <div className="flex gap-2">
              <button
                onClick={finishDrawing}
                disabled={drawnArea.length < 3}
                className="px-3 py-1 bg-accent text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-light transition-colors"
              >
                Finish
              </button>
              <button
                onClick={clearArea}
                className="px-3 py-1 bg-secondary text-text-primary rounded text-xs hover:bg-border transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!isActive && drawnArea.length > 0 && (
          <div className="bg-surface shadow-lg border border-border rounded-lg p-3">
            <div className="text-sm text-text-primary font-medium mb-2">
              Custom Search Area
            </div>
            <div className="flex gap-2">
              <button
                onClick={startDrawing}
                className="px-3 py-1 bg-secondary text-text-primary rounded text-xs hover:bg-border transition-colors"
              >
                Redraw
              </button>
              <button
                onClick={clearArea}
                className="px-3 py-1 bg-error text-white rounded text-xs hover:bg-error/90 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions overlay */}
      {isActive && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-surface shadow-lg border border-border rounded-lg px-4 py-2">
            <div className="text-sm text-text-primary text-center">
              Click to add points • <kbd className="bg-secondary px-1 rounded text-xs">Enter</kbd> to finish • <kbd className="bg-secondary px-1 rounded text-xs">Esc</kbd> to cancel
            </div>
          </div>
        </div>
      )}

      {/* Render drawn polygon */}
      {drawnArea.length >= 3 && (
        <Polygon
          positions={drawnArea}
          pathOptions={{
            color: '#B5985A',
            fillColor: '#B5985A',
            fillOpacity: 0.2,
            weight: 2,
            opacity: 0.8
          }}
        />
      )}

      {/* Render partial polygon while drawing */}
      {isActive && drawnArea.length >= 2 && (
        <Polygon
          positions={drawnArea}
          pathOptions={{
            color: '#B5985A',
            fillColor: '#B5985A',
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.6,
            dashArray: '5,5'
          }}
        />
      )}
    </>
  )
}