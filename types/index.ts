// User Types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  location: string
  phone: string
  occupation: string
  is_verified: boolean
  is_active: boolean
  date_joined: string
  last_login: string
  profile_picture?: string
  bio?: string
  website?: string
  role: 'user' | 'admin' | 'organizer'
  donation_preferences?: string[]
  profile_visibility: {
    show_full_name: boolean
    show_location: boolean
    show_phone: boolean
    show_occupation: boolean
  }
}

export interface AuthUser extends User {
  access_token: string
  refresh_token: string
}

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  first_name: string
  last_name: string
  location: string
  phone: string
  occupation: string
}

export interface PasswordResetData {
  email: string
}

export interface PasswordResetConfirmData {
  uid: string
  token: string
  new_password: string
}

export interface GoogleOAuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

// Cause Types
export interface Cause {
  id: string
  title: string
  description: string
  short_description: string
  goal_amount: number
  current_amount: number
  currency: 'USD' | 'GHS'
  category: string
  status: 'draft' | 'pending' | 'live' | 'completed' | 'rejected'
  featured_image: string
  gallery_images: string[]
  organizer: User
  created_at: string
  updated_at: string
  end_date?: string
  tags: string[]
  location?: string
  is_featured: boolean
  donation_count: number
  progress_percentage: number
}

export interface CreateCauseData {
  title: string
  description: string
  short_description: string
  goal_amount: number
  currency: 'USD' | 'GHS'
  category: string
  featured_image: File | string
  gallery_images: File[] | string[]
  end_date?: string
  tags: string[]
  location?: string
}

export interface UpdateCauseData extends Partial<CreateCauseData> {
  id: string
}

// Donation Types
export interface Donation {
  id: string
  amount: number
  currency: 'USD' | 'GHS'
  donor_name: string
  donor_email: string
  donor_message?: string
  cause: Cause
  donor?: User
  created_at: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  payment_method: string
  is_anonymous: boolean
}

export interface CreateDonationData {
  amount: number
  currency: 'USD' | 'GHS'
  cause_id: string
  donor_name: string
  donor_email: string
  donor_message?: string
  is_anonymous: boolean
  payment_method: string
}

// Payment Types
export interface PaymentData {
  amount: number
  currency: 'USD' | 'GHS'
  email: string
  reference: string
  callback_url: string
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

// Category Types
export interface Category {
  id: string
  name: string
  description: string
  icon: string
  cause_count: number
  created_at: string
}

// Analytics Types
export interface DashboardStats {
  total_users: number
  total_causes: number
  total_donations: number
  total_amount_raised: number
  active_causes: number
  completed_causes: number
  pending_causes: number
  recent_donations: Donation[]
  top_causes: Cause[]
  user_registration_trend: Array<{ date: string; count: number }>
  donation_trend: Array<{ date: string; amount: number }>
}

export interface DonationChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
  }>
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  is_read: boolean
  created_at: string
  data?: Record<string, any>
}

export interface EmailTemplate {
  type: 'verification' | 'password_reset' | 'donation_success' | 'withdrawal_processed' | 'cause_approved' | 'cause_rejected'
  subject: string
  html_content: string
  text_content: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Form Types
export interface FormErrors {
  [key: string]: string | string[]
}

export interface FormState {
  isLoading: boolean
  errors: FormErrors
  success: boolean
  message?: string
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

export type Currency = 'USD' | 'GHS'

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  status?: string
  min_amount?: number
  max_amount?: number
  currency?: 'USD' | 'GHS'
  location?: string
  tags?: string[]
  sort_by?: 'created_at' | 'goal_amount' | 'current_amount' | 'end_date'
  sort_order?: 'asc' | 'desc'
}

export interface SearchParams {
  page?: number
  limit?: number
  filters: SearchFilters
}
