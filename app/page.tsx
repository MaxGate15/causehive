'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { CAUSE_CATEGORIES, CURRENCY } from '@/constants'
import { Cause } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'

// Mock data - this would come from your API
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
    is_featured: true,
    donation_count: 127,
    progress_percentage: calculateProgress(32500, 50000)
  },
  {
    id: '2',
    title: 'Emergency Relief for Flood Victims',
    description: 'Providing immediate relief including food, clean water, and shelter to families affected by recent flooding.',
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
    is_featured: true,
    donation_count: 89,
    progress_percentage: calculateProgress(18750, 25000)
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
    is_featured: false,
    donation_count: 156,
    progress_percentage: calculateProgress(45000, 75000)
  }
]

const mockStats = {
  total_causes: 1247,
  total_amount_raised: 2847500,
  total_donations: 15432,
  active_causes: 89
}

export default function Home() {
  const { user, logout } = useAuth()
  const [featuredCauses, setFeaturedCauses] = useState<Cause[]>([])
  const [stats, setStats] = useState(mockStats)

  useEffect(() => {
    // Load featured causes
    setFeaturedCauses(mockCauses.filter(cause => cause.is_featured))
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Make a Difference with{' '}
              <span className="text-green-500">CauseHive</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Support charitable causes that matter to you. From education and healthcare to disaster relief and environmental conservation, help make the world a better place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/causes">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Causes
                </Button>
              </Link>
              <Link href="/causes/create">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Start a Cause
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                {stats.total_causes.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Active Causes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                {formatCurrency(stats.total_amount_raised)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Total Raised
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                {stats.total_donations.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Donations Made
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                {stats.active_causes}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Live Campaigns
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Causes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover inspiring causes that are making a real impact in communities around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCauses.map((cause) => (
              <Card key={cause.id} variant="elevated" className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="bg-green-500 px-2 py-1 rounded text-sm font-medium">
                      {CAUSE_CATEGORIES.find(c => c.id === cause.category)?.name}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{cause.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {cause.short_description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-500">
                        {formatCurrency(cause.current_amount, cause.currency as 'USD' | 'GHS')}
                      </span>
                      <span className="text-gray-500 text-sm">
                        of {formatCurrency(cause.goal_amount, cause.currency as 'USD' | 'GHS')}
                      </span>
                    </div>
                    <Progress value={cause.progress_percentage} showLabel />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{cause.donation_count} donations</span>
                      <span>
                        {cause.end_date && new Date(cause.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <Link href={`/causes/${cause.id}`}>
                      <Button className="w-full">
                        Donate Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/causes">
              <Button variant="outline" size="lg">
                View All Causes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Causes by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find causes that align with your values and interests.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CAUSE_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/causes?category=${category.id}`}
                className="group"
              >
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How CauseHive Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Making a difference is simple and secure with our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Discover Causes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through verified charitable causes across different categories and find ones that resonate with you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Make a Donation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Contribute securely using our integrated payment system with support for multiple currencies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Track Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Follow the progress of causes you support and see the real impact of your contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already making an impact through CauseHive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Get Started Today
              </Button>
            </Link>
            <Link href="/causes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-500">
                Explore Causes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
