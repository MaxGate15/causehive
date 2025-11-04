'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthUser } from '@/types'
import authService from '@/services/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (userData: { email: string; password: string; first_name: string; last_name: string; phone: string; location: string; occupation: string }) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  verifyEmail: (uid: string, token: string) => Promise<{ success: boolean; message?: string }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>
  confirmPasswordReset: (uid: string, token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string }>
  getGoogleOAuthURL: () => Promise<{ success: boolean; url?: string; message?: string }>
  handleGoogleCallback: (code: string) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await authService.initializeAuth()
        setUser(userData)
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authService.login({ email, password })
      
      if (response.success && response.data) {
        setUser(response.data)
        return { success: true }
      } else {
        return { success: false, message: response.message || 'Login failed' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (userData: { email: string; password: string; first_name: string; last_name: string; phone: string; location: string; occupation: string }) => {
    try {
      setIsLoading(true)
      const response = await authService.signup(userData)
      
      if (response.success) {
        return { success: true, message: response.message || 'Account created successfully. Please check your email to verify your account.' }
      } else {
        return { success: false, message: response.message || 'Signup failed' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Signup failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await authService.initializeAuth()
      setUser(userData)
    } catch (error) {
      console.error('Refresh user failed:', error)
      setUser(null)
    }
  }

  // Verify email
  const verifyEmail = async (uid: string, token: string) => {
    try {
      const response = await authService.verifyEmail(uid, token)
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, message: error.message || 'Email verification failed' }
    }
  }

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      const response = await authService.requestPasswordReset({ email })
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, message: error.message || 'Password reset request failed' }
    }
  }

  // Confirm password reset
  const confirmPasswordReset = async (uid: string, token: string, newPassword: string) => {
    try {
      const response = await authService.confirmPasswordReset({ uid, token, new_password: newPassword })
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, message: error.message || 'Password reset failed' }
    }
  }

  // Resend verification
  const resendVerification = async (email: string) => {
    try {
      const response = await authService.resendVerification(email)
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to resend verification email' }
    }
  }

  // Google OAuth
  const getGoogleOAuthURL = async () => {
    try {
      const response = await authService.getGoogleOAuthURL()
      return { success: response.success, url: response.data?.url, message: response.message }
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to get Google OAuth URL' }
    }
  }

  const handleGoogleCallback = async (code: string) => {
    try {
      const response = await authService.handleGoogleCallback(code)
      
      if (response.success && response.data) {
        setUser(response.data.user)
        return { success: true, message: 'Login successful' }
      } else {
        return { success: false, message: response.message || 'Google login failed' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Google login failed' }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshUser,
    verifyEmail,
    requestPasswordReset,
    confirmPasswordReset,
    resendVerification,
    getGoogleOAuthURL,
    handleGoogleCallback,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
