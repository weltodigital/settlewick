import { Suspense } from 'react'
import AgentSignUpClient from './AgentSignUpClient'

function AgentSignUpFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  )
}

export default function AgentSignUpPage() {
  return (
    <Suspense fallback={<AgentSignUpFallback />}>
      <AgentSignUpClient />
    </Suspense>
  )
}