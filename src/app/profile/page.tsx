'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, MapPin, Bell, Shield, Save } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    emailAlerts: true,
    priceAlerts: true,
    marketUpdates: false,
  })

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()

      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        window.location.href = '/auth/signin'
        return
      }

      setUser(user)

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setProfile(profile)
        setFormData({
          name: profile.name || '',
          email: user.email || '',
          phone: '',
          location: '',
          emailAlerts: true,
          priceAlerts: true,
          marketUpdates: false,
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-secondary mb-6">Please sign in to access your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Profile Settings</h1>
          <p className="text-text-secondary">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-outline text-sm"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true} // Email changes require verification
                      className="input-field pl-10 opacity-60"
                      placeholder="Enter your email"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Contact support to change your email address
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10"
                      placeholder="Enter your location"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Help us show properties in your preferred areas
                  </p>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-accent flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-text-muted" />
                    <div>
                      <h3 className="font-medium text-text-primary">Email Alerts</h3>
                      <p className="text-sm text-text-secondary">Receive email notifications for saved searches</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailAlerts"
                      checked={formData.emailAlerts}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-text-muted" />
                    <div>
                      <h3 className="font-medium text-text-primary">Price Change Alerts</h3>
                      <p className="text-sm text-text-secondary">Get notified when saved properties change price</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="priceAlerts"
                      checked={formData.priceAlerts}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-text-muted" />
                    <div>
                      <h3 className="font-medium text-text-primary">Market Updates</h3>
                      <p className="text-sm text-text-secondary">Weekly market reports and insights</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="marketUpdates"
                      checked={formData.marketUpdates}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Overview */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-text-secondary">Account Active</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-text-secondary">Email Verified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-sm text-text-secondary">Phone Pending</span>
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Account Type</h3>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-medium text-text-primary">Standard User</p>
                  <p className="text-sm text-text-secondary">Access to all basic features</p>
                </div>
              </div>

              {profile?.role === 'user' && (
                <button className="btn-outline w-full text-sm">
                  Upgrade to Agent
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Saved Properties</span>
                  <span className="text-text-primary font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Saved Searches</span>
                  <span className="text-text-primary font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Property Views</span>
                  <span className="text-text-primary font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Member Since</span>
                  <span className="text-text-primary font-medium">Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}