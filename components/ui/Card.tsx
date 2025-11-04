import React from 'react'
import { cn } from '@/lib/utils'
import { BaseComponentProps } from '@/types'

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: "bg-white dark:bg-gray-800",
      outlined: "bg-transparent border-2 border-gray-200 dark:border-gray-700",
      elevated: "bg-white dark:bg-gray-800 shadow-lg"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pb-0", className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold text-gray-900 dark:text-white", className)}
      {...props}
    >
      {children}
    </h3>
  )
)

CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 dark:text-gray-400 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  )
)

CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
