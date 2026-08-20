import type {
  MouseEvent,
  ReactNode,
} from 'react'

export interface RadioOption {
  label: ReactNode
  value: string
  description?: ReactNode
  disabled?: boolean
}

interface RadioProps {
  name: string
  options: RadioOption[]
  title?: ReactNode
  code?: ReactNode
  description?: ReactNode
  value?: string
  onChange?: (
    value: string,
  ) => void
  disabled?: boolean
  orientation?:
    | 'horizontal'
    | 'vertical'
  className?: string
}

/**
 * Studio Inspector에서 기존 native radio + sr-only 조합을 클릭하면
 * 브라우저가 숨겨진 input에 focus를 이동시키면서 overflow 컨테이너의
 * scrollTop을 강제로 변경하는 문제가 있었습니다.
 *
 * 선택 컨트롤을 visible button + ARIA radio로 구성해
 * 숨겨진 input focus 자체를 없앱니다.
 *
 * mouse down에서는 브라우저의 자동 focus도 막습니다.
 * 키보드 사용자는 Tab으로 버튼에 접근하고 Enter/Space로 선택할 수 있습니다.
 */
export function Radio({
  name,
  options,
  title,
  code,
  description,
  value,
  onChange,
  disabled = false,
  orientation = 'vertical',
  className = '',
}: RadioProps) {
  const handleMouseDown = (
    event:
      MouseEvent<HTMLButtonElement>,
  ) => {
    /*
     * 마우스로 선택할 때 focus 이동 때문에
     * 스크롤 컨테이너가 재배치되는 것을 막습니다.
     *
     * preventDefault는 click 이벤트를 막지 않으므로
     * onClick의 선택 처리는 그대로 실행됩니다.
     */
    event.preventDefault()
  }

  return (
    <section
      className={
        className
      }
    >
      {(title ||
        code ||
        description) && (
        <header className="mb-4">
          <div className="flex items-start justify-between gap-4">
            {title && (
              <h3 className="text-base font-bold tracking-[-0.03em] text-slate-800">
                {title}
              </h3>
            )}

            {code && (
              <span className="shrink-0 text-xs font-medium text-slate-400">
                {code}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-2 text-xs leading-5 text-slate-400">
              {description}
            </p>
          )}
        </header>
      )}

      <div
        role="radiogroup"
        aria-label={
          typeof title ===
          'string'
            ? title
            : name
        }
        className={
          orientation ===
          'horizontal'
            ? 'flex flex-wrap gap-2'
            : 'space-y-2'
        }
      >
        {options.map(
          (
            option,
          ) => {
            const isDisabled =
              disabled ||
              option.disabled

            const isSelected =
              value ===
              option.value

            return (
              <button
                key={
                  option.value
                }
                type="button"
                role="radio"
                aria-checked={
                  isSelected
                }
                disabled={
                  isDisabled
                }
                data-radio-group={
                  name
                }
                data-radio-value={
                  option.value
                }
                onMouseDown={
                  handleMouseDown
                }
                onClick={() => {
                  if (
                    isDisabled
                  ) {
                    return
                  }

                  onChange?.(
                    option.value,
                  )
                }}
                className={[
                  'flex min-h-[76px] items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-left text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-100',
                  orientation ===
                  'horizontal'
                    ? 'min-w-36 flex-1'
                    : 'w-full',
                  isSelected
                    ? 'border-indigo-500'
                    : 'border-slate-200 hover:border-indigo-200',
                  isDisabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                ].join(
                  ' ',
                )}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition',
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-slate-300 bg-white',
                    isDisabled
                      ? 'opacity-50'
                      : '',
                  ].join(
                    ' ',
                  )}
                >
                  <span
                    className={[
                      'h-1.5 w-1.5 rounded-full bg-white transition',
                      isSelected
                        ? 'scale-100'
                        : 'scale-0',
                    ].join(
                      ' ',
                    )}
                  />
                </span>

                <span className="min-w-0">
                  <span className="block font-bold text-slate-700">
                    {
                      option.label
                    }
                  </span>

                  {option.description && (
                    <span className="mt-1 block text-xs leading-5 text-slate-400">
                      {
                        option.description
                      }
                    </span>
                  )}
                </span>
              </button>
            )
          },
        )}
      </div>
    </section>
  )
}