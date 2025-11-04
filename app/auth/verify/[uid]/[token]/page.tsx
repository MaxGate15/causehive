'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

export default function VerifyEmailHandlerPage() {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  const { verifyEmail } = useAuth()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const verifyEmailAddress = async () => {
      if (!params.uid || !params.token) {
        setVerificationStatus('error')
        setMessage('Invalid verification link')
        return
      }

      try {
        const result = await verifyEmail(params.uid as string, params.token as string)
        
        if (result.success) {
          setVerificationStatus('success')
          setMessage(result.message || 'Email verified successfully!')
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000)
        } else {
          setVerificationStatus('error')
          setMessage(result.message || 'Email verification failed')
        }
      } catch (error: any) {
        setVerificationStatus('error')
        setMessage(error.message || 'An error occurred during verification')
      }
    }

    verifyEmailAddress()
  }, [params.uid, params.token, verifyEmail, router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full ${
            verificationStatus === 'success' 
              ? 'bg-green-100 dark:bg-green-900/20' 
              : verificationStatus === 'error'
              ? 'bg-red-100 dark:bg-red-900/20'
              : 'bg-blue-100 dark:bg-blue-900/20'
          }`}>
            {verificationStatus === 'verifying' && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
            {verificationStatus === 'success' && (
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {verificationStatus === 'error' && (
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {verificationStatus === 'verifying' && 'Verifying your email...'}
            {verificationStatus === 'success' && 'Email verified!'}
            {verificationStatus === 'error' && 'Verification failed'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {verificationStatus === 'verifying' && 'Please wait while we verify your email address'}
            {verificationStatus === 'success' && 'Your email has been successfully verified'}
            {verificationStatus === 'error' && 'There was an issue verifying your email'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {verificationStatus === 'verifying' && 'Email Verification'}
              {verificationStatus === 'success' && 'Verification Complete'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {verificationStatus === 'verifying' && 'We are verifying your email address...'}
              {verificationStatus === 'success' && 'You can now access all features of CauseHive'}
              {verificationStatus === 'error' && 'Please try again or contact support if the problem persists'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`rounded-lg p-4 ${
              verificationStatus === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : verificationStatus === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            }`}>
              <p className={`text-sm ${
                verificationStatus === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : verificationStatus === 'error'
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {message}
              </p>
            </div>

            <div className="space-y-4">
              {verificationStatus === 'success' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Redirecting to dashboard in a few seconds...
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => router.push('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}

              {verificationStatus === 'error' && (
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => router.push('/auth/verify-email')}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/auth/login')}
                  >
                    Back to Sign In
                  </Button>
                </div>
              )}

              {verificationStatus === 'verifying' && (
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help?{' '}
            <a
              href="mailto:support@causehive.tech"
              className="font-medium text-green-600 hover:text-green-500 dark:text-green-400"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
