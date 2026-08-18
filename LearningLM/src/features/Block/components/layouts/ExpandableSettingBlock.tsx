import {
  Check,
  ChevronDown,
} from 'lucide-react'

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react'

import {
  StatusBadge,
  type StatusBadgeVariant,
} from '../../../../components/ui/StatusBadge'

import {
  Typography,
} from '../ui/Typography'

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
  category?: string
  required?: boolean
  validationMessage?: string
  defaultOpen?: boolean
  children: ReactNode
  footer?: ReactNode
  className?: string
}

interface ExpandableSettingBlockEnvironment {
  embeddedInStudioInspector: boolean
}

const ExpandableSettingBlockEnvironmentContext =
  createContext<ExpandableSettingBlockEnvironment>({
    embeddedInStudioInspector:
      false,
  })

interface ExpandableSettingBlockEnvironmentProviderProps {
  embeddedInStudioInspector?: boolean
  children: ReactNode
}

/**
 * Studio Inspector 안에서는 Stdio_create1.tsx의 slot 카드가
 * 이미 펼침/접힘을 담당합니다.
 *
 * 이 Provider를 사용하면 ExpandableSettingBlock이 내부에서
 * 또 하나의 accordion을 만들지 않고 항상 펼쳐진 상세 카드로 동작합니다.
 *
 * Dev/Test 페이지나 단독 Block 화면에서는 Provider가 없으므로
 * 기존 ExpandableSettingBlock 동작을 그대로 유지합니다.
 */
export function ExpandableSettingBlockEnvironmentProvider({
  embeddedInStudioInspector =
    false,

  children,
}: ExpandableSettingBlockEnvironmentProviderProps) {
  return (
    <ExpandableSettingBlockEnvironmentContext.Provider
      value={{
        embeddedInStudioInspector,
      }}
    >
      {children}
    </ExpandableSettingBlockEnvironmentContext.Provider>
  )
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
  const {
    embeddedInStudioInspector,
  } =
    useContext(
      ExpandableSettingBlockEnvironmentContext,
    )

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(
      defaultOpen,
    )

  const contentId =
    useId()

  /*
   * Studio에서는 바깥 slot 카드가 이미 열림 상태를 관리하므로
   * 이 카드의 상세 내용은 항상 열린 상태로 둡니다.
   */
  const contentVisible =
    embeddedInStudioInspector ||
    isOpen

  const headerContent = (
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

            category ===
            'RECOMMENDED'
              ? 'border-emerald-400 bg-emerald-50 text-emerald-500'
              : 'border-[#6366F1] bg-[#6366F1] text-white',
          ].join(
            ' ',
          )}
        >
          {category}
        </span>
      </span>

      <Typography
        as="span"
        variant="body2"
        className="block text-slate-600"
      >
        {description}
      </Typography>

      {tags.length >
        0 && (
        <span className="flex flex-wrap gap-1.5">
          {tags.map(
            (
              tag,
            ) => (
              <StatusBadge
                key={
                  tag.label
                }
                variant={
                  tag.variant
                }
              >
                {tag.label}{' '}
                {tag.count}
              </StatusBadge>
            ),
          )}
        </span>
      )}

      {tagCounts && (
        <BlockTag
          counts={
            tagCounts
          }
        />
      )}
    </span>
  )

  return (
    <section
      className={[
        'w-[550px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',

        embeddedInStudioInspector
          ? '[overflow-anchor:none]'
          : '',

        className,
      ].join(
        ' ',
      )}
    >
      {embeddedInStudioInspector ? (
        /*
         * Studio 안에서는 이 헤더 자체를 버튼으로 만들지 않습니다.
         * 바깥 slot 카드의 화살표가 유일한 펼침/접힘 컨트롤입니다.
         */
        <div className="block w-full px-6 py-6 text-left">
          {headerContent}
        </div>
      ) : (
        <button
          type="button"
          className="block w-full px-6 py-8 text-left transition hover:bg-slate-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
          aria-expanded={
            isOpen
          }
          aria-controls={
            contentId
          }
          onClick={() =>
            setIsOpen(
              (
                open,
              ) =>
                !open,
            )
          }
        >
          {headerContent}
        </button>
      )}

      {contentVisible && (
        <div
          id={
            contentId
          }
          className="border-t border-slate-200 [overflow-anchor:none]"
        >
          <div className="px-6 py-5">
            <div className="setting-block-fields mx-auto w-[450px] [&>div>:not(:last-child)]:!mb-[35px]">
              {!embeddedInStudioInspector && (
                <button
                  type="button"
                  className={[
                    'flex w-full items-center justify-between gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',

                    validationMessage
                      ? 'mb-[13px]'
                      : 'mb-4',
                  ].join(
                    ' ',
                  )}
                  onClick={() =>
                    setIsOpen(
                      false,
                    )
                  }
                  aria-label={`${title} 설정 접기`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] bg-indigo-500 text-white">
                      <Check
                        size={
                          12
                        }
                        strokeWidth={
                          3
                        }
                        aria-hidden="true"
                      />
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
                    {required
                      ? '필수'
                      : '선택'}

                    <ChevronDown
                      size={
                        13
                      }
                      className="text-slate-400"
                    />
                  </span>
                </button>
              )}

              {embeddedInStudioInspector && (
                <div className={[
                  'mb-4 flex items-center justify-between gap-3',

                  validationMessage
                    ? 'mb-[13px]'
                    : '',
                ].join(
                  ' ',
                )}>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] bg-indigo-500 text-white">
                      <Check
                        size={
                          12
                        }
                        strokeWidth={
                          3
                        }
                        aria-hidden="true"
                      />
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

                  <span className="shrink-0 text-xs font-bold text-indigo-500">
                    {required
                      ? '필수'
                      : '선택'}
                  </span>
                </div>
              )}

              {validationMessage && (
                <Typography
                  variant="body3"
                  className="mb-4 text-rose-500"
                >
                  {
                    validationMessage
                  }
                </Typography>
              )}

              {children}
            </div>
          </div>
          {footer &&
            !embeddedInStudioInspector && (
              <div className="border-t border-slate-200 px-6 py-3">
                {footer}
              </div>
            )}
        </div>
      )}
    </section>
  )
}