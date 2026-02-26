'use client'

import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'

interface ShareButtonProps {
  url: string
  title: string
  className?: string
}

export default function ShareButton({ url, title, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`p-3 rounded-full border border-border bg-surface text-text-muted hover:text-accent hover:border-accent transition-colors ${className}`}
      title={copied ? 'Copied!' : 'Share property'}
    >
      {copied ? (
        <Check className="w-5 h-5" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </button>
  )
}