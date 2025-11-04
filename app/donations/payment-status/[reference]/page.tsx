'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDonationCart } from '@/contexts/DonationCartContext'
import paymentService from '@/services/payment'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface PaymentStatusPageProps {
  params: {
    reference: string
  }
}

export default function PaymentStatusPage({ params }: PaymentStatusPageProps) {
  const { user, logout } = useAuth()
  const { clearCart } = useDonationCart()
  const router = useRouter()
  const { reference } = params

  const [status, setStatus] = useState<'checking' | 'pending' | 'success' | 'failed'>('checking')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(300) // 5 minutes timeout

  useEffect(() => {
    let interval: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout

    const checkPaymentStatus = async () => {
      try {
        const result = await paymentService.verifyPayment(reference)
        
        if (result.success) {
          setStatus('success')
          setMessage('Payment completed successfully!')
          clearCart() // Clear the donation cart
          
          // Redirect to success page after 3 seconds
          setTimeout(() => {
            router.push('/donations/success?reference=' + reference)
          }, 3000)
        } else {
          setStatus('pending')
          setMessage('Waiting for payment confirmation...')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('pending')
        setMessage('Checking payment status...')
      }
    }

    // Start countdown
    countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setStatus('failed')
          setMessage('Payment timeout. Please try again.')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Check payment status immediately
    checkPaymentStatus()
    
    // Then check every 5 seconds
    interval = setInterval(() => {
      if (status !== 'success' && status !== 'failed') {
        checkPaymentStatus()
      }
    }, 5000)

    return () => {
      if (interval) clearInterval(interval)
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [reference, status, clearCart, router])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleRetry = () => {
    router.push('/donations/checkout')
  }

  const handleGoHome = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* Status Icon */}
              <div className="flex justify-center mb-6">
                {status === 'checking' && (
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
                )}
                
                {status === 'pending' && (
                  <div className="relative">
                    <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-yellow-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-16 w-16 bg-yellow-500 items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="rounded-full h-16 w-16 bg-green-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {status === 'failed' && (
                  <div className="rounded-full h-16 w-16 bg-red-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Status Message */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {status === 'checking' && 'Initializing Payment...'}
                  {status === 'pending' && 'Waiting for Payment'}
                  {status === 'success' && 'Payment Successful!'}
                  {status === 'failed' && 'Payment Failed'}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {message}
                </p>

                {status === 'pending' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      📱 Please check your mobile phone
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      You should receive a payment request popup on your mobile money app. 
                      Approve the payment to complete your donation.
                    </p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                    <p className="text-green-800 dark:text-green-200">
                      Thank you for your generous donation! You will be redirected shortly...
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Reference */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Reference:</p>
                <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {reference}
                </p>
              </div>

              {/* Countdown Timer */}
              {status === 'pending' && countdown > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Payment will timeout in: <span className="font-medium">{formatTime(countdown)}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {status === 'failed' && (
                  <>
                    <Button onClick={handleRetry} className="w-full">
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={handleGoHome} className="w-full">
                      Go to Dashboard
                    </Button>
                  </>
                )}

                {status === 'success' && (
                  <Button onClick={() => router.push('/donations/success?reference=' + reference)} className="w-full">
                    View Receipt
                  </Button>
                )}

                {status === 'pending' && (
                  <Button variant="outline" onClick={handleGoHome} className="w-full">
                    Continue Later
                  </Button>
                )}
              </div>

              {/* Help Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Need help?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="ghost" size="sm">
                    Contact Support
                  </Button>
                  <Button variant="ghost" size="sm">
                    Payment Guide
                  </Button>
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
