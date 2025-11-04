'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { APP_CONFIG, CAUSE_CATEGORIES } from '@/constants'
import { User } from '@/types'
import { useDonationCart } from '@/contexts/DonationCartContext'
import Button from './Button'

interface HeaderProps {
  user?: User | null
  onLogout?: () => void
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { itemCount } = useDonationCart()
  const router = useRouter()

  const handleLogout = () => {
    onLogout?.()
    setIsDropdownOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {APP_CONFIG.NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/causes"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              Browse Causes
            </Link>
            <Link
              href="/causes/create"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              Start a Cause
            </Link>
            <Link
              href="/testimonials"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Donation Cart */}
            <Link
              href="/donations/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.2-1.2M6 16h15.4m-13.4 0l1.2 1.2m-1.2-1.2L6 16m0 0c.8 0 1.5.7 1.5 1.5S6.8 19 6 19s-1.5-.7-1.5-1.5S5.2 16 6 16zm9 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/donations"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Donations
                    </Link>
                    <Link
                      href="/donations/cart"
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Donation Cart
                      {itemCount > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions - Cart and Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Icon */}
            <Link
              href="/donations/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.2-1.2M6 16h15.4m-13.4 0l1.2 1.2m-1.2-1.2L6 16m0 0c.8 0 1.5.7 1.5 1.5S6.8 19 6 19s-1.5-.7-1.5-1.5S5.2 16 6 16zm9 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/causes"
                className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Causes
              </Link>
              <Link
                href="/causes/create"
                className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Start a Cause
              </Link>
              <Link
                href="/testimonials"
                className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/donations/cart"
                className="flex items-center justify-between text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Donation Cart
                {itemCount > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block py-2 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/donations"
                    className="block py-2 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Donations
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block py-2 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
