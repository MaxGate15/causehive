'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Cause } from '@/types'

export interface DonationCartItem {
  cause: Cause
  amount: number
  currency: 'USD' | 'GHS'
  is_anonymous: boolean
  donor_message?: string
}

interface DonationCartContextType {
  items: DonationCartItem[]
  itemCount: number
  totalAmount: number
  addItem: (cause: Cause, amount: number, currency: 'USD' | 'GHS', isAnonymous?: boolean, message?: string) => void
  removeItem: (causeId: string) => void
  updateItem: (causeId: string, updates: Partial<Omit<DonationCartItem, 'cause'>>) => void
  clearCart: () => void
  isInCart: (causeId: string) => boolean
  getCartItem: (causeId: string) => DonationCartItem | undefined
}

const DonationCartContext = createContext<DonationCartContextType | undefined>(undefined)

const STORAGE_KEY = 'causehive_donation_cart'

interface DonationCartProviderProps {
  children: ReactNode
}

export const DonationCartProvider: React.FC<DonationCartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<DonationCartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedItems = JSON.parse(saved)
        setItems(parsedItems)
      }
    } catch (error) {
      console.error('Failed to load donation cart:', error)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save donation cart:', error)
    }
  }, [items])

  const addItem = (
    cause: Cause, 
    amount: number, 
    currency: 'USD' | 'GHS', 
    isAnonymous: boolean = false,
    message?: string
  ) => {
    setItems(prev => {
      // Check if item already exists
      const existingIndex = prev.findIndex(item => item.cause.id === cause.id)
      
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount,
          currency,
          is_anonymous: isAnonymous,
          donor_message: message
        }
        return updated
      } else {
        // Add new item
        return [...prev, {
          cause,
          amount,
          currency,
          is_anonymous: isAnonymous,
          donor_message: message
        }]
      }
    })
  }

  const removeItem = (causeId: string) => {
    setItems(prev => prev.filter(item => item.cause.id !== causeId))
  }

  const updateItem = (causeId: string, updates: Partial<Omit<DonationCartItem, 'cause'>>) => {
    setItems(prev => prev.map(item => 
      item.cause.id === causeId 
        ? { ...item, ...updates }
        : item
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (causeId: string) => {
    return items.some(item => item.cause.id === causeId)
  }

  const getCartItem = (causeId: string) => {
    return items.find(item => item.cause.id === causeId)
  }

  // Computed values
  const itemCount = items.length
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const value: DonationCartContextType = {
    items,
    itemCount,
    totalAmount,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    isInCart,
    getCartItem
  }

  return (
    <DonationCartContext.Provider value={value}>
      {children}
    </DonationCartContext.Provider>
  )
}

export const useDonationCart = (): DonationCartContextType => {
  const context = useContext(DonationCartContext)
  if (context === undefined) {
    throw new Error('useDonationCart must be used within a DonationCartProvider')
  }
  return context
}

export default DonationCartContext
