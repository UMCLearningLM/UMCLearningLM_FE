import { ArrowLeft, Blocks, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import {
  getTutorialById,
  type Tutorial,
  type TutorialBlock,
  type TutorialLevel,
} from '../../features/tutorial/data/tutorials'
import {
  getTutorialDetail,
  saveTutorial,
  deleteFlow,
  deleteTutorialProgress,
  createGuidedFlow,
  startTutorial,
  type TutorialDetailProgress,
} from '../../api/tutorial'
import {
  createFlow,
} from '../api/StudioApi'

type TutorialDetailViewModel = Tutorial & {
  progress: TutorialDetailProgress | null
}

const levelClassMap = {
  입문: 'bg-emerald-50 text-emerald-600',
  기초: 'bg-blue-50 text-blue-600',
  응용: 'bg-rose-50 text-rose-600',
}

const blockColorClassMap: Record<TutorialBlock['color'], string> = {
  blue: 'bg-blue-500',
  teal: 'bg-teal-600',
  green: 'bg-emerald-600',
}

const flowLabelClassMap: Record<TutorialBlock['color'], string> = {
  blue: 'border-blue-300 bg-slate-50 text-slate-700',
  teal: 'border-teal-300 bg-slate-50 text-slate-700',
  green: 'border-emerald-300 bg-slate-50 text-slate-700',
}

function FlowStep({
  label,
  color,
}: {
  label: string
  color: TutorialBlock['color']
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black shadow-sm',
        flowLabelClassMap[color],
      ].join(' ')}
    >
      <span
        className={[
          'h-2.5 w-2.5 rounded-sm',
          blockColorClassMap[color],
        ].join(' ')}
      />
      {label}
    </span>
  )
}

function BlockCard({ block }: { block: TutorialBlock }) {
  return (
    <Card className="px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              'h-3 w-3 rounded-sm',
              blockColorClassMap[block.color],
            ].join(' ')}
          />
          <h3 className="text-xl font-black text-slate-950">
            {block.title}
          </h3>
        </div>

        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
          {block.type}
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-600">
        {block.description}
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400">
        <span className="mr-2 text-slate-300">
          왜 필요?
        </span>
        {block.why}
      </div>
    </Card>
  )
}

export function TutorialDetailPage() {
  const params = useParams()
  const navigate = useNavigate()

  // /official-tutorials/:tutorialId 경로의 값을 숫자로 변환한다.
  const tutorialId = Number(params.tutorialId)

  // API 데이터, 로딩 여부, 오류 메시지를 각각 관리한다.
  const [tutorial, setTutorial] =
    useState<TutorialDetailViewModel | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [isSaving, setIsSaving] =
    useState(false)

  const [isRemoving, setIsRemoving] =
    useState(false)

  const [saveMessage, setSaveMessage] =
    useState('')

  const [isStarting, setIsStarting] =
    useState(false)

  const [startMessage, setStartMessage] =
    useState('')

  useEffect(() => {
    // 숫자가 아니거나 0 이하인 ID는 서버에 요청하지 않는다.
    if (
      !Number.isInteger(tutorialId) ||
      tutorialId <= 0
    ) {
      setError('올바르지 않은 튜토리얼 번호입니다.')
      setIsLoading(false)
      return
    }

    // 화면을 벗어난 뒤 비동기 응답이 state를 변경하지 않도록 확인한다.
    let isMounted = true

    // 현재 URL의 ID에 해당하는 튜토리얼 상세 API를 호출한다.
    getTutorialDetail(tutorialId)
      .then((result) => {
        if (!isMounted) {
          return
        }

        // 백엔드 난이도 코드를 기존 카드 UI의 한글 값으로 변환한다.
        const levelMap: Record<
          string,
          TutorialLevel
        > = {
          BEGINNER: '입문',
          BASIC: '기초',
          ADVANCED: '응용',
        }

        // API에는 색상 정보가 없으므로 흐름 순서에 따라 UI 색상을 반복 적용한다.
        const colors: TutorialBlock['color'][] = [
          'blue',
          'teal',
          'green',
        ]

        // API result를 기존 상세 화면에서 사용하는 Tutorial 형태로 변환한다.
        setTutorial({
          id: result.tutorialId,

          title: result.title,

          description:
            result.summary,

          level:
            levelMap[
              result.difficulty
            ] ?? '입문',

          categories:
            result.categories.map(
              (category) =>
                category.name,
            ) as Tutorial['categories'],

          blockCount:
            result.blockCount,

          estimatedMinutes:
            result.estimatedMinutes,

          useCases:
            result.useCases,

          requiredConcepts:
            result.requiredConcepts,

          // blockFlow 문자열 목록을 화면의 단계 컴포넌트 형식으로 변환한다.
          flowSteps:
            result.blockFlow.map(
              (label, index) => ({
                id: `${index}-${label}`,
                label,
                color:
                  colors[
                    index %
                      colors.length
                  ],
              }),
            ),

          // blocks 응답 필드를 기존 BlockCard의 필드명에 맞춘다.
          blocks:
            result.blocks.map(
              (block, index) => ({
                id: String(
                  block.blockId,
                ),

                title:
                  block.name,

                type:
                  block.stage,

                description:
                  block.description,

                why:
                  block.reason,

                color:
                  colors[
                    index %
                      colors.length
                  ],
              }),
            ),

          exampleInput:
            result.example.input,

          // 문자열 예시 결과를 기존 줄 단위 UI에서 사용할 배열로 바꾼다.
          exampleResult:
            result.example.result
              .split('\n')
              .filter(Boolean),

          resultSource:
            result.example.source ===
            'TEMPLATE'
              ? 'Template'
              : 'AI',

          // API 함수에서 토큰이 있는 경우에만 유지한 진행 정보를 화면 모델에 반영한다.
          progress:
            result.progress,
        })
      })
      .catch(
        (
          requestError:
            unknown,
        ) => {
          if (!isMounted) {
            return
          }

          /*
           * 제출용 메인 공식 튜토리얼은
           * BE 상세 데이터가 없더라도
           * FE에 이미 정의된 데이터를 사용합니다.
           */
          const fallbackTutorial =
            tutorialId === 1
              ? getTutorialById(
                  1,
                )
              : undefined

          if (fallbackTutorial) {
            setTutorial({
              ...fallbackTutorial,

              progress:
                null,
            })

            setError('')

            return
          }

          setError(
            requestError instanceof
              Error
              ? requestError.message
              : '튜토리얼 상세 정보를 불러오지 못했습니다.',
          )
        },
      )
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [tutorialId])

  // 저장 버튼 클릭 시 인증을 확인하고 저장 전용 API를 호출한다.
  const handleSaveTutorial =
    async () => {
      const accessToken =
        localStorage.getItem(
          'accessToken',
        )

      if (!accessToken) {
        window.alert(
          '로그인 후 튜토리얼을 저장할 수 있습니다.',
        )
        return
      }

      setIsSaving(true)
      setSaveMessage('')

      try {
        const progress =
          await saveTutorial(
            tutorialId,
          )

        // 저장 성공 응답의 NOT_STARTED 진행 정보를 현재 상세 화면에 반영한다.
        setTutorial(
          (previous) =>
            previous
              ? {
                  ...previous,
                  progress,
                }
              : previous,
        )

        setSaveMessage(
          '튜토리얼을 내 저장소에 저장했습니다.',
        )
      } catch (
        requestError
      ) {
        setSaveMessage(
          requestError instanceof
            Error
            ? requestError.message
            : '튜토리얼을 저장하지 못했습니다.',
        )
      } finally {
        setIsSaving(false)
      }
    }

  // 진행 상태에 따라 연결된 flow를 먼저 삭제한 뒤 저장 기록을 해제한다.
  const handleRemoveTutorial =
    async () => {
      if (
        !tutorial?.progress
      ) {
        return
      }

      const shouldRemove =
        window.confirm(
          '저장을 해제하면 튜토리얼 진행 기록도 함께 삭제됩니다. 해제할까요?',
        )

      if (!shouldRemove) {
        return
      }

      setIsRemoving(true)
      setSaveMessage('')

      try {
        const {
          status,
          flowId,
        } =
          tutorial.progress

        // 시작했거나 완료한 학습은 접근 불가능한 flow가 남지 않도록 먼저 삭제한다.
        if (
          (
            status ===
              'IN_PROGRESS' ||
            status ===
              'COMPLETED'
          ) &&
          flowId
        ) {
          await deleteFlow(
            flowId,
          )
        }

        // flow 삭제가 성공했거나 NOT_STARTED인 경우에만 진행 기록을 삭제한다.
        await deleteTutorialProgress(
          tutorialId,
        )

        setTutorial(
          (previous) =>
            previous
              ? {
                  ...previous,
                  progress:
                    null,
                }
              : previous,
        )

        setSaveMessage(
          '튜토리얼 저장을 해제했습니다.',
        )
      } catch (
        requestError
      ) {
        setSaveMessage(
          requestError instanceof
            Error
            ? requestError.message
            : '튜토리얼 저장을 해제하지 못했습니다.',
        )
      } finally {
        setIsRemoving(false)
      }
    }

  // 시작 버튼 한 번으로 가이드 작업 공간 생성과 학습 시작을 순서대로 처리한다.

  /**
   * 공식 튜토리얼에서 사용하는 Studio 진입 경로입니다.
   *
   * Studio 내부 mode 타입은 lowercase `guided`를 사용하므로
   * URL과 navigation state를 동일하게 맞춥니다.
   */
  const openGuidedStudio = (
    flowId: number,
  ) => {
    navigate(
      `/studio/create?flowId=${flowId}&mode=guided&tutorialId=${tutorialId}`,
      {
        state: {
          flowId,

          tutorialId,

          mode:
            'guided',
        },
      },
    )
  }

  // 시작 버튼 한 번으로 가이드 작업 공간 생성과 학습 시작을 처리한다.
  const handleStartTutorial =
    async () => {
      const accessToken =
        localStorage.getItem(
          'accessToken',
        ) ??
        sessionStorage.getItem(
          'accessToken',
        )

      if (!accessToken) {
        window.alert(
          '로그인 후 튜토리얼을 시작할 수 있습니다.',
        )
        return
      }

      /*
       * 이미 진행 중이고 기존 Flow가 있다면
       * 새 Flow를 만들지 않고 그대로 이어서 엽니다.
       */
      if (
        tutorial?.progress
          ?.status ===
          'IN_PROGRESS' &&
        tutorial.progress.flowId
      ) {
        openGuidedStudio(
          tutorial.progress.flowId,
        )

        return
      }

      setIsStarting(
        true,
      )

      setStartMessage(
        '',
      )

      try {
        let flowId:
          number

        let serverGuidedFlow =
          true

        try {
          /*
           * 우선 정식 API 흐름을 사용합니다.
           *
           * POST /flows
           * mode = GUIDED
           * tutorialId = 현재 튜토리얼
           */
          const flow =
            await createGuidedFlow(
              tutorialId,
            )

          flowId =
            flow.flowId
        } catch (
          guidedFlowError
        ) {
          /*
           * 제출용 메인 시나리오인 tutorialId=1만
           * FE fallback을 허용합니다.
           *
           * 다른 튜토리얼 오류까지 조용히 우회하지 않습니다.
           */
          if (
            tutorialId !==
            1
          ) {
            throw guidedFlowError
          }

          /*
           * BE에 공식 튜토리얼 데이터가 없어
           * GUIDED Flow 생성을 거부하는 경우,
           *
           * 일반 CREATE DRAFT Flow를 먼저 만든 뒤
           * FE에서는 guided 모드로 열어
           * 가이드 UI를 진행할 수 있게 합니다.
           */
          const fallbackFlow =
            await createFlow({
              mode:
                'CREATE',

              originFlowId:
                null,
            })

          if (
            !fallbackFlow.success ||
            !fallbackFlow.result
              ?.flowId
          ) {
            throw new Error(
              fallbackFlow.message ||
                '튜토리얼 작업 공간을 만들지 못했습니다.',
            )
          }

          flowId =
            fallbackFlow.result.flowId

          serverGuidedFlow =
            false
        }

        /*
         * 정식 GUIDED Flow 생성에 성공했다면
         * 기존 진행률 API도 정상적으로 연결합니다.
         */
        if (
          serverGuidedFlow
        ) {
          try {
            const progress =
              await startTutorial(
                tutorialId,
                flowId,
              )

            setTutorial(
              (
                previous,
              ) =>
                previous
                  ? {
                      ...previous,

                      progress,
                    }
                  : previous,
            )
          } catch (
            progressError
          ) {
            /*
             * 메인 데모 튜토리얼은 Progress API만 실패해도
             * 만들어진 Flow를 버리지 않습니다.
             */
            if (
              tutorialId !==
              1
            ) {
              throw progressError
            }

            setTutorial(
              (
                previous,
              ) =>
                previous
                  ? {
                      ...previous,

                      progress: {
                        currentStepOrder:
                          1,

                        status:
                          'IN_PROGRESS',

                        flowId,
                      },
                    }
                  : previous,
            )
          }
        } else {
          /*
           * CREATE Flow fallback으로 들어온 경우에는
           * BE Tutorial Progress가 없으므로
           * 현재 화면 세션에서만 진행 중 상태를 유지합니다.
           */
          setTutorial(
            (
              previous,
            ) =>
              previous
                ? {
                    ...previous,

                    progress: {
                      currentStepOrder:
                        1,

                      status:
                        'IN_PROGRESS',

                      flowId,
                    },
                  }
                : previous,
          )
        }

        openGuidedStudio(
          flowId,
        )
      } catch (
        requestError
      ) {
        setStartMessage(
          requestError instanceof
            Error
            ? requestError.message
            : '튜토리얼을 시작하지 못했습니다.',
        )
      } finally {
        setIsStarting(
          false,
        )
      }
    }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <PageContainer className="py-20">
          <Card className="px-6 py-16 text-center text-sm font-semibold text-slate-500">
            튜토리얼 상세 정보를
            불러오는 중입니다.
          </Card>
        </PageContainer>

        <Footer />
      </div>
    )
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <PageContainer className="py-20">
          <Card className="px-6 py-16 text-center">
            <h1 className="text-2xl font-black text-slate-900">
              튜토리얼을 찾을 수
              없습니다.
            </h1>

            <p className="mt-3 text-sm font-semibold text-slate-400">
              주소를 다시 확인하거나
              목록으로 돌아가 주세요.
            </p>

            {error && (
              <p className="mt-3 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <Button
              className="mt-8"
              onClick={() =>
                navigate(
                  '/official-tutorials',
                )
              }
            >
              튜토리얼 목록으로
            </Button>
          </Card>
        </PageContainer>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="max-w-5xl py-12">
        <div className="space-y-9">
          <Link
            to="/official-tutorials"
            className="inline-flex items-center gap-2 text-sm font-black text-indigo-500 transition hover:text-indigo-600"
          >
            <ArrowLeft
              size={16}
            />

            튜토리얼 목록
          </Link>

          <section>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-400">
              <span
                className={[
                  'rounded-lg px-3 py-1.5 text-sm font-black',
                  levelClassMap[
                    tutorial.level
                  ],
                ].join(' ')}
              >
                {
                  tutorial.level
                }
              </span>

              <span className="inline-flex items-center gap-1">
                <Clock
                  size={16}
                />

                {
                  tutorial.estimatedMinutes
                }
                분
              </span>

              <span className="inline-flex items-center gap-1">
                <Blocks
                  size={16}
                />

                블록{' '}
                {
                  tutorial.blockCount
                }
                개
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {
                tutorial.title
              }
            </h1>

            <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
              {tutorial.description.replace(
                '합니다.',
                '해 봅니다.',
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                disabled={
                  isStarting ||
                  tutorial.progress
                    ?.status ===
                    'COMPLETED'
                }
                onClick={
                  handleStartTutorial
                }
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                {isStarting
                  ? '시작 중...'
                  : tutorial
                        .progress
                        ?.status ===
                      'IN_PROGRESS'
                    ? '이어서 학습하기'
                    : tutorial
                          .progress
                          ?.status ===
                        'COMPLETED'
                      ? '학습 완료'
                      : '튜토리얼 시작하기'}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                disabled={
                  isSaving ||
                  isRemoving
                }
                onClick={
                  tutorial.progress
                    ? handleRemoveTutorial
                    : handleSaveTutorial
                }
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                {isRemoving
                  ? '해제 중...'
                  : isSaving
                    ? '저장 중...'
                    : tutorial.progress
                      ? '저장 해제'
                      : '튜토리얼 저장'}
              </Button>
            </div>

            {saveMessage && (
              <p className="mt-3 text-sm font-semibold text-slate-500">
                {
                  saveMessage
                }
              </p>
            )}

            {startMessage && (
              <p className="mt-3 text-sm font-semibold text-red-600">
                {
                  startMessage
                }
              </p>
            )}
          </section>

          <Card className="px-6 py-5">
            <p className="text-sm font-black text-slate-400">
              이럴 때 쓸 수 있어요
              · 실제 활용 사례
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {tutorial.useCases.map(
                (useCase) => (
                  <div
                    key={
                      useCase.label
                    }
                  >
                    <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">
                      {
                        useCase.label
                      }
                    </span>

                    <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
                      {
                        useCase.description
                      }
                    </p>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-400">
              <span className="mr-3">
                필요 개념
              </span>

              {tutorial.requiredConcepts.join(
                ' · ',
              )}
            </div>
          </Card>

          <Card className="px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-slate-400">
                블록 흐름
              </p>

              <span className="rounded-lg border border-dashed border-slate-200 bg-white px-5 py-2 text-sm font-black text-slate-600">
                Preset
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {tutorial.flowSteps.map(
                (
                  step,
                  index,
                ) => (
                  <div
                    key={
                      step.id
                    }
                    className="flex items-center gap-3"
                  >
                    <FlowStep
                      label={
                        step.label
                      }
                      color={
                        step.color
                      }
                    />

                    {index <
                      tutorial
                        .flowSteps
                        .length -
                        1 && (
                      <span className="text-xl font-black text-slate-300">
                        →
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          </Card>

          <section>
            <p className="mb-4 text-sm font-black text-slate-400">
              사용하는 블록
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {tutorial.blocks.map(
                (block) => (
                  <BlockCard
                    key={
                      block.id
                    }
                    block={
                      block
                    }
                  />
                ),
              )}
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <Card className="px-6 py-5">
              <p className="text-sm font-black text-slate-400">
                예시 입력
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
                “
                {
                  tutorial.exampleInput
                }
                ”
              </div>
            </Card>

            <Card className="px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-400">
                  예시 결과
                </p>

                <span className="text-sm font-black text-slate-300">
                  예시 결과
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {tutorial.exampleResult.map(
                  (
                    line,
                    index,
                  ) => (
                    <div
                      key={`${line}-${index}`}
                      className="h-3 rounded-full bg-slate-100"
                    >
                      <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                    </div>
                  ),
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-black text-slate-400">
                  결과 출처
                </p>

                <span className="rounded-lg border border-dashed border-slate-200 bg-white px-5 py-2 text-sm font-black text-slate-600">
                  {
                    tutorial.resultSource
                  }
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-400">
                ※ 예시 결과이며 실제
                실행 결과를 보장하지
                않습니다.
              </p>
            </Card>
          </section>
        </div>
      </PageContainer>

      <Footer />
    </div>
  )
}