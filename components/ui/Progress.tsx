import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, className, showLabel = false, label, size = 'md', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    }

    return (
      <div className="w-full">
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-2">
            {label && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}
            {showLabel && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {percentage.toFixed(1)}%
              </span>
            )}
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = "Progress"

export default Progress
