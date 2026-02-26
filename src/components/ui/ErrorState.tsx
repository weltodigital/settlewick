import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  type?: 'error' | 'not-found' | 'network'
  onRetry?: () => void
  showHomeButton?: boolean
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  type = 'error',
  onRetry,
  showHomeButton = false
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'not-found':
        return <Home className="w-16 h-16 text-text-muted opacity-50" />
      case 'network':
        return <RefreshCw className="w-16 h-16 text-text-muted opacity-50" />
      default:
        return <AlertCircle className="w-16 h-16 text-error opacity-70" />
    }
  }

  const getDefaultMessage = () => {
    switch (type) {
      case 'not-found':
        return 'The content you are looking for does not exist or has been moved.'
      case 'network':
        return 'Unable to connect to our servers. Please check your internet connection.'
      default:
        return message
    }
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-8 md:p-12 text-center">
      <div className="max-w-md mx-auto">
        {getIcon()}

        <h3 className="text-xl font-semibold text-text-primary mt-4 mb-2">
          {title}
        </h3>

        <p className="text-text-secondary mb-6 leading-relaxed">
          {getDefaultMessage()}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={() => window.location.href = '/'}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  )
}