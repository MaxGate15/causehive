'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/lib/utils'
import { CAUSE_CATEGORIES } from '@/constants'
import paymentService from '@/services/payment'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

// Mock donation data for success page
interface DonationDetails {
  reference: string
  amount: number
  currency: string
  status: string
  timestamp: string
  causes: Array<{
    title: string
    amount: number
    category: string
  }>
  donor_name: string
  payment_method: string
}

export default function DonationSuccessPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')

  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!reference) {
      router.push('/dashboard')
      return
    }

    // Verify payment and load donation details
    const verifyAndLoadDonation = async () => {
      setIsLoading(true)
      try {
        // Verify payment with PayStack
        const verificationResult = await paymentService.verifyPayment(reference)
        
        if (verificationResult.success && verificationResult.data) {
          // Load cart data from localStorage backup
          const cartBackup = localStorage.getItem('payment_cart_backup')
          let causes = []
          
          if (cartBackup) {
            const cartItems = JSON.parse(cartBackup)
            causes = cartItems.map((item: any) => ({
              title: item.cause.title,
              amount: item.amount,
              category: item.cause.category
            }))
            // Clean up backup
            localStorage.removeItem('payment_cart_backup')
          }

          const donationData: DonationDetails = {
            reference: verificationResult.data.reference,
            amount: verificationResult.data.amount,
            currency: verificationResult.data.currency,
            status: verificationResult.data.status,
            timestamp: verificationResult.data.transaction_date || new Date().toISOString(),
            causes: causes.length > 0 ? causes : [{
              title: 'Donation',
              amount: verificationResult.data.amount,
              category: 'other'
            }],
            donor_name: verificationResult.data.customer?.first_name && verificationResult.data.customer?.last_name 
              ? `${verificationResult.data.customer.first_name} ${verificationResult.data.customer.last_name}`
              : user ? `${user.first_name} ${user.last_name}` : 'Anonymous Donor',
            payment_method: 'PayStack'
          }
          
          setDonationDetails(donationData)
          
          // Clean up stored reference
          localStorage.removeItem('current_payment_reference')
        } else {
          // Payment verification failed
          console.error('Payment verification failed:', verificationResult.message)
          router.push('/donations/cart?error=verification_failed')
        }
      } catch (error) {
        console.error('Failed to verify payment:', error)
        router.push('/donations/cart?error=verification_error')
      } finally {
        setIsLoading(false)
      }
    }
    
    verifyAndLoadDonation()
  }, [reference, user, router])

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert('Receipt download functionality would be implemented here')
  }

  const handleShareSuccess = () => {
    // Social sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'I just made a difference with CauseHive!',
        text: `I donated ${formatCurrency(donationDetails?.amount || 0, 'GHS')} to support amazing causes. Join me in making a difference!`,
        url: window.location.origin
      })
    } else {
      // Fallback for browsers without Web Share API
      const text = `I just donated ${formatCurrency(donationDetails?.amount || 0, 'GHS')} to support amazing causes through CauseHive! Join me in making a difference: ${window.location.origin}`
      navigator.clipboard.writeText(text)
      alert('Sharing text copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!donationDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header user={user} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Donation Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find the details for this donation.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="rounded-full h-20 w-20 bg-green-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You for Your Generosity! 🎉
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Your donation of <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(donationDetails.amount, donationDetails.currency as 'USD' | 'GHS')}
              </span> has been processed successfully.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              You're making a real difference in the world!
            </p>
          </div>

          {/* Donation Receipt */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Donation Receipt</CardTitle>
                <Button variant="outline" size="sm" onClick={handleDownloadReceipt}>
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Transaction Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-mono">{donationDetails.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>{new Date(donationDetails.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{donationDetails.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize text-green-600 dark:text-green-400 font-medium">
                        {donationDetails.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Donor Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span>{donationDetails.donor_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(donationDetails.amount, donationDetails.currency as 'USD' | 'GHS')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported Causes */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                  Causes Supported
                </h3>
                <div className="space-y-3">
                  {donationDetails.causes.map((cause, index) => {
                    const category = CAUSE_CATEGORIES.find(cat => cat.id === cause.category)
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">{category?.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {cause.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {category?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(cause.amount, donationDetails.currency as 'USD' | 'GHS')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Statement */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your Impact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏫</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Helping build educational infrastructure
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏥</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Improving healthcare access
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌍</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Creating positive change in communities
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <Button onClick={handleShareSuccess} variant="outline" size="lg">
              🎯 Share Your Impact
            </Button>
            
            <Link href="/causes">
              <Button size="lg">
                Support More Causes
              </Button>
            </Link>
            
            <Link href="/donations">
              <Button variant="outline" size="lg">
                View Donation History
              </Button>
            </Link>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email Confirmation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You'll receive a detailed receipt via email within the next few minutes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Fund Transfer</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your donation will be transferred to the cause organizers within 3-5 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Impact Updates</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You'll receive updates on how your donation is making a difference in the communities.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
