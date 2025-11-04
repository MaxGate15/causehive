import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/constants'
import { AuthUser, LoginCredentials, SignupData, PasswordResetData, PasswordResetConfirmData, GoogleOAuthResponse, ApiResponse } from '@/types'

class AuthService {
  private baseURL = API_BASE_URL
  private isDemoMode = true // Set to true for frontend-only testing

  constructor() {
    // Initialize demo data on first load
    if (this.isDemoMode && typeof window !== 'undefined') {
      this.initializeDemoData()
    }
  }

  private initializeDemoData() {
    const existingUsers = localStorage.getItem('demo_users')
    if (!existingUsers) {
      // Create a default demo user
      const demoUser = {
        id: '1',
        email: 'demo@causehive.com',
        password: 'demo123', // In real app, this would be hashed
        first_name: 'Demo',
        last_name: 'User',
        location: 'San Francisco, CA',
        phone: '+1 (555) 123-4567',
        occupation: 'Software Developer',
        is_verified: true,
        is_active: true,
        date_joined: new Date().toISOString(),
        last_login: new Date().toISOString(),
        role: 'user',
        donation_preferences: ['education', 'healthcare', 'environment'],
        profile_visibility: {
          show_full_name: true,
          show_location: true,
          show_phone: false,
          show_occupation: true
        }
      }
      
      localStorage.setItem('demo_users', JSON.stringify([demoUser]))
    }
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  }

  private setUserData(user: any): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
  }

  private getUserData(): any | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    return userData ? JSON.parse(userData) : null
  }

  // API request helper
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAccessToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred')
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async signup(userData: SignupData): Promise<ApiResponse<{ message: string }>> {
    if (this.isDemoMode) {
      // Demo mode - simulate successful signup
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Store user data for demo login
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const existingUser = demoUsers.find((user: any) => user.email === userData.email)
      
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        }
      }
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        password: userData.password, // Store password for demo login
        is_verified: true,
        is_active: true,
        date_joined: new Date().toISOString(),
        last_login: new Date().toISOString(),
        role: 'user',
        profile_visibility: {
          show_full_name: true,
          show_location: true,
          show_phone: false,
          show_occupation: true
        }
      }
      
      demoUsers.push(newUser)
      localStorage.setItem('demo_users', JSON.stringify(demoUsers))
      
      return {
        success: true,
        message: 'Account created successfully! You can now sign in.'
      }
    }
    
    return this.request(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    if (this.isDemoMode) {
      // Demo mode - simulate login
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
      
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const user = demoUsers.find((user: any) => user.email === credentials.email)
      
      if (!user) {
        return {
          success: false,
          message: 'No account found with this email address'
        }
      }
      
      // Simple password check for demo mode
      if (user.password !== credentials.password) {
        return {
          success: false,
          message: 'Invalid password'
        }
      }
      
      const authUser: AuthUser = {
        ...user,
        access_token: 'demo_access_token_' + Date.now(),
        refresh_token: 'demo_refresh_token_' + Date.now()
      }
      
      this.setTokens(authUser.access_token, authUser.refresh_token)
      this.setUserData(authUser)
      
      return {
        success: true,
        data: authUser
      }
    }
    
    const response = await this.request<AuthUser>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (response.success && response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token)
      this.setUserData(response.data)
    }

    return response
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      await this.request(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      this.clearTokens()
    }

    return { success: true, message: 'Logged out successfully' }
  }

  async verifyEmail(uid: string, token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`${API_ENDPOINTS.AUTH.VERIFY}/${uid}/${token}/`, {
      method: 'GET',
    })
  }

  async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async requestPasswordReset(data: PasswordResetData): Promise<ApiResponse<{ message: string }>> {
    return this.request(API_ENDPOINTS.AUTH.PASSWORD_RESET, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async confirmPasswordReset(data: PasswordResetConfirmData): Promise<ApiResponse<{ message: string }>> {
    return this.request(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Google OAuth methods
  async getGoogleOAuthURL(): Promise<ApiResponse<{ url: string }>> {
    return this.request(API_ENDPOINTS.GOOGLE.URL, {
      method: 'GET',
    })
  }

  async handleGoogleCallback(code: string): Promise<ApiResponse<GoogleOAuthResponse>> {
    const response = await this.request<GoogleOAuthResponse>(
      `${API_ENDPOINTS.GOOGLE.CALLBACK}/?code=${code}`,
      {
        method: 'GET',
      }
    )

    if (response.success && response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token)
      this.setUserData(response.data.user)
    }

    return response
  }

  // User profile methods
  async getProfile(): Promise<ApiResponse<AuthUser>> {
    return this.request(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
    })
  }

  async updateProfile(data: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    const response = await this.request<AuthUser>(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    if (response.success && response.data) {
      this.setUserData(response.data)
    }

    return response
  }

  // Token refresh
  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return false

    try {
      const response = await fetch(`${this.baseURL}/api/user/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.access) {
          this.setTokens(data.access, refreshToken)
          return true
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }

    this.clearTokens()
    return false
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  getCurrentUser(): AuthUser | null {
    return this.getUserData()
  }

  // Initialize auth state (call this on app start)
  async initializeAuth(): Promise<AuthUser | null> {
    if (!this.isAuthenticated()) return null

    if (this.isDemoMode) {
      // Demo mode - just return stored user data
      const user = this.getCurrentUser()
      return user
    }

    try {
      const user = this.getCurrentUser()
      if (user) return user

      // Try to get fresh user data
      const response = await this.getProfile()
      if (response.success && response.data) {
        this.setUserData(response.data)
        return response.data
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      // Try to refresh token
      const refreshed = await this.refreshToken()
      if (refreshed) {
        try {
          const response = await this.getProfile()
          if (response.success && response.data) {
            this.setUserData(response.data)
            return response.data
          }
        } catch (refreshError) {
          console.error('Profile fetch after refresh failed:', refreshError)
        }
      }
    }

    this.clearTokens()
    return null
  }
}

export const authService = new AuthService()
export default authService
