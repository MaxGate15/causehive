import React from 'react'
import { cn } from '@/lib/utils'
import { InputProps } from '@/types'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', placeholder, value, onChange, error, disabled = false, required = false, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "border-gray-300 dark:border-gray-600",
            "placeholder-gray-500 dark:placeholder-gray-400",
            error && "border-red-500 focus:ring-red-500",
            disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700",
            className
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
