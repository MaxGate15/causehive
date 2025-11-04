'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const { resendVerification } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!email) return

    try {
      setIsVerifying(true)
      const result = await resendVerification(email)
      
      if (result.success) {
        setVerificationStatus('success')
        setMessage(result.message || 'Verification email sent successfully')
      } else {
        setVerificationStatus('error')
        setMessage(result.message || 'Failed to resend verification email')
      }
    } catch (error: any) {
      setVerificationStatus('error')
      setMessage(error.message || 'An error occurred')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
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
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a verification link to your email address
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Please check your email and click the verification link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {email && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Verification email sent to: <strong>{email}</strong>
                </p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">Didn't receive the email?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Check your spam/junk folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Wait a few minutes for the email to arrive</li>
                </ul>
              </div>

              {email && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResendVerification}
                  loading={isVerifying}
                  disabled={isVerifying}
                >
                  Resend verification email
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                Back to sign in
              </Button>
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
