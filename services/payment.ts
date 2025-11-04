import { API_BASE_URL, PAYSTACK_CONFIG } from '@/constants'

// PayStack Types
interface PayStackResponse {
  status: boolean
  message: string
  data?: any
}

interface PayStackInitializeResponse extends PayStackResponse {
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface PayStackVerifyResponse extends PayStackResponse {
  data?: {
    status: string
    reference: string
    amount: number
    currency: string
    transaction_date: string
    gateway_response: string
    customer: {
      email: string
      first_name?: string
      last_name?: string
    }
  }
}

// PayStack Inline Types
declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PayStackInlineConfig) => {
        openIframe: () => void
      }
    }
  }
}

interface PayStackInlineConfig {
  key: string
  email: string
  amount: number // in kobo
  currency?: string
  ref?: string
  firstname?: string
  lastname?: string
  phone?: string
  callback: (response: any) => void
  onClose: () => void
  metadata?: Record<string, any>
  channels?: string[]
}

export interface PaymentData {
  amount: number
  currency: 'USD' | 'GHS'
  email: string
  phone?: string
  reference: string
  callback_url: string
  metadata?: Record<string, any>
}

export interface MobileMoneyData extends PaymentData {
  network: 'MTN' | 'VODAFONE' | 'AIRTEL_TIGO'
  phone: string
}

export interface PaymentResponse {
  success: boolean
  message: string
  data?: {
    authorization_url?: string
    access_code?: string
    reference: string
    payment_url?: string
  }
}

export interface PaymentMethod {
  id: string
  name: string
  type: 'mobile_money' | 'card' | 'bank_transfer'
  network?: string
  icon: string
  description: string
  fees: {
    percentage: number
    fixed: number
    currency: 'USD' | 'GHS'
  }
  available_in: string[]
}

// Available payment methods for Ghana market (PayStack)
export const GHANA_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'paystack_card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: '💳',
    description: 'Pay with Visa, Mastercard, Verve, or local cards via PayStack',
    fees: { percentage: 1.95, fixed: 0, currency: 'GHS' },
    available_in: ['GH', 'NG', 'ZA', 'KE']
  },
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    type: 'mobile_money',
    network: 'MTN',
    icon: '📱',
    description: 'Pay with your MTN Mobile Money wallet via PayStack',
    fees: { percentage: 1.5, fixed: 0, currency: 'GHS' },
    available_in: ['GH']
  },
  {
    id: 'vodafone_cash',
    name: 'Vodafone Cash',
    type: 'mobile_money',
    network: 'VODAFONE',
    icon: '📱',
    description: 'Pay with your Vodafone Cash wallet via PayStack',
    fees: { percentage: 1.5, fixed: 0, currency: 'GHS' },
    available_in: ['GH']
  },
  {
    id: 'airtel_tigo_money',
    name: 'AirtelTigo Money',
    type: 'mobile_money',
    network: 'AIRTEL_TIGO',
    icon: '📱',
    description: 'Pay with your AirtelTigo Money wallet via PayStack',
    fees: { percentage: 1.5, fixed: 0, currency: 'GHS' },
    available_in: ['GH']
  },
  {
    id: 'paystack_bank',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    icon: '🏦',
    description: 'Direct bank transfer via PayStack',
    fees: { percentage: 0.5, fixed: 0, currency: 'GHS' },
    available_in: ['GH', 'NG']
  }
]

class PaymentService {
  private baseURL = API_BASE_URL
  private paystackPublicKey = PAYSTACK_CONFIG.PUBLIC_KEY
  private paystackBaseURL = PAYSTACK_CONFIG.BASE_URL

  constructor() {
    // Load PayStack inline script
    if (typeof window !== 'undefined' && !document.querySelector(`script[src="${PAYSTACK_CONFIG.INLINE_SCRIPT}"]`)) {
      const script = document.createElement('script')
      script.src = PAYSTACK_CONFIG.INLINE_SCRIPT
      script.async = true
      document.head.appendChild(script)
    }
  }

  // Calculate payment fees
  calculateFees(amount: number, paymentMethod: PaymentMethod): number {
    const { percentage, fixed } = paymentMethod.fees
    return Math.round((amount * (percentage / 100) + fixed) * 100) / 100
  }

  // Get available payment methods for a country
  getPaymentMethods(countryCode: string = 'GH'): PaymentMethod[] {
    return GHANA_PAYMENT_METHODS.filter(method => 
      method.available_in.includes(countryCode)
    )
  }

  // Validate phone number for mobile money
  validateMobileMoneyPhone(phone: string, network: string): boolean {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Ghana mobile number validation
    if (cleanPhone.startsWith('233')) {
      const localNumber = cleanPhone.substring(3)
      
      switch (network) {
        case 'MTN':
          return /^(24|25|53|54|55|59)\d{7}$/.test(localNumber)
        case 'VODAFONE':
          return /^(20|50)\d{7}$/.test(localNumber)
        case 'AIRTEL_TIGO':
          return /^(26|27|56|57)\d{7}$/.test(localNumber)
        default:
          return false
      }
    }
    
    // Also accept local format (0xxxxxxxxx)
    if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
      const localNumber = cleanPhone.substring(1)
      
      switch (network) {
        case 'MTN':
          return /^(24|25|53|54|55|59)\d{7}$/.test(localNumber)
        case 'VODAFONE':
          return /^(20|50)\d{7}$/.test(localNumber)
        case 'AIRTEL_TIGO':
          return /^(26|27|56|57)\d{7}$/.test(localNumber)
        default:
          return false
      }
    }
    
    return false
  }

  // Format phone number for mobile money
  formatMobileMoneyPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (cleanPhone.startsWith('233')) {
      return cleanPhone
    }
    
    if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
      return '233' + cleanPhone.substring(1)
    }
    
    return cleanPhone
  }

  // Initialize mobile money payment through PayStack
  async initializeMobileMoneyPayment(data: MobileMoneyData): Promise<PaymentResponse> {
    try {
      // Validate phone number
      if (!this.validateMobileMoneyPhone(data.phone, data.network)) {
        return {
          success: false,
          message: `Invalid ${data.network} phone number. Please check and try again.`
        }
      }

      // Convert amount to kobo (PayStack uses kobo for NGN, pesewas for GHS)
      const amountInMinorUnit = Math.round(data.amount * 100)
      
      // Map network to PayStack channel
      const channelMap = {
        'MTN': 'mobile_money',
        'VODAFONE': 'mobile_money', 
        'AIRTEL_TIGO': 'mobile_money'
      }

      // Use PayStack Transaction Initialize API
      const paystackData = {
        email: data.email,
        amount: amountInMinorUnit,
        currency: data.currency,
        reference: data.reference,
        callback_url: data.callback_url,
        channels: [channelMap[data.network]],
        metadata: {
          ...data.metadata,
          payment_method: 'mobile_money',
          network: data.network,
          phone: this.formatMobileMoneyPhone(data.phone)
        }
      }

      const response = await fetch(`${this.paystackBaseURL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackPublicKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paystackData)
      })

      const result: PayStackInitializeResponse = await response.json()
      
      if (result.status && result.data) {
        return {
          success: true,
          message: 'Mobile Money payment initialized successfully',
          data: {
            authorization_url: result.data.authorization_url,
            access_code: result.data.access_code,
            reference: result.data.reference,
            payment_url: result.data.authorization_url
          }
        }
      } else {
        return {
          success: false,
          message: result.message || 'Failed to initialize mobile money payment'
        }
      }
    } catch (error) {
      console.error('Mobile Money payment initialization failed:', error)
      return {
        success: false,
        message: 'Failed to initialize mobile money payment. Please try again.'
      }
    }
  }

  // Initialize card payment with PayStack
  async initializeCardPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      // Convert amount to kobo/pesewas (minor units)
      const amountInMinorUnit = Math.round(data.amount * 100)
      
      // Use PayStack Transaction Initialize API
      const paystackData = {
        email: data.email,
        amount: amountInMinorUnit,
        currency: data.currency,
        reference: data.reference,
        callback_url: data.callback_url,
        channels: ['card', 'bank', 'ussd', 'qr'],
        metadata: {
          ...data.metadata,
          payment_method: 'card'
        }
      }

      const response = await fetch(`${this.paystackBaseURL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackPublicKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paystackData)
      })

      const result: PayStackInitializeResponse = await response.json()
      
      if (result.status && result.data) {
        return {
          success: true,
          message: 'Redirecting to secure payment page...',
          data: {
            authorization_url: result.data.authorization_url,
            access_code: result.data.access_code,
            reference: result.data.reference
          }
        }
      } else {
        return {
          success: false,
          message: result.message || 'Failed to initialize card payment'
        }
      }
    } catch (error) {
      console.error('Card payment initialization failed:', error)
      return {
        success: false,
        message: 'Failed to initialize card payment. Please try again.'
      }
    }
  }

  // Initialize PayStack Inline (for embedded checkout)
  initializeInlinePayment(
    data: PaymentData, 
    onSuccess: (response: any) => void,
    onClose?: () => void
  ): Promise<PaymentResponse> {
    return new Promise((resolve) => {
      if (!window.PaystackPop) {
        resolve({
          success: false,
          message: 'PayStack script not loaded. Please try again.'
        })
        return
      }

      try {
        // Convert amount to kobo/pesewas
        const amountInMinorUnit = Math.round(data.amount * 100)
        
        const config: PayStackInlineConfig = {
          key: this.paystackPublicKey,
          email: data.email,
          amount: amountInMinorUnit,
          currency: data.currency,
          ref: data.reference,
          phone: data.phone,
          callback: (response) => {
            if (response.status === 'success') {
              onSuccess(response)
              resolve({
                success: true,
                message: 'Payment completed successfully',
                data: {
                  reference: response.reference,
                  transaction: response.transaction
                }
              })
            }
          },
          onClose: () => {
            onClose?.()
            resolve({
              success: false,
              message: 'Payment was cancelled'
            })
          },
          metadata: data.metadata,
          channels: ['card', 'bank', 'ussd', 'mobile_money']
        }

        const handler = window.PaystackPop.setup(config)
        handler.openIframe()
        
      } catch (error) {
        console.error('PayStack inline initialization failed:', error)
        resolve({
          success: false,
          message: 'Failed to initialize payment. Please try again.'
        })
      }
    })
  }

  // Verify payment status with PayStack
  async verifyPayment(reference: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.paystackBaseURL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackPublicKey}`,
          'Content-Type': 'application/json'
        }
      })

      const result: PayStackVerifyResponse = await response.json()
      
      if (result.status && result.data) {
        const isSuccessful = result.data.status === 'success'
        
        return {
          success: isSuccessful,
          message: isSuccessful 
            ? 'Payment completed successfully!' 
            : `Payment ${result.data.status}. ${result.data.gateway_response || 'Please try again.'}`,
          data: {
            reference: result.data.reference,
            amount: result.data.amount / 100, // Convert from kobo/pesewas back to main unit
            currency: result.data.currency,
            status: result.data.status,
            transaction_date: result.data.transaction_date,
            customer: result.data.customer
          }
        }
      } else {
        return {
          success: false,
          message: result.message || 'Payment verification failed'
        }
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      return {
        success: false,
        message: 'Failed to verify payment status. Please contact support.'
      }
    }
  }

  // Generate payment reference
  generateReference(prefix: string = 'CH'): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}_${timestamp}_${random}`
  }

  // Get payment method by ID
  getPaymentMethod(id: string): PaymentMethod | undefined {
    return GHANA_PAYMENT_METHODS.find(method => method.id === id)
  }

  // Check if payment method is available in country
  isPaymentMethodAvailable(methodId: string, countryCode: string = 'GH'): boolean {
    const method = this.getPaymentMethod(methodId)
    return method ? method.available_in.includes(countryCode) : false
  }
}

export const paymentService = new PaymentService()
export default paymentService
