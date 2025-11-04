'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { CAUSE_CATEGORIES } from '@/constants'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { isValidEmail } from '@/lib/utils'
import Image from 'next/image'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy'>('profile')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Profile form data
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '', 
    location: '',
    occupation: '',
    bio: '',
    website: ''
  })

  // Donation preferences
  const [donationPreferences, setDonationPreferences] = useState<string[]>([])

  // Profile visibility settings
  const [visibilitySettings, setVisibilitySettings] = useState({
    show_full_name: true,
    show_location: true,
    show_phone: false,
    show_occupation: true
  })

  // Profile picture state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile')
    }
  }, [isAuthenticated, isLoading, router])

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        occupation: user.occupation,
        bio: user.bio || '',
        website: user.website || ''
      })
      setDonationPreferences(user.donation_preferences || [])
      setVisibilitySettings(user.profile_visibility)
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors({ profilePicture: 'Please select an image file' })
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ profilePicture: 'File size must be less than 5MB' })
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      setErrors({ profilePicture: '' })
    }
  }

  const handlePreferenceToggle = (categoryId: string) => {
    setDonationPreferences(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleVisibilityToggle = (field: keyof typeof visibilitySettings) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateProfile = () => {
    const newErrors: { [key: string]: string } = {}

    if (!profileData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!profileData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (!profileData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-()]+$/.test(profileData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!profileData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!profileData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required'
    }

    if (profileData.website && !/^https?:\/\/.+/.test(profileData.website)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!validateProfile()) return

    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')

    try {
      // Here you would make API calls to update the profile
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      await refreshUser() // Refresh user data
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to update profile' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Here you would upload the file to your backend
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage('Profile picture updated successfully!')
      setSelectedFile(null)
      setPreviewUrl(null)
      await refreshUser() // Refresh user data
    } catch (error: any) {
      setErrors({ profilePicture: error.message || 'Failed to upload profile picture' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      // Here you would make API calls to update preferences and visibility
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage('Preferences updated successfully!')
      await refreshUser()
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to update preferences' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Donation Preferences
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'privacy'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Privacy Settings
            </button>
          </nav>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Profile preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : user.profile_picture ? (
                        <Image
                          src={user.profile_picture}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                          {user.first_name[0]}{user.last_name[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Choose Photo
                    </label>
                    {selectedFile && (
                      <Button
                        onClick={handleUploadProfilePicture}
                        loading={isSubmitting}
                        className="ml-3"
                      >
                        Upload
                      </Button>
                    )}
                    {errors.profilePicture && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.profilePicture}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      JPG, PNG or WebP. Max size 5MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Basic Information</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSubmitting}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.first_name}
                        onChange={(value) => handleInputChange('first_name', value)}
                        error={errors.first_name}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name  
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.last_name}
                        onChange={(value) => handleInputChange('last_name', value)}
                        error={errors.last_name}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(value) => handleInputChange('email', value)}
                        error={errors.email}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(value) => handleInputChange('phone', value)}
                        error={errors.phone}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(value) => handleInputChange('location', value)}
                        error={errors.location}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Occupation
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.occupation}
                        onChange={(value) => handleInputChange('occupation', value)}
                        error={errors.occupation}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.occupation}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Tell us about yourself..."
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.bio || 'No bio provided'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.website}
                        onChange={(value) => handleInputChange('website', value)}
                        error={errors.website}
                        placeholder="https://your-website.com"
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.website ? (
                          <a 
                            href={profileData.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 dark:text-green-400 hover:underline"
                          >
                            {profileData.website}
                          </a>
                        ) : (
                          'No website provided'
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      loading={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Donation Preferences Tab */}
        {activeTab === 'preferences' && (
          <Card>
            <CardHeader>
              <CardTitle>Donation Preferences</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Select the cause categories you're most interested in supporting
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAUSE_CATEGORIES.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`pref-${category.id}`}
                      checked={donationPreferences.includes(category.id)}
                      onChange={() => handlePreferenceToggle(category.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`pref-${category.id}`} className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={handleSavePreferences} loading={isSubmitting}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy Settings Tab */}
        {activeTab === 'privacy' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Control what information is visible to other users
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Show Full Name</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display your first and last name on your public profile
                    </p>
                  </div>
                  <button
                    onClick={() => handleVisibilityToggle('show_full_name')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      visibilitySettings.show_full_name ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        visibilitySettings.show_full_name ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Show Location</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display your location on your public profile
                    </p>
                  </div>
                  <button
                    onClick={() => handleVisibilityToggle('show_location')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      visibilitySettings.show_location ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        visibilitySettings.show_location ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Show Phone Number</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display your phone number on your public profile
                    </p>
                  </div>
                  <button
                    onClick={() => handleVisibilityToggle('show_phone')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      visibilitySettings.show_phone ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        visibilitySettings.show_phone ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Show Occupation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display your occupation on your public profile
                    </p>
                  </div>
                  <button
                    onClick={() => handleVisibilityToggle('show_occupation')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      visibilitySettings.show_occupation ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        visibilitySettings.show_occupation ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleSavePreferences} loading={isSubmitting}>
                  Save Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
