import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-500 text-white shadow-sm hover:bg-indigo-600 active:bg-indigo-700',
  secondary:
    'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100',
  ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  link: 'h-auto rounded-none p-0 text-indigo-500 hover:text-indigo-600',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isLink = variant === 'link'

  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        isLink ? '' : 'rounded-xl',
        isLink ? '' : sizeClass[size],
        variantClass[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
