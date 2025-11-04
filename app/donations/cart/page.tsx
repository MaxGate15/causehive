'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDonationCart } from '@/contexts/DonationCartContext'
import { formatCurrency } from '@/lib/utils'
import { CAUSE_CATEGORIES } from '@/constants'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Image from 'next/image'

export default function DonationCartPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { 
    items, 
    itemCount, 
    totalAmount, 
    removeItem, 
    updateItem, 
    clearCart 
  } = useDonationCart()

  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleAmountChange = async (causeId: string, newAmount: string) => {
    setIsUpdating(causeId)
    setErrors(prev => ({ ...prev, [causeId]: '' }))

    try {
      const amount = parseFloat(newAmount)
      
      if (isNaN(amount) || amount <= 0) {
        setErrors(prev => ({ ...prev, [causeId]: 'Please enter a valid amount' }))
        return
      }
      
      if (amount > 100000) {
        setErrors(prev => ({ ...prev, [causeId]: 'Maximum donation amount is $100,000' }))
        return
      }

      // Simulate API delay for updating
      await new Promise(resolve => setTimeout(resolve, 300))
      updateItem(causeId, { amount })
    } catch (error) {
      setErrors(prev => ({ ...prev, [causeId]: 'Failed to update amount' }))
    } finally {
      setIsUpdating(null)
    }
  }

  const handleAnonymousToggle = (causeId: string, isAnonymous: boolean) => {
    updateItem(causeId, { is_anonymous: isAnonymous })
  }

  const handleMessageChange = (causeId: string, message: string) => {
    updateItem(causeId, { donor_message: message })
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      // Redirect to login with return URL
      router.push('/auth/login?redirect=/donations/cart')
      return
    }
    
    if (items.length === 0) {
      return
    }

    // Proceed to checkout page
    router.push('/donations/checkout')
  }

  const calculateFees = (amount: number) => {
    // Example fee calculation (2.5% + $0.30)
    return Math.round((amount * 0.025 + 0.30) * 100) / 100
  }

  const totalFees = items.reduce((sum, item) => sum + calculateFees(item.amount), 0)
  const grandTotal = totalAmount + totalFees

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Donation Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your donations before checkout
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your donation cart is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse causes and add the ones you want to support to your cart.
            </p>
            <Link href="/causes">
              <Button>
                Browse Causes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {itemCount} {itemCount === 1 ? 'Cause' : 'Causes'} in Cart
                </h2>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                >
                  Clear Cart
                </Button>
              </div>

              {items.map((item) => {
                const category = CAUSE_CATEGORIES.find(cat => cat.id === item.cause.category)
                const isUpdatingThis = isUpdating === item.cause.id
                
                return (
                  <Card key={item.cause.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Cause Image & Info */}
                      <div className="md:w-1/3">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="bg-green-500 px-2 py-1 rounded text-sm font-medium text-white">
                              {category?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cause Details & Controls */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {item.cause.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                              by {item.cause.organizer.first_name} {item.cause.organizer.last_name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {item.cause.location}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.cause.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>

                        {/* Donation Amount */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Donation Amount ({item.currency})
                            </label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={item.amount.toString()}
                                onChange={(value) => handleAmountChange(item.cause.id, value)}
                                min="1"
                                max="100000"
                                step="0.01"
                                error={errors[item.cause.id]}
                                disabled={isUpdatingThis}
                                className="pr-12"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                {item.currency === 'USD' ? '$' : '₵'}
                              </div>
                              {isUpdatingThis && (
                                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-end">
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Processing fee: {formatCurrency(calculateFees(item.amount), item.currency)}
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                Total: {formatCurrency(item.amount + calculateFees(item.amount), item.currency)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Anonymous Donation Toggle */}
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            id={`anonymous-${item.cause.id}`}
                            checked={item.is_anonymous}
                            onChange={(e) => handleAnonymousToggle(item.cause.id, e.target.checked)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`anonymous-${item.cause.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Make this donation anonymous
                          </label>
                        </div>

                        {/* Optional Message */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Optional Message
                          </label>
                          <textarea
                            value={item.donor_message || ''}
                            onChange={(e) => handleMessageChange(item.cause.id, e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Share why this cause matters to you (optional)"
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {(item.donor_message || '').length}/500 characters
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Donation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Individual items */}
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.cause.id} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                            {item.cause.title}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.amount, item.currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span>{formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Processing fees</span>
                        <span>{formatCurrency(totalFees)}</span>
                      </div>
                      <hr className="border-gray-200 dark:border-gray-700" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-green-600 dark:text-green-400">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={handleProceedToCheckout}
                        className="w-full"
                        disabled={items.length === 0 || isUpdating !== null}
                      >
                        {!user ? 'Sign In to Donate' : 'Proceed to Checkout'}
                      </Button>
                      
                      <Link href="/causes">
                        <Button variant="outline" className="w-full">
                          Continue Browsing
                        </Button>
                      </Link>
                    </div>

                    {/* Security Note */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zM3 10a7 7 0 1114 0 7 7 0 01-14 0z" clipRule="evenodd" />
                        </svg>
                        <span>Secure checkout</span>
                      </div>
                      <p>Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
