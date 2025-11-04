'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { CAUSE_CATEGORIES, CURRENCY } from '@/constants'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Image from 'next/image'

interface CauseFormData {
  title: string
  short_description: string
  description: string
  category: string
  goal_amount: string
  currency: 'USD' | 'GHS'
  location: string
  end_date: string
  tags: string
  featured_image: File | null
  gallery_images: File[]
}

export default function CreateCausePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState<CauseFormData>({
    title: '',
    short_description: '',
    description: '',
    category: '',
    goal_amount: '',
    currency: 'USD',
    location: '',
    end_date: '',
    tags: '',
    featured_image: null,
    gallery_images: []
  })
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/causes/create')
    }
  }, [isAuthenticated, isLoading, router])

  const handleInputChange = (field: keyof CauseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'featured' | 'gallery') => {
    const files = event.target.files
    if (!files) return

    if (type === 'featured') {
      const file = files[0]
      if (file) {
        // Validate file
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, featured_image: 'Please select an image file' }))
          return
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setErrors(prev => ({ ...prev, featured_image: 'File size must be less than 5MB' }))
          return
        }

        setFormData(prev => ({ ...prev, featured_image: file }))
        
        // Create preview
        const reader = new FileReader()
        reader.onload = () => {
          setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)
        
        setErrors(prev => ({ ...prev, featured_image: '' }))
      }
    } else {
      // Handle gallery images (simplified for demo)
      const fileArray = Array.from(files).slice(0, 5) // Max 5 images
      setFormData(prev => ({ ...prev, gallery_images: fileArray }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }

    if (!formData.short_description.trim()) {
      newErrors.short_description = 'Short description is required'
    } else if (formData.short_description.length > 300) {
      newErrors.short_description = 'Short description must be less than 300 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Description must be less than 5000 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.goal_amount) {
      newErrors.goal_amount = 'Goal amount is required'
    } else {
      const amount = parseFloat(formData.goal_amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.goal_amount = 'Please enter a valid amount'
      } else if (amount > 1000000) {
        newErrors.goal_amount = 'Goal amount cannot exceed $1,000,000'
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.end_date) {
      const endDate = new Date(formData.end_date)
      const today = new Date()
      if (endDate <= today) {
        newErrors.end_date = 'End date must be in the future'
      }
    }

    if (!formData.featured_image) {
      newErrors.featured_image = 'Featured image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would upload the images and create the cause
      console.log('Creating cause:', {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        organizer_id: user?.id
      })
      
      setSuccessMessage('Cause created successfully! It will be reviewed before going live.')
      
      // Reset form
      setFormData({
        title: '',
        short_description: '',
        description: '',
        category: '',
        goal_amount: '',
        currency: 'USD',
        location: '',
        end_date: '',
        tags: '',
        featured_image: null,
        gallery_images: []
      })
      setPreviewImage(null)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
      
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to create cause' })
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Start a New Cause
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a fundraising campaign to make a difference in your community
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cause Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(value) => handleInputChange('title', value)}
                  placeholder="Enter a compelling title for your cause"
                  error={errors.title}
                  disabled={isSubmitting}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Brief summary that will appear in cause listings"
                  disabled={isSubmitting}
                  maxLength={300}
                />
                {errors.short_description && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.short_description}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.short_description.length}/300 characters
                </p>
              </div>

              {/* Category and Goal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {CAUSE_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fundraising Goal *
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        type="number"
                        value={formData.goal_amount}
                        onChange={(value) => handleInputChange('goal_amount', value)}
                        placeholder="10000"
                        error={errors.goal_amount}
                        disabled={isSubmitting}
                        min="1"
                        max="1000000"
                        step="0.01"
                        className="pr-12"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {formData.currency === 'USD' ? '$' : '₵'}
                      </div>
                    </div>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value as 'USD' | 'GHS')}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                      disabled={isSubmitting}
                    >
                      <option value="USD">USD</option>
                      <option value="GHS">GHS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(value) => handleInputChange('location', value)}
                    placeholder="City, Country"
                    error={errors.location}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(value) => handleInputChange('end_date', value)}
                    error={errors.end_date}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Description */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Tell the full story of your cause. What problem are you solving? How will donations be used? What impact will it make?"
                  disabled={isSubmitting}
                  maxLength={5000}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/5000 characters
                </p>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (Optional)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(value) => handleInputChange('tags', value)}
                  placeholder="education, children, community (separate with commas)"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add relevant tags to help people find your cause
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null)
                          setFormData(prev => ({ ...prev, featured_image: null }))
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-4">
                        <label htmlFor="featured-image" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Upload featured image
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            PNG, JPG, WebP up to 5MB
                          </span>
                        </label>
                        <input
                          id="featured-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'featured')}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {errors.featured_image && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.featured_image}</p>
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Images (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, 'gallery')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Upload up to 5 additional images to showcase your cause
                </p>
                {formData.gallery_images.length > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    {formData.gallery_images.length} image(s) selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Cause...' : 'Create Cause'}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
