'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Search, User, Heart, LogOut, Settings } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowUserMenu(false)
  }

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">Settlewick</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/for-sale" className="hover:text-accent transition-colors">
              For Sale
            </Link>
            <Link href="/to-rent" className="hover:text-accent transition-colors">
              To Rent
            </Link>
            <Link href="/sold-prices" className="hover:text-accent transition-colors">
              Sold Prices
            </Link>
            <Link href="/area-guides" className="hover:text-accent transition-colors">
              Area Guides
            </Link>
            <Link href="/mortgage-calculator" className="hover:text-accent transition-colors">
              Mortgage
            </Link>
          </nav>

          {/* Desktop Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-accent transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 hover:text-accent transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user?.email}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-text-primary rounded-lg shadow-lg border border-border z-50">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 hover:bg-secondary transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 hover:bg-secondary transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 hover:bg-secondary transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="hover:text-accent transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <Link href="/auth/signup" className="btn-accent text-sm px-4 py-2">
                  Sign Up
                </Link>
              </>
            )}
            <Link href="/agent" className="btn-outline text-sm px-4 py-2">
              For Agents
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-light">
            <div className="flex flex-col space-y-4">
              <Link href="/for-sale" className="hover:text-accent transition-colors">
                For Sale
              </Link>
              <Link href="/to-rent" className="hover:text-accent transition-colors">
                To Rent
              </Link>
              <Link href="/sold-prices" className="hover:text-accent transition-colors">
                Sold Prices
              </Link>
              <Link href="/area-guides" className="hover:text-accent transition-colors">
                Area Guides
              </Link>
              <Link href="/mortgage-calculator" className="hover:text-accent transition-colors">
                Mortgage
              </Link>
              <hr className="border-primary-light" />
              {user ? (
                <>
                  <Link href="/dashboard" className="hover:text-accent transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="hover:text-accent transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left hover:text-accent transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="hover:text-accent transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="hover:text-accent transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
              <Link href="/agent" className="btn-outline text-sm px-4 py-2 self-start">
                For Agents
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}