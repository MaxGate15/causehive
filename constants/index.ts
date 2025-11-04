// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/api/user/auth/signup/',
    LOGIN: '/api/user/auth/login/',
    LOGOUT: '/api/user/auth/logout/',
    VERIFY: '/api/user/auth/verify',
    RESEND_VERIFICATION: '/api/user/auth/resend-verification/',
    PASSWORD_RESET: '/api/user/auth/password-reset/',
    PASSWORD_RESET_CONFIRM: '/api/user/auth/password-reset-confirm/',
    PROFILE: '/api/user/profile/',
  },
  // Google OAuth
  GOOGLE: {
    URL: '/api/user/google/url/',
    CALLBACK: '/api/user/google/callback/',
  },
  // Causes
  CAUSES: {
    LIST: '/api/causes/',
    CREATE: '/api/causes/',
    DETAIL: '/api/causes',
    UPDATE: '/api/causes',
  },
  // Donations
  DONATIONS: {
    LIST: '/api/donations/',
    CREATE: '/api/donations/',
    STATISTICS: '/api/donations/statistics/',
  },
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard/',
    DONATIONS_CHART: '/admin/api/donations-chart/',
  },
  // Health
  HEALTH: '/api/health/',
}

// App Configuration
export const APP_CONFIG = {
  NAME: 'CauseHive',
  DESCRIPTION: 'A crowdfunding platform for charitable causes',
  SUPPORT_EMAIL: 'support@causehive.tech',
  DEFAULT_FROM_EMAIL: 'CauseHive <no-reply@causehive.tech>',
}

// PayStack Configuration
export const PAYSTACK_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_036c03cd4c0b4f90b74318c95bda9c78ff680a0a',
  SECRET_KEY: process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY || '', // Backend only - should not be exposed
  BASE_URL: 'https://api.paystack.co',
  INLINE_SCRIPT: 'https://js.paystack.co/v1/inline.js',
  SUPPORTED_CURRENCIES: ['NGN', 'GHS', 'ZAR', 'KES'],
  CALLBACK_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
}

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    SECONDARY: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    SUCCESS: '#22c55e',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
}

// Currency Configuration
export const CURRENCY = {
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
  },
  GHS: {
    symbol: '₵',
    code: 'GHS',
    name: 'Ghanaian Cedi',
  },
}

// Cause Categories
export const CAUSE_CATEGORIES = [
  { id: 'education', name: 'Education', icon: '📚', description: 'Educational initiatives and scholarships' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Medical treatments and health programs' },
  { id: 'environment', name: 'Environment', icon: '🌱', description: 'Environmental conservation and sustainability' },
  { id: 'animals', name: 'Animals', icon: '🐾', description: 'Animal welfare and rescue' },
  { id: 'community', name: 'Community', icon: '🏘️', description: 'Community development projects' },
  { id: 'disaster', name: 'Disaster Relief', icon: '🚨', description: 'Emergency and disaster response' },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨', description: 'Arts, culture, and creative projects' },
  { id: 'technology', name: 'Technology', icon: '💻', description: 'Tech for good initiatives' },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Sports and recreation programs' },
  { id: 'other', name: 'Other', icon: '🤝', description: 'Other charitable causes' },
]

// Cause Status
export const CAUSE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  LIVE: 'live',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const

export const CAUSE_STATUS_LABELS = {
  [CAUSE_STATUS.DRAFT]: 'Draft',
  [CAUSE_STATUS.PENDING]: 'Pending Approval',
  [CAUSE_STATUS.LIVE]: 'Live',
  [CAUSE_STATUS.COMPLETED]: 'Completed',
  [CAUSE_STATUS.REJECTED]: 'Rejected',
}

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
} as const

// Email Types
export const EMAIL_TYPES = {
  VERIFICATION: 'verification',
  PASSWORD_RESET: 'password_reset',
  DONATION_SUCCESS: 'donation_success',
  WITHDRAWAL_PROCESSED: 'withdrawal_processed',
  CAUSE_APPROVED: 'cause_approved',
  CAUSE_REJECTED: 'cause_rejected',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
}

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  CAUSE_TITLE_MAX_LENGTH: 200,
  CAUSE_DESCRIPTION_MAX_LENGTH: 5000,
  USER_NAME_MAX_LENGTH: 100,
  DONATION_MIN_AMOUNT: 1,
  DONATION_MAX_AMOUNT: 100000,
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'causehive_access_token',
  REFRESH_TOKEN: 'causehive_refresh_token',
  USER_DATA: 'causehive_user_data',
  THEME: 'causehive_theme',
  CURRENCY: 'causehive_currency',
}
