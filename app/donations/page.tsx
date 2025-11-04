'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/lib/utils'
import { CAUSE_CATEGORIES } from '@/constants'
import { Donation } from '@/types'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// Mock donation history data
const mockDonations: Donation[] = [
  {
    id: '1',
    amount: 50,
    currency: 'USD',
    donor_name: 'Demo User',
    donor_email: 'demo@causehive.com',
    donor_message: 'Happy to support education in Ghana!',
    cause: {
      id: '1',
      title: 'Help Build a School in Rural Ghana',
      description: 'Building a primary school for 200 children in rural Ghana',
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
      tags: ['education', 'ghana', 'school'],
      location: 'Upper East Region, Ghana',
      is_featured: true,
      donation_count: 127,
      progress_percentage: 65
    },
    created_at: '2024-01-15T10:30:00Z',
    status: 'completed',
    transaction_id: 'TXN_001',
    payment_method: 'Mobile Money',
    is_anonymous: false
  },
  {
    id: '2',
    amount: 25,
    currency: 'USD',
    donor_name: 'Demo User',
    donor_email: 'demo@causehive.com',
    donor_message: 'Every bit helps for flood victims.',
    cause: {
      id: '2',
      title: 'Emergency Relief for Flood Victims',
      description: 'Providing immediate relief to flood-affected families',
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
      tags: ['disaster', 'relief', 'flood'],
      location: 'Lagos State, Nigeria',
      is_featured: true,
      donation_count: 89,
      progress_percentage: 75
    },
    created_at: '2024-01-10T14:20:00Z',
    status: 'completed',
    transaction_id: 'TXN_002',
    payment_method: 'Credit Card',
    is_anonymous: false
  },
  {
    id: '3',
    amount: 100,
    currency: 'USD',
    donor_name: 'Anonymous',
    donor_email: 'demo@causehive.com',
    cause: {
      id: '3',
      title: 'Medical Equipment for Community Hospital',
      description: 'Essential medical equipment for community hospital',
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
      tags: ['healthcare', 'medical', 'hospital'],
      location: 'Nairobi, Kenya',
      is_featured: false,
      donation_count: 156,
      progress_percentage: 60
    },
    created_at: '2024-01-05T09:15:00Z',
    status: 'completed',
    transaction_id: 'TXN_003',
    payment_method: 'Mobile Money',
    is_anonymous: true
  }
]

export default function DonationsPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [isLoadingDonations, setIsLoadingDonations] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/donations')
    }
  }, [isAuthenticated, isLoading, router])

  // Load donations
  useEffect(() => {
    if (user) {
      const loadDonations = async () => {
        setIsLoadingDonations(true)
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800))
          setDonations(mockDonations)
          setFilteredDonations(mockDonations)
        } catch (error) {
          console.error('Failed to load donations:', error)
        } finally {
          setIsLoadingDonations(false)
        }
      }
      
      loadDonations()
    }
  }, [user])

  // Apply filters
  useEffect(() => {
    let filtered = [...donations]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(donation => 
        donation.cause.title.toLowerCase().includes(query) ||
        donation.cause.organizer.first_name.toLowerCase().includes(query) ||
        donation.cause.organizer.last_name.toLowerCase().includes(query) ||
        donation.cause.category.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(donation => 
          new Date(donation.created_at) >= filterDate
        )
      }
    }

    setFilteredDonations(filtered)
  }, [donations, searchQuery, statusFilter, dateFilter])

  // Calculate statistics
  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const totalDonations = donations.length
  const causesSupported = new Set(donations.map(d => d.cause.id)).size
  const averageDonation = totalDonations > 0 ? totalDonated / totalDonations : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'refunded': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'mobile money':
        return '📱'
      case 'credit card':
        return '💳'
      case 'paypal':
        return '🟦'
      default:
        return '💰'
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Donations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your charitable contributions and their impact
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Donated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalDonated)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Across all causes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalDonations}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Individual contributions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Causes Supported
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {causesSupported}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Different campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Donation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(averageDonation)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Per contribution
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <Input
                  type="text"
                  placeholder="Search by cause or organizer..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donations List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Donation History ({filteredDonations.length})
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Export PDF
                </Button>
                <Link href="/causes">
                  <Button size="sm">
                    Donate More
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDonations ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredDonations.length > 0 ? (
              <div className="space-y-4">
                {filteredDonations.map((donation) => {
                  const category = CAUSE_CATEGORIES.find(cat => cat.id === donation.cause.category)
                  
                  return (
                    <div key={donation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-lg">{category?.icon}</span>
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {donation.cause.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                by {donation.cause.organizer.first_name} {donation.cause.organizer.last_name} • {donation.cause.location}
                              </p>
                              
                              {donation.donor_message && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  "{donation.donor_message}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(donation.amount, donation.currency)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(donation.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {getPaymentMethodIcon(donation.payment_method)} {donation.payment_method}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            {donation.is_anonymous && (
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                                <span>Anonymous</span>
                              </span>
                            )}
                            <span>ID: {donation.transaction_id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <Link href={`/causes/${donation.cause.id}`}>
                          <Button variant="outline" size="sm">
                            View Cause
                          </Button>
                        </Link>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            Download Receipt
                          </Button>
                          {donation.status === 'completed' && (
                            <Button variant="ghost" size="sm">
                              Request Refund
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery || statusFilter !== 'all' || dateFilter !== 'all' ? 'No matching donations found' : 'No donations yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? 'Try adjusting your filters to see more results'
                    : 'Start making a difference by supporting causes you care about'
                  }
                </p>
                <Link href="/causes">
                  <Button>
                    Browse Causes
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Impact Summary */}
        {filteredDonations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Impact Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Global Reach
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Supporting causes across multiple regions
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">💝</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generous Donor
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Above average contribution per donation
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Community Builder
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Actively engaged with multiple causes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
