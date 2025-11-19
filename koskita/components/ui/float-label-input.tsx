'use client'

import { useState, forwardRef, InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface FloatLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const FloatLabelInput = forwardRef<HTMLInputElement, FloatLabelInputProps>(
  ({ label, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setHasValue(!!e.target.value)
            props.onChange?.(e)
          }}
          className={`peer w-full pt-6 pb-2 px-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 ${className}`}
          {...props}
        />
        {label && (
          <motion.label
            animate={{
              y: isFocused || hasValue ? -20 : 0,
              fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
              color: isFocused ? '#6366F1' : '#64748B',
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 top-4 origin-top-left pointer-events-none"
          >
            {label}
          </motion.label>
        )}
      </div>
    )
  }
)

FloatLabelInput.displayName = 'FloatLabelInput'