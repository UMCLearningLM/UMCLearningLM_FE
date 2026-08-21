import { ArrowLeft, Blocks, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

import {
  REFACTORING_SCENARIO_TUTORIAL_ID,
  getTutorialById,
  type Tutorial,
  type TutorialBlock,
  type TutorialLevel,
} from '../../features/tutorial/data/tutorials'

import {
  createGuidedFlow,
  deleteFlow,
  deleteTutorialProgress,
  getTutorialDetail,
  saveTutorial,
  startTutorial,
  type TutorialDetailProgress,
} from '../../api/tutorial'

import {
  createFlow,
} from '../api/StudioApi'

type TutorialDetailViewModel =
  Tutorial & {
    progress:
      TutorialDetailProgress | null
  }

const levelClassMap = {
  입문:
    'bg-emerald-50 text-emerald-600',

  기초:
    'bg-blue-50 text-blue-600',

  응용:
    'bg-rose-50 text-rose-600',
}

const blockColorClassMap:
  Record<
    TutorialBlock['color'],
    string
  > = {
    blue:
      'bg-blue-500',

    teal:
      'bg-teal-600',

    green:
      'bg-emerald-600',
  }

const flowLabelClassMap:
  Record<
    TutorialBlock['color'],
    string
  > = {
    blue:
      'border-blue-300 bg-slate-50 text-slate-700',

    teal:
      'border-teal-300 bg-slate-50 text-slate-700',

    green:
      'border-emerald-300 bg-slate-50 text-slate-700',
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
        flowLabelClassMap[
          color
        ],
      ].join(
        ' ',
      )}
    >
      <span
        className={[
          'h-2.5 w-2.5 rounded-sm',

          blockColorClassMap[
            color
          ],
        ].join(
          ' ',
        )}
      />

      {label}
    </span>
  )
}

function BlockCard({
  block,
}: {
  block: TutorialBlock
}) {
  return (
    <Card className="px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              'h-3 w-3 rounded-sm',

              blockColorClassMap[
                block.color
              ],
            ].join(
              ' ',
            )}
          />

          <h3 className="text-xl font-black text-slate-950">
            {
              block.title
            }
          </h3>
        </div>

        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
          {
            block.type
          }
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-600">
        {
          block.description
        }
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400">
        <span className="mr-2 text-slate-300">
          왜 필요?
        </span>

        {
          block.why
        }
      </div>
    </Card>
  )
}

export function TutorialDetailPage() {
  const params =
    useParams()

  const navigate =
    useNavigate()

  /*
   * /official-tutorials/:tutorialId
   */
  const tutorialId =
    Number(
      params.tutorialId,
    )

  const [
    tutorial,
    setTutorial,
  ] =
    useState<
      TutorialDetailViewModel | null
    >(
      null,
    )

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(
      true,
    )

  const [
    error,
    setError,
  ] =
    useState(
      '',
    )

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(
      false,
    )

  const [
    isRemoving,
    setIsRemoving,
  ] =
    useState(
      false,
    )

  const [
    saveMessage,
    setSaveMessage,
  ] =
    useState(
      '',
    )

  const [
    isStarting,
    setIsStarting,
  ] =
    useState(
      false,
    )

  const [
    startMessage,
    setStartMessage,
  ] =
    useState(
      '',
    )

  useEffect(
    () => {
      /*
       * 숫자가 아니거나
       * 0 이하인 ID는
       * 서버에 요청하지 않습니다.
       */
      if (
        !Number.isInteger(
          tutorialId,
        ) ||
        tutorialId <=
          0
      ) {
        setError(
          '올바르지 않은 튜토리얼 번호입니다.',
        )

        setIsLoading(
          false,
        )

        return
      }

      /*
       * 화면을 벗어난 뒤
       * 비동기 응답이 state를
       * 변경하지 않도록 합니다.
       */
      let isMounted =
        true

      getTutorialDetail(
        tutorialId,
      )
        .then(
          (
            result,
          ) => {
            if (
              !isMounted
            ) {
              return
            }

            const fallbackTutorial =
              getTutorialById(
                tutorialId,
              )

            const exampleInput =
              result.example
                ?.input ??
              fallbackTutorial
                ?.exampleInput ??
              ''

            const exampleResult =
              result.example
                ?.result
                ? result.example.result
                    .split(
                      '\n',
                    )
                    .filter(
                      Boolean,
                    )
                : fallbackTutorial
                    ?.exampleResult ??
                  []

            const resultSource:
              Tutorial['resultSource'] =
              result.example
                ? result
                      .example
                      .source ===
                    'TEMPLATE'
                  ? 'Template'
                  : 'AI'
                : fallbackTutorial
                    ?.resultSource ??
                  'Template'

            const levelMap:
              Record<
                string,
                TutorialLevel
              > = {
                BEGINNER:
                  '입문',

                BASIC:
                  '기초',

                ADVANCED:
                  '응용',
              }

            const colors:
              TutorialBlock['color'][] =
              [
                'blue',
                'teal',
                'green',
              ]

            setTutorial({
              id:
                result.tutorialId,

              title:
                result.title,

              description:
                result.summary,

              level:
                levelMap[
                  result.difficulty
                ] ??
                '입문',

              categories:
                result.categories.map(
                  (
                    category,
                  ) =>
                    category.name,
                ) as
                  Tutorial['categories'],

              blockCount:
                result.blockCount,

              estimatedMinutes:
                result
                  .estimatedMinutes,

              useCases:
                result.useCases,

              requiredConcepts:
                result
                  .requiredConcepts,

              flowSteps:
                result.blockFlow.map(
                  (
                    label,
                    index,
                  ) => ({
                    id:
                      `${index}-${label}`,

                    label,

                    color:
                      colors[
                        index %
                          colors.length
                      ],
                  }),
                ),

              blocks:
                result.blocks.map(
                  (
                    block,
                    index,
                  ) => ({
                    id:
                      String(
                        block.blockId,
                      ),

                    title:
                      block.name,

                    type:
                      block.stage,

                    description:
                      block
                        .description,

                    why:
                      block.reason,

                    color:
                      colors[
                        index %
                          colors.length
                      ],
                  }),
                ),

              exampleInput,

              exampleResult,

              resultSource,

              progress:
                result.progress,
            })
          },
        )
        .catch(
          (
            requestError:
              unknown,
          ) => {
            if (
              !isMounted
            ) {
              return
            }

            /*
             * 기존 공식 자료조사 Tutorial과
             * FE 전용 Refactoring Scenario는
             * BE 상세 데이터가 없어도
             * FE 정의를 fallback으로 사용합니다.
             */
            const fallbackTutorial =
              tutorialId ===
                1 ||
              tutorialId ===
                REFACTORING_SCENARIO_TUTORIAL_ID
                ? getTutorialById(
                    tutorialId,
                  )
                : undefined

            if (
              fallbackTutorial
            ) {
              setTutorial({
                ...fallbackTutorial,

                progress:
                  null,
              })

              setError(
                '',
              )

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
        .finally(
          () => {
            if (
              isMounted
            ) {
              setIsLoading(
                false,
              )
            }
          },
        )

      return () => {
        isMounted =
          false
      }
    },
    [
      tutorialId,
    ],
  )

  /*
   * 튜토리얼 저장
   */
  const handleSaveTutorial =
    async () => {
      const accessToken =
        localStorage.getItem(
          'accessToken',
        )

      if (
        !accessToken
      ) {
        window.alert(
          '로그인 후 튜토리얼을 저장할 수 있습니다.',
        )

        return
      }

      setIsSaving(
        true,
      )

      setSaveMessage(
        '',
      )

      try {
        const progress =
          await saveTutorial(
            tutorialId,
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
        setIsSaving(
          false,
        )
      }
    }

  /*
   * 저장 해제
   */
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

      if (
        !shouldRemove
      ) {
        return
      }

      setIsRemoving(
        true,
      )

      setSaveMessage(
        '',
      )

      try {
        const {
          status,
          flowId,
        } =
          tutorial.progress

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

        await deleteTutorialProgress(
          tutorialId,
        )

        setTutorial(
          (
            previous,
          ) =>
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
        setIsRemoving(
          false,
        )
      }
    }

  /*
   * 공식 Tutorial과 Scenario Guide가
   * 공통으로 사용하는 Studio 진입 함수입니다.
   *
   * Refactoring Scenario의 tutorialId는
   * Studio 내부에서 Scenario 식별자로만 사용합니다.
   *
   * POST /flows 요청에는 보내지 않습니다.
   */
  const openGuidedStudio =
    (
      flowId:
        number,
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

  /*
   * Tutorial / Scenario 시작
   */
  const handleStartTutorial =
    async () => {
      const accessToken =
        localStorage.getItem(
          'accessToken',
        ) ??
        sessionStorage.getItem(
          'accessToken',
        )

      if (
        !accessToken
      ) {
        window.alert(
          '로그인 후 튜토리얼을 시작할 수 있습니다.',
        )

        return
      }

      /*
       * ========================================================
       * Refactoring Scenario Guide
       * ========================================================
       *
       * 이 Scenario의 tutorialId는
       * FE에서만 사용하는 식별자입니다.
       *
       * BE Tutorial DB에는 존재하지 않으므로
       *
       * {
       *   mode: 'GUIDED',
       *   tutorialId: 25
       * }
       *
       * 형태로 POST /flows를 호출하면
       * TUTORIAL40401 404가 발생합니다.
       *
       * 따라서 Scenario에서는
       * CREATE Flow만 서버에서 만들고,
       * FE Studio 진입 시 guided +
       * tutorialId로 Scenario UI를 활성화합니다.
       */
      if (
        tutorialId ===
        REFACTORING_SCENARIO_TUTORIAL_ID
      ) {
        setIsStarting(
          true,
        )

        setStartMessage(
          '',
        )

        try {
          const flow =
            await createFlow({
              mode:
                'CREATE',

              originFlowId:
                null,
            })

          if (
            !flow.success ||
            !flow.result
              ?.flowId
          ) {
            throw new Error(
              flow.message ||
                '가이드 작업 공간을 만들지 못했습니다.',
            )
          }

          openGuidedStudio(
            flow.result.flowId,
          )
        } catch (
          requestError
        ) {
          setStartMessage(
            requestError instanceof
              Error
              ? requestError.message
              : '가이드를 시작하지 못했습니다.',
          )
        } finally {
          setIsStarting(
            false,
          )
        }

        return
      }

      /*
       * ========================================================
       * 기존 공식 Guided Tutorial
       * ========================================================
       */

      /*
       * 이미 진행 중이고
       * 기존 Flow가 있다면
       * 새 Flow를 만들지 않습니다.
       */
      if (
        tutorial
          ?.progress
          ?.status ===
          'IN_PROGRESS' &&
        tutorial
          .progress
          .flowId
      ) {
        openGuidedStudio(
          tutorial
            .progress
            .flowId,
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
           * 기존 공식 Tutorial은
           * 정식 GUIDED Flow 생성 API를 사용합니다.
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
           * 기존 제출용 메인 Tutorial인
           * tutorialId=1만 CREATE fallback을
           * 허용합니다.
           */
          if (
            tutorialId !==
            1
          ) {
            throw guidedFlowError
          }

          const fallbackFlow =
            await createFlow({
              mode:
                'CREATE',

              originFlowId:
                null,
            })

          if (
            !fallbackFlow.success ||
            !fallbackFlow
              .result
              ?.flowId
          ) {
            throw new Error(
              fallbackFlow.message ||
                '튜토리얼 작업 공간을 만들지 못했습니다.',
            )
          }

          flowId =
            fallbackFlow
              .result
              .flowId

          serverGuidedFlow =
            false
        }

        /*
         * BE의 정식 GUIDED Flow라면
         * Tutorial Progress도 연결합니다.
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
             * 기존 메인 Demo Tutorial은
             * Progress API만 실패해도
             * 생성된 Flow를 버리지 않습니다.
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
           * CREATE fallback은
           * BE Tutorial Progress가 없으므로
           * 현재 FE session에만 진행 상태를 둡니다.
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

  if (
    isLoading
  ) {
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

  if (
    !tutorial
  ) {
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

            {
              error && (
                <p className="mt-3 text-sm font-semibold text-red-600">
                  {
                    error
                  }
                </p>
              )
            }

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
              size={
                16
              }
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
                ].join(
                  ' ',
                )}
              >
                {
                  tutorial.level
                }
              </span>

              <span className="inline-flex items-center gap-1">
                <Clock
                  size={
                    16
                  }
                />

                {
                  tutorial
                    .estimatedMinutes
                }
                분
              </span>

              <span className="inline-flex items-center gap-1">
                <Blocks
                  size={
                    16
                  }
                />

                블록{' '}
                {
                  tutorial
                    .blockCount
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
              {
                tutorial.description.replace(
                  '합니다.',
                  '해 봅니다.',
                )
              }
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                disabled={
                  isStarting ||
                  tutorial
                    .progress
                    ?.status ===
                    'COMPLETED'
                }
                onClick={
                  handleStartTutorial
                }
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                {
                  isStarting
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
                        : '튜토리얼 시작하기'
                }
              </Button>

              <Button
                variant="secondary"
                size="lg"
                disabled={
                  isSaving ||
                  isRemoving
                }
                onClick={
                  tutorial
                    .progress
                    ? handleRemoveTutorial
                    : handleSaveTutorial
                }
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                {
                  isRemoving
                    ? '해제 중...'
                    : isSaving
                      ? '저장 중...'
                      : tutorial
                          .progress
                        ? '저장 해제'
                        : '튜토리얼 저장'
                }
              </Button>
            </div>

            {
              saveMessage && (
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  {
                    saveMessage
                  }
                </p>
              )
            }

            {
              startMessage && (
                <p className="mt-3 text-sm font-semibold text-red-600">
                  {
                    startMessage
                  }
                </p>
              )
            }
          </section>

          <Card className="px-6 py-5">
            <p className="text-sm font-black text-slate-400">
              이럴 때 쓸 수 있어요
              · 실제 활용 사례
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {
                tutorial.useCases.map(
                  (
                    useCase,
                  ) => (
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
                )
              }
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-400">
              <span className="mr-3">
                필요 개념
              </span>

              {
                tutorial.requiredConcepts.join(
                  ' · ',
                )
              }
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
              {
                tutorial.flowSteps.map(
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

                      {
                        index <
                          tutorial
                            .flowSteps
                            .length -
                            1 && (
                          <span className="text-xl font-black text-slate-300">
                            →
                          </span>
                        )
                      }
                    </div>
                  ),
                )
              }
            </div>
          </Card>

          <section>
            <p className="mb-4 text-sm font-black text-slate-400">
              사용하는 블록
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {
                tutorial.blocks.map(
                  (
                    block,
                  ) => (
                    <BlockCard
                      key={
                        block.id
                      }
                      block={
                        block
                      }
                    />
                  ),
                )
              }
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
                  tutorial
                    .exampleInput
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
                {
                  tutorial.exampleResult.map(
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
                  )
                }
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-black text-slate-400">
                  결과 출처
                </p>

                <span className="rounded-lg border border-dashed border-slate-200 bg-white px-5 py-2 text-sm font-black text-slate-600">
                  {
                    tutorial
                      .resultSource
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