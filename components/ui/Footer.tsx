import React from 'react'
import Link from 'next/link'
import { APP_CONFIG, CAUSE_CATEGORIES } from '@/constants'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Brand */}
          <div className="space-y-3 md:space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-lg">C</span>
              </div>
              <span className="text-sm md:text-xl font-bold text-gray-900 dark:text-white">
                {APP_CONFIG.NAME}
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm hidden md:block">
              Empowering change through crowdfunding. Support causes that matter and make a difference in the world.
            </p>
            <div className="flex space-x-2 md:space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors hidden md:inline-block"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors hidden md:inline-block"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.529l1.529-1.297c.447.596 1.149.954 1.912.954 1.297 0 2.35-1.053 2.35-2.35s-1.053-2.35-2.35-2.35c-.763 0-1.465.358-1.912.954L5.244 8.541c.757-.933 1.908-1.529 3.205-1.529 2.146 0 3.888 1.742 3.888 3.888s-1.742 3.888-3.888 3.888zm7.118-3.888c0 2.146 1.742 3.888 3.888 3.888s3.888-1.742 3.888-3.888-1.742-3.888-3.888-3.888-3.888 1.742-3.888 3.888zm3.888-2.35c1.297 0 2.35 1.053 2.35 2.35s-1.053 2.35-2.35 2.35-2.35-1.053-2.35-2.35 1.053-2.35 2.35-2.35z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Causes */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
              Causes
            </h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link
                  href="/causes"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Browse All
                </Link>
              </li>
              <li>
                <Link
                  href="/causes/create"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Start a Cause
                </Link>
              </li>
              {CAUSE_CATEGORIES.slice(0, 2).map((category) => (
                <li key={category.id} className="hidden md:block">
                  <Link
                    href={`/causes?category=${category.id}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
              Support
            </h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/faq"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/safety"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Safety & Trust
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 md:space-y-4 col-span-3 md:col-span-1">
            <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-1 md:space-y-2 grid grid-cols-2 md:grid-cols-1 gap-x-4 md:gap-x-0">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/cookies"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/refund"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-xs md:text-sm"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <span className="text-center">Made with ❤️ for good causes</span>
              <div className="flex items-center space-x-2">
                <span>Supported by:</span>
                <span className="text-green-500 font-medium">Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
