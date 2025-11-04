'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface Testimonial {
  id: string
  author_name: string
  author_location: string
  author_avatar?: string
  content: string
  rating: number
  cause_title?: string
  cause_category?: string
  created_at: string
  is_verified: boolean
}

// Mock testimonials data
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    author_name: 'Sarah Johnson',
    author_location: 'Lagos, Nigeria',
    content: 'CauseHive has transformed how I give back to my community. The transparency and ease of use make it simple to support causes I care about. I\'ve donated to 5 different causes so far and seen real impact reports.',
    rating: 5,
    cause_title: 'Clean Water Initiative',
    cause_category: 'environment',
    created_at: '2024-01-20T10:30:00Z',
    is_verified: true
  },
  {
    id: '2',
    author_name: 'Michael Asante',
    author_location: 'Accra, Ghana',
    content: 'As a teacher, I\'m passionate about education. Through CauseHive, I was able to help build a school in my rural hometown. The mobile money integration made it so convenient to donate directly from my phone.',
    rating: 5,
    cause_title: 'Build Schools in Rural Areas',
    cause_category: 'education',
    created_at: '2024-01-18T14:20:00Z',
    is_verified: true
  },
  {
    id: '3',
    author_name: 'Dr. Aisha Okafor',
    author_location: 'Abuja, Nigeria',
    content: 'The medical equipment we funded through CauseHive has already saved lives in our community hospital. The platform\'s donation tracking feature lets us see exactly how our contributions are being used.',
    rating: 5,
    cause_title: 'Medical Equipment for Rural Hospitals',
    cause_category: 'healthcare',
    created_at: '2024-01-15T09:45:00Z',
    is_verified: true
  },
  {
    id: '4',
    author_name: 'James Osei',
    author_location: 'Kumasi, Ghana',
    content: 'I love how easy it is to support multiple causes at once with the donation cart feature. The platform is user-friendly and the cause verification process gives me confidence that my money is going to legitimate projects.',
    rating: 4,
    created_at: '2024-01-12T16:00:00Z',
    is_verified: false
  },
  {
    id: '5',
    author_name: 'Grace Adebayo',
    author_location: 'Ibadan, Nigeria',
    content: 'CauseHive helped me organize a successful fundraiser for flood victims in my area. The platform provided all the tools I needed to manage donations and keep supporters updated on our progress.',
    rating: 5,
    cause_title: 'Flood Relief Support',
    cause_category: 'disaster',
    created_at: '2024-01-10T11:15:00Z',
    is_verified: true
  },
  {
    id: '6',
    author_name: 'Emmanuel Mensah',
    author_location: 'Cape Coast, Ghana',
    content: 'The anonymous donation feature is great for those who prefer to give privately. I\'ve been supporting various causes without any pressure or follow-up requests. Perfect for quiet giving.',
    rating: 4,
    created_at: '2024-01-08T13:30:00Z',
    is_verified: false
  }
]

export default function TestimonialsPage() {
  const { user, logout } = useAuth()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state for new testimonial
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
    cause_title: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Load testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600))
        setTestimonials(mockTestimonials)
      } catch (error) {
        console.error('Failed to load testimonials:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTestimonials()
  }, [])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.content.trim()) {
      newErrors.content = 'Please share your experience'
    } else if (formData.content.length < 50) {
      newErrors.content = 'Please provide at least 50 characters'
    } else if (formData.content.length > 1000) {
      newErrors.content = 'Testimonial must be less than 1000 characters'
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would submit to your API
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        author_name: user ? `${user.first_name} ${user.last_name}` : 'Anonymous',
        author_location: user?.location || 'Unknown',
        content: formData.content,
        rating: formData.rating,
        cause_title: formData.cause_title || undefined,
        created_at: new Date().toISOString(),
        is_verified: false
      }
      
      setTestimonials(prev => [newTestimonial, ...prev])
      setSuccessMessage('Thank you for your testimonial! It will be reviewed before being published.')
      
      // Reset form
      setFormData({
        content: '',
        rating: 5,
        cause_title: ''
      })
      setShowSubmitForm(false)
      
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to submit testimonial' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {rating}/5
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Community Testimonials
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Read inspiring stories from our community members about how CauseHive has helped them make a difference in the world.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Testimonial Section */}
        <div className="text-center mb-12">
          {user ? (
            <Button
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="mb-6"
            >
              {showSubmitForm ? 'Cancel' : 'Share Your Experience'}
            </Button>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Share Your Story
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Have you used CauseHive to support a cause? We'd love to hear about your experience!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/login?redirect=/testimonials">
                  <Button>Sign In to Share</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline">Create Account</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Testimonial Submission Form */}
          {showSubmitForm && user && (
            <Card className="max-w-2xl mx-auto mb-8">
              <CardHeader>
                <CardTitle>Share Your Testimonial</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTestimonial} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Experience *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Tell us about your experience with CauseHive. How has it helped you support causes you care about?"
                      disabled={isSubmitting}
                      maxLength={1000}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.content}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.content.length}/1000 characters (minimum 50)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleInputChange('rating', star)}
                          className="focus:outline-none"
                          disabled={isSubmitting}
                        >
                          <svg
                            className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.rating}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Related Cause (Optional)
                    </label>
                    <Input
                      value={formData.cause_title}
                      onChange={(value) => handleInputChange('cause_title', value)}
                      placeholder="Name of the cause you supported"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSubmitForm(false)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Submit Testimonial
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.author_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.author_name}
                        </h3>
                        {testimonial.is_verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.author_location}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>

                  {testimonial.cause_title && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                      Related to: {testimonial.cause_title}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-green-50 dark:bg-green-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make Your Impact?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join thousands of people who are already making a difference through CauseHive. 
            Start supporting causes that matter to you today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/causes">
              <Button size="lg">
                Browse Causes
              </Button>
            </Link>
            {!user && (
              <Link href="/auth/signup">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
