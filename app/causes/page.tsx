'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDonationCart } from '@/contexts/DonationCartContext'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { CAUSE_CATEGORIES, CAUSE_STATUS_LABELS } from '@/constants'
import { Cause, SearchFilters } from '@/types'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import Image from 'next/image'

// Mock data - in a real app, this would come from your API
const mockCauses: Cause[] = [
  {
    id: '1',
    title: 'Help Build a School in Rural Ghana',
    description: 'We are raising funds to build a primary school in a rural community in Ghana to provide quality education to over 200 children who currently have no access to proper educational facilities.',
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
    id: '2',
    title: 'Emergency Relief for Flood Victims',
    description: 'Providing immediate relief including food, clean water, and shelter to families affected by recent flooding in coastal communities.',
    short_description: 'Emergency relief for flood-affected families',
    goal_amount: 25000,
    current_amount: 18750,
    currency: 'USD',
    category: 'disaster',
    status: 'live',
    featured_image: '/api/placeholder/400/300',
    gallery_images: [],
    organizer: {
      id: '2',
      email: 'relief@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      location: 'Lagos, Nigeria',
      phone: '+234123456789',
      occupation: 'NGO Worker',
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
    end_date: '2024-03-01',
    tags: ['disaster', 'relief', 'flood', 'emergency'],
    location: 'Lagos State, Nigeria',
    is_featured: true,
    donation_count: 89,
    progress_percentage: calculateProgress(18750, 25000)
  },
  {
    id: '3',
    title: 'Medical Equipment for Community Hospital',
    description: 'Raising funds to purchase essential medical equipment including X-ray machines, ventilators, and patient monitors for our community hospital to better serve patients.',
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
  },
  {
    id: '4',
    title: 'Clean Water Wells for Rural Communities',
    description: 'Installing clean water wells and water purification systems in remote villages to provide safe drinking water for over 1000 people.',
    short_description: 'Clean water access for rural communities',
    goal_amount: 35000,
    current_amount: 21000,
    currency: 'USD',
    category: 'environment',
    status: 'live',
    featured_image: '/api/placeholder/400/300',
    gallery_images: [],
    organizer: {
      id: '4',
      email: 'water@example.com',
      first_name: 'Michael',
      last_name: 'Brown',
      location: 'Kampala, Uganda',
      phone: '+256123456789',
      occupation: 'Environmental Engineer',
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
    end_date: '2024-04-01',
    tags: ['environment', 'water', 'rural', 'community'],
    location: 'Northern Uganda',
    is_featured: false,
    donation_count: 78,
    progress_percentage: calculateProgress(21000, 35000)
  },
  {
    id: '5',
    title: 'Animal Shelter Renovation',
    description: 'Renovating and expanding our animal shelter to accommodate more rescued animals and provide better living conditions.',
    short_description: 'Renovating animal shelter for rescued pets',
    goal_amount: 20000,
    current_amount: 8500,
    currency: 'USD',
    category: 'animals',
    status: 'live',
    featured_image: '/api/placeholder/400/300',
    gallery_images: [],
    organizer: {
      id: '5',
      email: 'shelter@example.com',
      first_name: 'Lisa',
      last_name: 'Williams',
      location: 'Cape Town, South Africa',
      phone: '+27123456789',
      occupation: 'Veterinarian',
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
    end_date: '2024-07-01',
    tags: ['animals', 'shelter', 'rescue', 'pets'],
    location: 'Cape Town, South Africa',
    is_featured: false,
    donation_count: 42,
    progress_percentage: calculateProgress(8500, 20000)
  }
]

export default function CausesPage() {
  const { user, logout } = useAuth()
  const { addItem, isInCart, itemCount } = useDonationCart()
  const searchParams = useSearchParams()
  
  // State for causes and filtering
  const [causes, setCauses] = useState<Cause[]>([])
  const [filteredCauses, setFilteredCauses] = useState<Cause[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookmarkedCauses, setBookmarkedCauses] = useState<string[]>([])
  const [showDonationModal, setShowDonationModal] = useState<string | null>(null)
  const [donationAmount, setDonationAmount] = useState('')
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    status: 'live', // Default to live causes
    location: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  
  // View options
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [itemsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)

  // Load causes (in real app, this would be an API call)
  useEffect(() => {
    const loadCauses = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        setCauses(mockCauses)
        setFilteredCauses(mockCauses)
      } catch (error) {
        console.error('Failed to load causes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCauses()
  }, [])

  // Load bookmarked causes for authenticated users
  useEffect(() => {
    if (user) {
      // In real app, load from API/localStorage
      const saved = localStorage.getItem('bookmarked_causes')
      setBookmarkedCauses(saved ? JSON.parse(saved) : [])
    }
  }, [user])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...causes]

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(cause => 
        cause.title.toLowerCase().includes(query) ||
        cause.description.toLowerCase().includes(query) ||
        cause.organizer.first_name.toLowerCase().includes(query) ||
        cause.organizer.last_name.toLowerCase().includes(query) ||
        cause.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(cause => cause.category === filters.category)
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(cause => cause.status === filters.status)
    }

    // Apply location filter
    if (filters.location) {
      const location = filters.location.toLowerCase()
      filtered = filtered.filter(cause => 
        cause.location?.toLowerCase().includes(location)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sort_by) {
        case 'goal_amount':
          aValue = a.goal_amount
          bValue = b.goal_amount
          break
        case 'current_amount':
          aValue = a.current_amount
          bValue = b.current_amount
          break
        case 'end_date':
          aValue = new Date(a.end_date || '9999-12-31')
          bValue = new Date(b.end_date || '9999-12-31')
          break
        default: // created_at
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
      }

      if (filters.sort_order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCauses(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [causes, searchQuery, filters])

  const handleBookmarkToggle = (causeId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login?redirect=/causes'
      return
    }

    const newBookmarks = bookmarkedCauses.includes(causeId)
      ? bookmarkedCauses.filter(id => id !== causeId)
      : [...bookmarkedCauses, causeId]
    
    setBookmarkedCauses(newBookmarks)
    localStorage.setItem('bookmarked_causes', JSON.stringify(newBookmarks))
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      status: 'live',
      location: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    })
    setSearchQuery('')
  }

  const handleAddToCart = (cause: Cause, amount?: number) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login?redirect=/causes'
      return
    }

    const donationAmount = amount || 25 // Default amount
    addItem(cause, donationAmount, 'USD') // Default to USD
    setShowDonationModal(null)
    setDonationAmount('')
  }

  const handleQuickDonate = (causeId: string) => {
    setShowDonationModal(causeId)
    setDonationAmount('25') // Default amount
  }

  // Pagination
  const totalPages = Math.ceil(filteredCauses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCauses = filteredCauses.slice(startIndex, startIndex + itemsPerPage)

  const CauseCard = ({ cause }: { cause: Cause }) => {
    const isBookmarked = bookmarkedCauses.includes(cause.id)
    const inCart = isInCart(cause.id)
    const category = CAUSE_CATEGORIES.find(cat => cat.id === cause.category)
    
    return (
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-out">
        {/* Enhanced Image Section */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
          </div>
          
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-40" />
              <span className="relative bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                {category?.name}
              </span>
            </div>
          </div>

          {/* Bookmark Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => handleBookmarkToggle(cause.id)}
                    className={`group/bookmark relative p-2.5 rounded-full transition-all duration-200 backdrop-blur-sm ${
                      isBookmarked 
                        ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/25' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
            >
              <svg className={`w-4 h-4 transition-transform duration-200 ${isBookmarked ? 'scale-110' : 'group-hover/bookmark:scale-110'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </button>
          </div>

          {/* Location Badge */}
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

          {/* Featured Badge */}
          {cause.is_featured && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ⭐ FEATURED
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Content Section */}
        <div className="p-6 space-y-4">
          {/* Title and Organizer */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
              {cause.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {cause.short_description}
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {cause.organizer.first_name[0]}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                by {cause.organizer.first_name} {cause.organizer.last_name}
              </span>
            </div>
          </div>

          {/* Enhanced Funding Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  {formatCurrency(cause.current_amount, cause.currency as 'USD' | 'GHS')}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  raised of {formatCurrency(cause.goal_amount, cause.currency as 'USD' | 'GHS')}
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {Math.round(cause.progress_percentage)}%
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">funded</p>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-full relative overflow-hidden transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(cause.progress_percentage, 100)}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{cause.donation_count}</span>
                <span>supporters</span>
              </div>
              {cause.end_date && (
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Ends {new Date(cause.end_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Link href={`/causes/${cause.id}`} className="flex-1">
                    <button className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-green-50 hover:text-green-600 dark:hover:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                View Details
              </button>
            </Link>
            {inCart ? (
              <Link href="/donations/cart">
                <button className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>In Cart</span>
                </button>
              </Link>
            ) : (
              <button 
                onClick={() => handleQuickDonate(cause.id)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-green-500/10 dark:shadow-green-400/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Browse Causes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and support meaningful causes that are making a difference
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search causes, organizers, or keywords..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {viewMode === 'grid' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Categories</option>
                {CAUSE_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <Input
                type="text"
                placeholder="Enter location"
                value={filters.location || ''}
                onChange={(value) => handleFilterChange('location', value)}
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={`${filters.sort_by}_${filters.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split('_')
                  handleFilterChange('sort_by', sort_by)
                  handleFilterChange('sort_order', sort_order)
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="created_at_desc">Newest First</option>
                <option value="created_at_asc">Oldest First</option>
                <option value="goal_amount_desc">Highest Goal</option>
                <option value="goal_amount_asc">Lowest Goal</option>
                <option value="current_amount_desc">Most Funded</option>
                <option value="current_amount_asc">Least Funded</option>
                <option value="end_date_asc">Ending Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? 'Loading...' : `${filteredCauses.length} causes found`}
          </p>
          <div className="flex space-x-3">
            {user && bookmarkedCauses.length > 0 && (
              <Link href="/causes/bookmarked">
                <Button variant="outline">
                  My Bookmarks ({bookmarkedCauses.length})
                </Button>
              </Link>
            )}
            {itemCount > 0 && (
              <Link href="/donations/cart">
                <Button>
                  Cart ({itemCount})
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Causes Grid/List */}
        {!isLoading && (
          <>
            {paginatedCauses.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8"
                : "space-y-8 mb-8"
              }>
                {paginatedCauses.map(cause => (
                  <CauseCard key={cause.id} cause={cause} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No causes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or browse all causes
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Quick Donation Modal */}
        {showDonationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              {(() => {
                const cause = causes.find(c => c.id === showDonationModal)
                if (!cause) return null
                
                return (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add to Donation Cart
                      </h3>
                      <button
                        onClick={() => setShowDonationModal(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {cause.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {cause.organizer.first_name} {cause.organizer.last_name}
                      </p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Donation Amount (USD)
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={donationAmount}
                          onChange={setDonationAmount}
                          min="1"
                          max="100000"
                          step="0.01"
                          placeholder="25.00"
                          className="pr-8"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </div>
                      </div>
                      
                      {/* Quick amount buttons */}
                      <div className="flex space-x-2 mt-3">
                        {[10, 25, 50, 100].map(amount => (
                          <button
                            key={amount}
                            onClick={() => setDonationAmount(amount.toString())}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDonationModal(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(cause, parseFloat(donationAmount) || 25)}
                        className="flex-1"
                        disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
