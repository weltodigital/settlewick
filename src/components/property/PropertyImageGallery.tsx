'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Maximize2, Grid, MapPin, Play, Pause, Volume2, VolumeX, Expand, RotateCcw, Eye, Video } from 'lucide-react'
import type { PropertyImage } from '@prisma/client'

interface PropertyImageGalleryProps {
  images: PropertyImage[]
  propertyAddress: string
  virtualTourUrl?: string
  videoTourUrl?: string
}

export default function PropertyImageGallery({
  images,
  propertyAddress,
  virtualTourUrl,
  videoTourUrl
}: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [showFloorplans, setShowFloorplans] = useState(false)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [showVideoTour, setShowVideoTour] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  const regularImages = images.filter(img => !img.isFloorplan)
  const floorplans = images.filter(img => img.isFloorplan)

  const currentImages = showFloorplans ? floorplans : regularImages
  const currentImage = currentImages[selectedImage]

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % currentImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + currentImages.length) % currentImages.length)
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setIsLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setShowVirtualTour(false)
    setShowVideoTour(false)
    document.body.style.overflow = 'unset'
  }

  // Touch/swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchStartX - touchEndX
    const deltaY = touchStartY - touchEndY

    // Only handle horizontal swipes (ignore vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextImage() // Swipe left = next
      } else {
        prevImage() // Swipe right = previous
      }
    }

    setTouchStartX(null)
    setTouchStartY(null)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return

      switch (e.key) {
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
        case 'Escape':
          closeLightbox()
          break
        case ' ':
          e.preventDefault()
          if (showVideoTour) {
            setIsVideoPlaying(!isVideoPlaying)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, showVideoTour, isVideoPlaying])

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-secondary">
          {currentImage ? (
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.caption || propertyAddress}
              fill
              className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => openLightbox(selectedImage)}
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-text-muted">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No images available</p>
              </div>
            </div>
          )}

          {/* Image counter */}
          {currentImages.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
              {selectedImage + 1} / {currentImages.length}
            </div>
          )}

          {/* Navigation arrows */}
          {currentImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Expand button */}
          <button
            onClick={() => openLightbox(selectedImage)}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Room tag */}
          {currentImage?.roomTag && (
            <div className="absolute bottom-4 left-4 bg-accent text-white px-3 py-1 rounded-lg text-sm font-medium">
              {currentImage.roomTag.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
            </div>
          )}
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex bg-secondary rounded-lg p-1 overflow-x-auto">
            <button
              onClick={() => {
                setShowFloorplans(false)
                setSelectedImage(0)
              }}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                !showFloorplans
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Photos ({regularImages.length})
            </button>
            {floorplans.length > 0 && (
              <button
                onClick={() => {
                  setShowFloorplans(true)
                  setSelectedImage(0)
                }}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  showFloorplans
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Floorplan ({floorplans.length})
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto">
            <button
              onClick={() => openLightbox(selectedImage)}
              className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Grid className="w-4 h-4" />
              View Gallery
            </button>

            {virtualTourUrl && (
              <button
                onClick={() => {
                  setShowVirtualTour(true)
                  setIsLightboxOpen(true)
                  document.body.style.overflow = 'hidden'
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors text-sm font-medium whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                Virtual Tour
              </button>
            )}

            {videoTourUrl && (
              <button
                onClick={() => {
                  setShowVideoTour(true)
                  setIsLightboxOpen(true)
                  document.body.style.overflow = 'hidden'
                }}
                className="flex items-center gap-2 text-success hover:text-success-light transition-colors text-sm font-medium whitespace-nowrap"
              >
                <Video className="w-4 h-4" />
                Video Tour
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {currentImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {currentImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-accent'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.caption || `Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Lightbox with Virtual Tour & Video Support */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Enhanced Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20">
            <div className="flex items-center justify-between">
              <div className="text-white">
                {showVirtualTour ? (
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">Virtual Tour</span>
                  </div>
                ) : showVideoTour ? (
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    <span className="font-medium">Video Tour</span>
                  </div>
                ) : (
                  <div className="bg-black/60 px-3 py-1 rounded-lg">
                    {selectedImage + 1} / {currentImages.length}
                  </div>
                )}
              </div>

              <button
                onClick={closeLightbox}
                className="text-white hover:text-gray-300 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Virtual Tour Content */}
          {showVirtualTour && virtualTourUrl && (
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4">
              <iframe
                src={virtualTourUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Virtual Property Tour"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-center text-sm">
                Use mouse to navigate • Scroll to zoom • Click and drag to look around
              </div>
            </div>
          )}

          {/* Video Tour Content */}
          {showVideoTour && videoTourUrl && (
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
              <video
                src={videoTourUrl}
                className="w-full h-full object-contain rounded-lg"
                controls={false}
                muted={isVideoMuted}
                autoPlay={isVideoPlaying}
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              />

              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="hover:text-gray-300 transition-colors"
                    >
                      {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="hover:text-gray-300 transition-colors"
                    >
                      {isVideoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="text-sm text-gray-300">
                    Click to play/pause • Space bar to toggle
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Image Gallery */}
          {!showVirtualTour && !showVideoTour && (
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4">
              {currentImage && (
                <Image
                  src={currentImage.imageUrl}
                  alt={currentImage.caption || propertyAddress}
                  fill
                  className="object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {/* Enhanced Navigation */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 sm:p-4 rounded-full transition-colors touch-manipulation"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 sm:p-4 rounded-full transition-colors touch-manipulation"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Mobile swipe indicator */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/60 px-3 py-1 rounded-full sm:hidden">
                Swipe to navigate
              </div>
            </div>
          )}

          {/* Enhanced Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Image info or tour selector */}
              <div className="text-white">
                {!showVirtualTour && !showVideoTour && currentImage?.caption && (
                  <div className="bg-black/60 px-3 py-2 rounded-lg text-sm">
                    {currentImage.caption}
                  </div>
                )}
              </div>

              {/* Tour Navigation */}
              <div className="flex gap-2">
                {virtualTourUrl && (
                  <button
                    onClick={() => {
                      setShowVirtualTour(true)
                      setShowVideoTour(false)
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showVirtualTour
                        ? 'bg-primary text-white'
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Virtual Tour</span>
                  </button>
                )}
                {videoTourUrl && (
                  <button
                    onClick={() => {
                      setShowVideoTour(true)
                      setShowVirtualTour(false)
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showVideoTour
                        ? 'bg-success text-white'
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Video</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowVirtualTour(false)
                    setShowVideoTour(false)
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showVirtualTour && !showVideoTour
                      ? 'bg-accent text-white'
                      : 'bg-black/60 text-white hover:bg-black/80'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Photos</span>
                </button>
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
          />
        </div>
      )}
    </>
  )
}