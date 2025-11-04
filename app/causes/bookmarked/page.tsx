'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { CAUSE_CATEGORIES } from '@/constants'
import { Cause } from '@/types'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'

// Mock data - same as in main causes page
const mockCauses: Cause[] = [
  {
    id: '1',
    title: 'Help Build a School in Rural Ghana',
    description: 'We are raising funds to build a primary school in a rural community in Ghana to provide quality education to over 200 children.',
    short_description: 'Building a primary school for 200 children in rural Ghana',
    goal_amount: 50000,
    current_amount: 32500,
    currency: 'USD',
    category: 'education',
    status: 'live',
    featured_image: '/api/placeholder/400/300',
    gallery_images: [],
    organizer: {
      id: '1',
      email: 'organizer@example.com',
      first_name: 'John',
      last_name: 'Doe',
      location: 'Accra, Ghana',
      phone: '+233123456789',
      occupation: 'Teacher',
      is_verified: true,
      is_active: true,
      date_joined: '2024-01-01',
      last_login: '2024-01-15',
      role: 'organizer',
      profile_visibility: {
        show_full_name: true,
        show_location: true,
        show_phone: false,
        show_occupation: true
      }
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
    end_date: '2024-06-01',
    tags: ['education', 'ghana', 'school', 'children'],
    location: 'Upper East Region, Ghana',
    is_featured: true,
    donation_count: 127,
    progress_percentage: calculateProgress(32500, 50000)
  },
  {
    id: '3',
    title: 'Medical Equipment for Community Hospital',
    description: 'Raising funds to purchase essential medical equipment for our community hospital to better serve patients.',
    short_description: 'Essential medical equipment for community hospital',
    goal_amount: 75000,
    current_amount: 45000,
    currency: 'USD',
    category: 'healthcare',
    status: 'live',
    featured_image: '/api/placeholder/400/300',
    gallery_images: [],
    organizer: {
      id: '3',
      email: 'medical@example.com',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      location: 'Nairobi, Kenya',
      phone: '+254123456789',
      occupation: 'Doctor',
      is_verified: true,
      is_active: true,
      date_joined: '2024-01-01',
      last_login: '2024-01-15',
      role: 'organizer',
      profile_visibility: {
        show_full_name: true,
        show_location: true,
        show_phone: false,
        show_occupation: true
      }
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
    end_date: '2024-05-01',
    tags: ['healthcare', 'medical', 'hospital', 'equipment'],
    location: 'Nairobi, Kenya',
    is_featured: false,
    donation_count: 156,
    progress_percentage: calculateProgress(45000, 75000)
  }
]

export default function BookmarkedCausesPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  
  const [bookmarkedCauses, setBookmarkedCauses] = useState<Cause[]>([])
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [loadingCauses, setLoadingCauses] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/causes/bookmarked')
    }
  }, [isAuthenticated, isLoading, router])

  // Load bookmarked causes
  useEffect(() => {
    if (user) {
      const loadBookmarkedCauses = async () => {
        setLoadingCauses(true)
        try {
          // Get bookmarked IDs from localStorage
          const saved = localStorage.getItem('bookmarked_causes')
          const bookmarkedIds = saved ? JSON.parse(saved) : []
          setBookmarkedIds(bookmarkedIds)
          
          // In a real app, you would fetch the causes from your API
          // For now, filter from mock data
          const bookmarked = mockCauses.filter(cause => bookmarkedIds.includes(cause.id))
          setBookmarkedCauses(bookmarked)
        } catch (error) {
          console.error('Failed to load bookmarked causes:', error)
        } finally {
          setLoadingCauses(false)
        }
      }
      
      loadBookmarkedCauses()
    }
  }, [user])

  const handleRemoveBookmark = (causeId: string) => {
    const newBookmarks = bookmarkedIds.filter(id => id !== causeId)
    setBookmarkedIds(newBookmarks)
    setBookmarkedCauses(prev => prev.filter(cause => cause.id !== causeId))
    localStorage.setItem('bookmarked_causes', JSON.stringify(newBookmarks))
  }

  const handleClearAllBookmarks = () => {
    setBookmarkedIds([])
    setBookmarkedCauses([])
    localStorage.removeItem('bookmarked_causes')
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Mobile-First Layout */}
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Bookmarked Causes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Causes you've saved for later donation
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 md:space-x-3 md:flex-shrink-0">
              <Link href="/causes" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full text-xs sm:text-sm md:text-base px-3 py-2">
                  Browse More
                </Button>
              </Link>
              {bookmarkedCauses.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearAllBookmarks}
                  className="flex-1 sm:flex-none text-xs sm:text-sm md:text-base px-3 py-2 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loadingCauses && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Bookmarked Causes */}
        {!loadingCauses && (
          <>
            {bookmarkedCauses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {bookmarkedCauses.map(cause => {
                  const category = CAUSE_CATEGORIES.find(cat => cat.id === cause.category)
                  
                  return (
                    <Card key={cause.id} variant="elevated" className="overflow-hidden hover:shadow-lg transition-shadow border-0">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                          <span className="bg-green-500 px-2 py-1 rounded text-xs sm:text-sm font-medium text-white">
                            {category?.name}
                          </span>
                        </div>
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                          <button
                            onClick={() => handleRemoveBookmark(cause.id)}
                            className="p-1.5 sm:p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Remove bookmark"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                          <p className="text-xs sm:text-sm opacity-90">{cause.location}</p>
                        </div>
                      </div>
                      
                      <CardHeader className="p-3 sm:p-4">
                        <CardTitle className="line-clamp-2 text-sm sm:text-base">{cause.title}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2">
                          {cause.short_description}
                        </p>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <span>by {cause.organizer.first_name} {cause.organizer.last_name}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-3 sm:p-4">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg sm:text-2xl font-bold text-green-500">
                              {formatCurrency(cause.current_amount, cause.currency as 'USD' | 'GHS')}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              of {formatCurrency(cause.goal_amount, cause.currency as 'USD' | 'GHS')}
                            </span>
                          </div>
                          
                          <Progress value={cause.progress_percentage} showLabel />
                          
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <span>{cause.donation_count} donations</span>
                            <span>
                              {cause.end_date && `Ends ${new Date(cause.end_date).toLocaleDateString()}`}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link href={`/causes/${cause.id}`} className="flex-1">
                              <Button className="w-full text-sm">
                                View Details
                              </Button>
                            </Link>
                            <Link href={`/causes/${cause.id}/donate`} className="sm:flex-shrink-0">
                              <Button variant="outline" className="w-full sm:w-auto text-sm">
                                Donate Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12 px-4">
                <div className="text-4xl md:text-6xl mb-4">🔖</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No bookmarked causes yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base max-w-md mx-auto">
                  Start exploring causes and bookmark the ones you want to support later.
                </p>
                <Link href="/causes">
                  <Button className="w-full sm:w-auto">
                    Browse Causes
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Quick Stats */}
        {!loadingCauses && bookmarkedCauses.length > 0 && (
          <div className="mt-8 md:mt-12 bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Bookmarked Causes Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-500 mb-1">
                  {bookmarkedCauses.length}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Total Bookmarked
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-500 mb-1">
                  {formatCurrency(bookmarkedCauses.reduce((sum, cause) => sum + cause.goal_amount, 0))}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Combined Goal
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-500 mb-1">
                  {formatCurrency(bookmarkedCauses.reduce((sum, cause) => sum + cause.current_amount, 0))}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Total Raised
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-500 mb-1">
                  {bookmarkedCauses.reduce((sum, cause) => sum + cause.donation_count, 0)}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Total Donors
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
