'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDonationCart } from '@/contexts/DonationCartContext'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { CAUSE_CATEGORIES } from '@/constants'
import { Cause } from '@/types'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'

// Mock data - same as in causes page
const mockCauses: Cause[] = [
  {
    id: '1',
    title: 'Help Build a School in Rural Ghana',
    description: 'We are raising funds to build a primary school in a rural community in Ghana to provide quality education to over 200 children who currently have no access to proper educational facilities. The school will include 6 classrooms, a library, computer lab, and proper sanitation facilities. Our team has identified the perfect location and secured all necessary permits. The local community is fully committed to this project and will provide volunteer labor. Your donation will help us purchase building materials, hire skilled workers, and ensure the school meets international education standards.',
    short_description: 'Building a primary school for 200 children in rural Ghana',
    goal_amount: 50000,
    current_amount: 32500,
    currency: 'USD',
    category: 'education',
    status: 'live',
    featured_image: '/api/placeholder/400/300',
    gallery_images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
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
    end_date: '2024-12-31',
    location: 'Cape Town, South Africa',
    is_featured: true,
    donation_count: 42,
    progress_percentage: 65,
    tags: ['education', 'children', 'school', 'ghana']
  },
  {
    id: '2',
    title: 'Animal Shelter Renovation',
    description: 'Our local animal shelter urgently needs renovation to provide better care for rescued pets. The current facilities are outdated and insufficient for the growing number of animals we rescue. We need to expand kennels, upgrade medical facilities, and create a proper quarantine area. This renovation will allow us to save more lives and provide better living conditions for animals waiting for their forever homes.',
    short_description: 'Renovating animal shelter for rescued pets',
    goal_amount: 20000,
    current_amount: 8500,
    currency: 'USD',
    category: 'animals',
    status: 'live',
    featured_image: '/api/placeholder/400/300',
    gallery_images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    organizer: {
      id: '2',
      email: 'lisa@animalcare.org',
      first_name: 'Lisa',
      last_name: 'Williams',
      location: 'Cape Town, South Africa',
      phone: '+27123456789',
      occupation: 'Veterinarian',
      is_verified: true,
      is_active: true,
      date_joined: '2024-01-05',
      last_login: '2024-01-16',
      role: 'organizer',
      profile_visibility: {
        show_full_name: true,
        show_location: true,
        show_phone: false,
        show_occupation: true
      }
    },
    created_at: '2024-01-05',
    updated_at: '2024-01-16',
    end_date: '2024-06-30',
    location: 'Cape Town, South Africa',
    is_featured: false,
    donation_count: 67,
    progress_percentage: 43,
    tags: ['animals', 'shelter', 'rescue', 'pets']
  }
]

export default function CauseDetailPage() {
  const { user, logout } = useAuth()
  const { addItem, isInCart } = useDonationCart()
  const params = useParams()
  const router = useRouter()
  const [cause, setCause] = useState<Cause | null>(null)
  const [loading, setLoading] = useState(true)
  const [donationAmount, setDonationAmount] = useState(25)
  const [showDonationModal, setShowDonationModal] = useState(false)

  const causeId = params.id as string

  useEffect(() => {
    // Simulate API call
    const loadCause = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundCause = mockCauses.find(c => c.id === causeId)
      setCause(foundCause || null)
      setLoading(false)
    }

    if (causeId) {
      loadCause()
    }
  }, [causeId])

  const handleAddToCart = () => {
    if (!cause) return
    
    addItem(cause, donationAmount, 'USD', false, '')
    setShowDonationModal(false)
    // Show success message or redirect
  }

  const handleQuickDonate = () => {
    setShowDonationModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!cause) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header user={user} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cause Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The cause you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/causes">
              <Button>Browse All Causes</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const category = CAUSE_CATEGORIES.find(cat => cat.id === cause.category)
  const inCart = isInCart(cause.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/causes" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Causes
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg">
                  {category?.name}
                </span>
              </div>

              {/* Featured Badge */}
              {cause.is_featured && (
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ FEATURED
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center space-x-2 text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium backdrop-blur-sm bg-black/20 px-2 py-1 rounded-full">
                    {cause.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Title and Organizer */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {cause.title}
              </h1>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {cause.organizer.first_name[0]}{cause.organizer.last_name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {cause.organizer.first_name} {cause.organizer.last_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cause.organizer.occupation} • {cause.organizer.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About This Cause
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {cause.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {cause.tags && cause.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {cause.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Donation Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(cause.current_amount, cause.currency as 'USD' | 'GHS')}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        raised of {formatCurrency(cause.goal_amount, cause.currency as 'USD' | 'GHS')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {Math.round(cause.progress_percentage)}%
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">funded</p>
                    </div>
                  </div>
                  
                  <Progress value={cause.progress_percentage} className="mb-4" />
                  
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{cause.donation_count} supporters</span>
                    </div>
                    {cause.end_date && (
                      <span>Ends {new Date(cause.end_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {inCart ? (
                    <Link href="/donations/cart" className="block">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        In Cart - Go to Checkout
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      onClick={handleQuickDonate}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      Support This Cause
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    Share This Cause
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Organizer
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {cause.organizer.first_name[0]}{cause.organizer.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {cause.organizer.first_name} {cause.organizer.last_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cause.organizer.occupation}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cause.organizer.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Support This Cause
              </h3>
              <button
                onClick={() => setShowDonationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Donation Amount (USD)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                min="1"
                max="10000"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDonationModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
