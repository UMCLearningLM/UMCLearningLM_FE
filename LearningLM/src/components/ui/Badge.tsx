import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'gray' | 'green' | 'blue' | 'purple' | 'pink'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  children: ReactNode
}

const variantClass: Record<BadgeVariant, string> = {
  gray: 'bg-slate-100 text-slate-600',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-indigo-50 text-indigo-600',
  pink: 'bg-rose-50 text-rose-600',
}

const sizeClass: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
}

export function Badge({
  variant = 'gray',
  size = 'sm',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-lg font-semibold',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
