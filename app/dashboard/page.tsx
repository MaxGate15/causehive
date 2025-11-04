'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDonationCart } from '@/contexts/DonationCartContext'
import { formatCurrency } from '@/lib/utils'
import { CAUSE_CATEGORIES } from '@/constants'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// Mock dashboard stats
const mockStats = {
  totalDonated: 1250,
  causesSupported: 8,
  impactScore: 95,
  monthlyGiving: 125
}

// Mock recent activities
const mockActivities = [
  {
    id: '1',
    type: 'donation',
    title: 'Donated to Help Build a School in Rural Ghana',
    amount: 50,
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '2',
    type: 'bookmark',
    title: 'Bookmarked Emergency Relief for Flood Victims',
    date: '2024-01-14',
    status: 'active'
  },
  {
    id: '3',
    type: 'donation',
    title: 'Donated to Medical Equipment for Community Hospital',
    amount: 75,
    date: '2024-01-12',
    status: 'completed'
  }
]

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { itemCount } = useDonationCart()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

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
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.first_name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Here's what's happening with your charitable giving
              </p>
            </div>
            <div className="hidden md:flex space-x-3">
              <Link href="/causes">
                <Button variant="outline">
                  Browse Causes
                </Button>
              </Link>
              {itemCount > 0 && (
                <Link href="/donations/cart">
                  <Button>
                    Cart ({itemCount})
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Donated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(mockStats.totalDonated)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +12% from last month
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
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {mockStats.causesSupported}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Across {user.donation_preferences?.length || 3} categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Impact Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {mockStats.impactScore}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Above average donor
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Giving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(mockStats.monthlyGiving)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Average this year
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Link href="/donations">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'donation' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      }`}>
                        {activity.type === 'donation' ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-5a1 1 0 011-1h4a1 1 0 011 1v5h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(activity.amount)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Donation Cart */}
            {itemCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Donation Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You have {itemCount} {itemCount === 1 ? 'cause' : 'causes'} ready for donation
                  </p>
                  <Link href="/donations/cart">
                    <Button className="w-full">
                      Complete Donations
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/causes">
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Causes
                  </Button>
                </Link>
                <Link href="/causes/bookmarked">
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    My Bookmarks
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Donation Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.donation_preferences?.map((categoryId) => {
                    const category = CAUSE_CATEGORIES.find(cat => cat.id === categoryId)
                    if (!category) return null
                    
                    return (
                      <div key={categoryId} className="flex items-center space-x-2 text-sm">
                        <span>{category.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                      </div>
                    )
                  }) || (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No preferences set yet
                    </p>
                  )}
                </div>
                <Link href="/profile?tab=preferences">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Update Preferences
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Causes */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recommended for You
            </h2>
            <Link href="/causes">
              <Button variant="outline">
                View All Causes
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Personalized Recommendations Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're working on smart cause recommendations based on your preferences
            </p>
            <Link href="/causes">
              <Button>
                Explore Causes Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
