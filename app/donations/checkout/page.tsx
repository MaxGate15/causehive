'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDonationCart } from '@/contexts/DonationCartContext'
import { formatCurrency } from '@/lib/utils'
import { CAUSE_CATEGORIES } from '@/constants'
import paymentService from '@/services/payment'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function CheckoutPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { items, totalAmount, clearCart } = useDonationCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Redirect if not authenticated or no items in cart
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/donations/checkout')
    } else if (!isLoading && items.length === 0) {
      router.push('/donations/cart')
    }
  }, [isAuthenticated, isLoading, items.length, router])

  // No additional fees for PayStack inline - they handle it transparently
  const grandTotal = totalAmount

  const handlePayment = async () => {
    if (!user) {
      setErrors({ general: 'Please log in to continue with payment' })
      return
    }

    setIsProcessing(true)
    setErrors({})

    try {
      const reference = paymentService.generateReference('CAUSEHIVE')
      
      // Prepare payment data for PayStack
      const paymentData = {
        amount: totalAmount,
        currency: 'GHS' as const,
        email: user.email,
        phone: user.phone,
        reference,
        callback_url: `${window.location.origin}/donations/success?reference=${reference}`,
        metadata: {
          donations: items.map(item => ({
            cause_id: item.cause.id,
            cause_title: item.cause.title,
            amount: item.amount,
            is_anonymous: item.is_anonymous,
            message: item.donor_message
          })),
          donor_name: `${user.first_name} ${user.last_name}`,
          total_causes: items.length,
          customer_name: `${user.first_name} ${user.last_name}`,
          customer_phone: user.phone
        }
      }

      // Store payment reference and cart data for success page
      localStorage.setItem('current_payment_reference', reference)
      localStorage.setItem('payment_cart_backup', JSON.stringify(items))

      // Launch PayStack Inline Checkout directly
      const result = await paymentService.initializeInlinePayment(
        paymentData,
        (response) => {
          // Payment successful
          console.log('Payment successful:', response)
          clearCart()
          router.push(`/donations/success?reference=${response.reference}`)
        },
        () => {
          // Payment cancelled
          console.log('Payment cancelled by user')
          setIsProcessing(false)
        }
      )

      if (!result.success) {
        setErrors({ general: result.message || 'Failed to initialize PayStack. Please try again.' })
        setIsProcessing(false)
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error)
      setErrors({ 
        general: error.message || 'Failed to start payment. Please refresh and try again.'
      })
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-green-50/30 dark:from-gray-900 dark:via-green-900/10 dark:to-green-900/10">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-700 bg-clip-text text-transparent">
                Secure Checkout
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete your donation to support these amazing causes with PayStack's secure payment gateway
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Integrated Checkout Interface */}
          <div className="space-y-6">
            {/* Error Display */}
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Simple Checkout Interface */}
            <Card className="shadow-xl border-0">
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  {/* Clean Payment Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                    {/* Donation Items */}
                    <div className="p-4 space-y-3">
                      {items.map((item, index) => {
                        const category = CAUSE_CATEGORIES.find(cat => cat.id === item.cause.category)
                        
                        return (
                          <div key={item.cause.id} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl min-w-0">
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">{category?.icon}</span>
                              </div>
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1 whitespace-nowrap">
                                {item.cause.title}
                              </h4>
                              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                ${item.amount.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Payment Summary */}
                    <div className="px-4 py-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Donation Amount</span>
                        <span className="text-sm text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Payment processing</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Handled by PayStack</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total to Pay</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                        PayStack fees will be calculated and displayed during checkout
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 text-lg rounded-xl transition-colors duration-200"
                    loading={isProcessing}
                    disabled={isProcessing}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {isProcessing ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>Proceed to Payment</span>
                        </>
                      )}
                    </div>
                  </Button>

                  {/* Back to Cart Button */}
                  <Button
                    variant="outline"
                    onClick={() => router.push('/donations/cart')}
                    className="w-full mb-4"
                    disabled={isProcessing}
                  >
                    Back to Cart
                  </Button>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secured by PayStack</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}