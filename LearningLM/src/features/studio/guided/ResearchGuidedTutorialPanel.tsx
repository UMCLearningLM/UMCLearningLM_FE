import {
  Check,
  Circle,
  LockKeyhole,
} from 'lucide-react'

import type {
  ResearchGuidedStepStatus,
} from './researchGuidedTutorial'

import {
  RESEARCH_GUIDED_STEPS,
} from './researchGuidedTutorial'

const stageLabelMap = {
  INPUT:
    '입력',
  CONTEXT:
    '컨텍스트',
  PROCESS:
    '프로세스',
  REVIEW:
    '검토',
  OUTPUT:
    '결과',
} as const

interface ResearchGuidedTutorialPanelProps {
  currentStepIndex: number

  currentStatus:
    ResearchGuidedStepStatus

  stepStatuses:
    readonly ResearchGuidedStepStatus[]

  settingsSaved: boolean
  canGoPrevious: boolean
  canGoNext: boolean
  isLastStep: boolean
  isTutorialComplete: boolean

  onPrevious:
    () => void

  onNext:
    () => void

  onComplete:
    () => void
}

interface StatusRowProps {
  complete: boolean
  label: string
}

function StatusRow({
  complete,
  label,
}: StatusRowProps) {
  return (
    <div className="flex items-center gap-[8px]">
      {complete ? (
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white">
          <Check
            size={12}
            strokeWidth={3}
          />
        </span>
      ) : (
        <Circle
          size={18}
          className="shrink-0 text-[#C7C7CF]"
        />
      )}

      <span
        className={[
          'text-[13px] leading-[19px]',
          complete
            ? 'font-bold text-[#52525B]'
            : 'text-[#9A9AA3]',
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  )
}

export function ResearchGuidedTutorialPanel({
  currentStepIndex,
  currentStatus,
  stepStatuses,
  settingsSaved,
  canGoPrevious,
  canGoNext,
  isLastStep,
  isTutorialComplete,
  onPrevious,
  onNext,
  onComplete,
}: ResearchGuidedTutorialPanelProps) {
  const currentStep =
    RESEARCH_GUIDED_STEPS[
      currentStepIndex
    ]

  if (
    !currentStep ||
    !currentStatus
  ) {
    return null
  }

  const currentStepReady =
    currentStatus.complete &&
    settingsSaved

  return (
    <>
      {/* 상단 5단계 진행 Strip */}
      <section className="pointer-events-none absolute left-[18px] right-[18px] top-[18px] z-30">
        <div className="pointer-events-auto flex min-h-[72px] items-center gap-[18px] rounded-[14px] border-[1.5px] border-[#E4E4E7] bg-white px-[20px] shadow-[0_6px_20px_rgba(39,39,42,0.08)]">
          <div className="w-[190px] shrink-0">
            <p className="text-[14px] font-bold text-[#6366F1]">
              AI로 자료조사 흐름
            </p>

            <p className="mt-[2px] text-[12px] text-[#9A9AA3]">
              진행{' '}
              <b className="text-[#52525B]">
                {currentStepIndex + 1}/5
              </b>
            </p>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-center">
            {RESEARCH_GUIDED_STEPS.map(
              (
                step,
                index,
              ) => {
                const isCurrent =
                  index ===
                  currentStepIndex

                const isCompleted =
                  index <
                    currentStepIndex ||
                  stepStatuses[
                    index
                  ]?.complete

                const isLocked =
                  index >
                  currentStepIndex

                return (
                  <div
                    key={step.stage}
                    className="flex items-center"
                  >
                    <div
                      className={[
                        'flex items-center gap-[7px] whitespace-nowrap text-[13px] font-bold',
                        isCurrent
                          ? 'text-[#6366F1]'
                          : isCompleted
                            ? 'text-[#52525B]'
                            : 'text-[#B0B0B8]',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex h-[24px] w-[24px] items-center justify-center rounded-full border text-[11px] font-bold',
                          isCurrent
                            ? 'border-[#6366F1] bg-[#6366F1] text-white'
                            : isCompleted
                              ? 'border-[#CFCFFF] bg-[#EAEBFF] text-[#6366F1]'
                              : 'border-[#E4E4E7] bg-[#F7F7F9] text-[#B0B0B8]',
                        ].join(' ')}
                      >
                        {isCompleted &&
                        !isCurrent ? (
                          <Check
                            size={13}
                            strokeWidth={3}
                          />
                        ) : isLocked ? (
                          <LockKeyhole
                            size={11}
                          />
                        ) : (
                          index + 1
                        )}
                      </span>

                      {
                        stageLabelMap[
                          step.stage
                        ]
                      }
                    </div>

                    {index <
                      RESEARCH_GUIDED_STEPS.length -
                        1 && (
                      <div className="mx-[10px] h-px w-[28px] bg-[#E4E4E7]" />
                    )}
                  </div>
                )
              },
            )}
          </div>
        </div>

        {/* 현재 단계 행동 안내 */}
        <div className="pointer-events-auto mt-[10px] w-[390px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[16px] py-[14px] shadow-[0_6px_18px_rgba(39,39,42,0.08)]">
          <div className="flex items-center justify-between gap-[12px]">
            <div>
              <p className="text-[12px] font-bold text-[#6366F1]">
                {currentStepIndex + 1}
                단계 ·{' '}
                {
                  stageLabelMap[
                    currentStep.stage
                  ]
                }
              </p>

              <h2 className="mt-[2px] text-[17px] font-bold text-[#27272A]">
                {currentStep.title}
              </h2>
            </div>

            <span className="rounded-[7px] bg-[#F0F0FF] px-[9px] py-[5px] text-[11px] font-bold text-[#6366F1]">
              {currentStep.stage}
            </span>
          </div>

          <p className="mt-[10px] text-[13px] font-bold leading-[20px] text-[#52525B]">
            {currentStep.instruction}
          </p>

          <p className="mt-[5px] text-[12px] leading-[18px] text-[#9A9AA3]">
            {currentStep.inspectorHint}
          </p>

          <div className="mt-[12px] space-y-[7px] border-t border-[#EEEEF1] pt-[11px]">
            <StatusRow
              complete={
                currentStatus.placed
              }
              label="필요한 블록 추가"
            />

            <StatusRow
              complete={
                currentStatus.configured
              }
              label="Inspector 설정 완료"
            />

            <StatusRow
              complete={
                settingsSaved
              }
              label="전체 설정 저장"
            />

            {currentStepIndex >
              0 && (
              <StatusRow
                complete={
                  currentStatus.connected
                }
                label="이전 단계 노드와 연결"
              />
            )}
          </div>
        </div>
      </section>

      {/* 하단 단계 이동 Bar */}
      <section className="pointer-events-none absolute bottom-[18px] left-[18px] right-[18px] z-30">
        <div className="pointer-events-auto flex h-[62px] items-center rounded-[14px] border-[1.5px] border-[#E4E4E7] bg-white px-[16px] shadow-[0_6px_20px_rgba(39,39,42,0.08)]">
          <button
            type="button"
            disabled={
              !canGoPrevious
            }
            onClick={
              onPrevious
            }
            className={[
              'flex h-[38px] min-w-[110px] items-center justify-center rounded-[8px] border px-[14px] text-[13px] font-bold',
              canGoPrevious
                ? 'border-[#E4E4E7] bg-white text-[#52525B] hover:bg-[#F7F7F9]'
                : 'cursor-not-allowed border-[#EEEEF1] bg-[#F7F7F9] text-[#C7C7CF]',
            ].join(' ')}
          >
            ← 이전 노드
          </button>

          <p className="ml-[16px] min-w-0 flex-1 truncate text-[13px] text-[#777780]">
            노드 {currentStepIndex + 1}/5 ·{' '}
            {
              stageLabelMap[
                currentStep.stage
              ]
            }
            {' · '}
            {
              currentStepReady
                ? '현재 단계가 완료되었습니다.'
                : currentStatus.complete &&
                    !settingsSaved
                  ? '오른쪽 Inspector의 설정 저장을 눌러주세요.'
                  : '필수 작업을 완료하면 다음 노드로 진행할 수 있습니다.'
            }
          </p>

          {isLastStep ? (
            <button
              type="button"
              disabled={
                !isTutorialComplete
              }
              onClick={
                onComplete
              }
              className={[
                'flex h-[38px] min-w-[128px] items-center justify-center rounded-[8px] px-[16px] text-[13px] font-bold',
                isTutorialComplete
                  ? 'bg-[#6366F1] text-white hover:bg-[#5558DB]'
                  : 'cursor-not-allowed bg-[#E7E7EC] text-[#A5A5AE]',
              ].join(' ')}
            >
              튜토리얼 완료
            </button>
          ) : (
            <button
              type="button"
              disabled={
                !canGoNext
              }
              onClick={
                onNext
              }
              className={[
                'flex h-[38px] min-w-[110px] items-center justify-center rounded-[8px] px-[14px] text-[13px] font-bold',
                canGoNext
                  ? 'bg-[#6366F1] text-white hover:bg-[#5558DB]'
                  : 'cursor-not-allowed bg-[#E7E7EC] text-[#A5A5AE]',
              ].join(' ')}
            >
              다음 노드 →
            </button>
          )}
        </div>
      </section>
    </>
  )
}