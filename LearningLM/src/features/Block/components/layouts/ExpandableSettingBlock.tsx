import { Check, ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { StatusBadge, type StatusBadgeVariant } from '../../../../components/ui/StatusBadge'
import { Typography } from '../ui/Typography'
import {
  BlockTag,
  type SettingBlockTagCounts,
} from '../ui/BlockTag'

export interface SettingBlockTag {
  label: string
  count: number
  variant: StatusBadgeVariant
}

interface ExpandableSettingBlockProps {
  title: string
  code: string
  stage: string
  description: string
  icon: ReactNode
  tags?: SettingBlockTag[]
  tagCounts?: SettingBlockTagCounts
  category?: string // Core / Recommended / Optional
  required?: boolean //필수 블록?
  validationMessage?: string
  defaultOpen?: boolean // 처음렌더링될때 기본적으로 열려 있을지 결정
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function ExpandableSettingBlock({
  title,
  code,
  stage,
  description,
  icon,
  tags = [],
  tagCounts,
  category = 'CORE',
  required = false,
  validationMessage,
  defaultOpen = false,
  children,
  footer,
  className = '',
}: ExpandableSettingBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <section
      className={[
        'w-[550px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
        className,
      ].join(' ')}
    >
      <button
        type="button"
        className="block w-full px-6 py-8 text-left transition hover:bg-slate-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex flex-col gap-[17px]">
          <span className="flex items-start justify-between gap-4">
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-600 text-white">
                {icon}
              </span>
              <span className="flex min-w-0 items-baseline gap-1">
                <Typography
                  as="span"
                  variant="title4"
                  className="truncate text-slate-950"
                >
                  {title}
                </Typography>
                <Typography
                  as="span"
                  variant="caption"
                  className="shrink-0 font-medium text-slate-400"
                >
                  {code} · {stage}
                </Typography>
              </span>
            </span>

            <span
              className={[
                'shrink-0 rounded-lg border-2 px-[10px] py-[5px] text-xs font-black leading-[15px]',
                category === 'RECOMMENDED'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-500'
                  : 'border-[#6366F1] bg-[#6366F1] text-white',
              ].join(' ')}
            >
              {category}
            </span>
          </span>

          <Typography as="span" variant="body2" className="block text-slate-600">
            {description}
          </Typography>

          {tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <StatusBadge
                  key={tag.label}
                  variant={tag.variant}
                >
                  {tag.label} {tag.count}
                </StatusBadge>
              ))}
            </span>
          )}

          {tagCounts && <BlockTag counts={tagCounts} />}
        </span>
      </button>

      {isOpen && (
        <div id={contentId} className="border-t border-slate-200">
          <div className="px-6 py-5">
            <div className="setting-block-fields mx-auto w-[450px] [&>div>:not(:last-child)]:!mb-[35px]">
              <button
                type="button"
                className={[
                  'flex w-full items-center justify-between gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                  validationMessage ? 'mb-[13px]' : 'mb-4',
                ].join(' ')}
                onClick={() => setIsOpen(false)}
                aria-label={`${title} 설정 접기`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] bg-indigo-500 text-white">
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <Typography
                    as="h2"
                    variant="body1"
                    weight="bold"
                    className="truncate text-slate-900"
                  >
                    {title}
                  </Typography>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-indigo-500">
                  {required ? '필수' : '선택'}
                  <ChevronDown size={13} className="text-slate-400" />
                </span>
              </button>
              {validationMessage && (
                <Typography
                  variant="body3"
                  className="mb-4 text-rose-500"
                >
                  {validationMessage}
                </Typography>
              )}
              {children}
            </div>
          </div>

          {footer && <div className="border-t border-slate-200 px-6 py-3">{footer}</div>}
        </div>
      )}
    </section>
  )
}
