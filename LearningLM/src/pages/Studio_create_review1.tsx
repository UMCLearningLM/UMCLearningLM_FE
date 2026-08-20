import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { Header } from '../components/layout/Header'

import {
  STUDIO_STAGE_ORDER,
  getStudioBlockDefinition,
} from '../features/studio/data/studioBlockCatalog'

import type {
  StudioStage,
} from '../features/studio/types/studioNode'

import type {
  StudioSaveNavigationState,
} from '../features/studio/types/studioSave'

import {
  buildStudioFlowBlocks,
} from '../features/studio/utils/studioFlowPersistence'

import {
  getFlow,
  getStudioBlocks,
  previewFlow,
  type PreviewFlowRequest,
  type PreviewFlowResponse,
} from './api/StudioApi'

const stageStyleMap:
  Record<
    StudioStage,
    {
      border: string
      dot: string
    }
  > = {
    INPUT: {
      border:
        'border-[#4A5E8A]',
      dot:
        'bg-[#4A5E8A]',
    },

    CONTEXT: {
      border:
        'border-[#2F8190]',
      dot:
        'bg-[#2F8190]',
    },

    PROCESS: {
      border:
        'border-[#6366F1]',
      dot:
        'bg-[#6366F1]',
    },

    REVIEW: {
      border:
        'border-[#B07A2E]',
      dot:
        'bg-[#B07A2E]',
    },

    OUTPUT: {
      border:
        'border-[#3C7A52]',
      dot:
        'bg-[#3C7A52]',
    },
  }

function parseFlowId(
  value:
    | string
    | number
    | null
    | undefined,
): number | undefined {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return undefined
  }

  const parsed =
    Number(value)

  return (
    Number.isInteger(
      parsed,
    ) &&
    parsed > 0
  )
    ? parsed
    : undefined
}

function getAccessToken() {
  return (
    localStorage.getItem(
      'accessToken',
    ) ??
    sessionStorage.getItem(
      'accessToken',
    ) ??
    undefined
  )
}

function getInputFromOptions(
  options:
    Record<
      string,
      unknown
    >,
): Record<
  string,
  unknown
> {
  const studioBlockId =
    options.studioBlockId

  /*
   * IN-004 파일 업로드 받기 / CTX-002 업로드 문서 읽기는
   * BE input_schema에서 uploadedFiles를 input으로 요구합니다.
   *
   * Studio 저장 구조에서는 slot.config가 flow block의 options에
   * 직렬화되므로 Preview 요청을 만들 때 input으로 다시 분리합니다.
   */
  if (
    studioBlockId ===
      'input-file-upload' ||
    studioBlockId ===
      'context-uploaded-document'
  ) {
    const uploadedFiles =
      options.uploadedFiles

    if (
      Array.isArray(
        uploadedFiles,
      ) &&
      uploadedFiles.length >
        0
    ) {
      return {
        uploadedFiles,
      }
    }
  }

  const value =
    options.value

  if (
    typeof value ===
      'string' &&
    value.trim().length >
      0
  ) {
    return {
      value,
    }
  }

  return {}
}

function isWorkflowConnected(
  nodes:
    NonNullable<
      StudioSaveNavigationState[
        'nodes'
      ]
    >,
  edges:
    NonNullable<
      StudioSaveNavigationState[
        'edges'
      ]
    >,
): boolean {
  if (
    nodes.length ===
    0
  ) {
    return false
  }

  const nodeIds =
    new Set(
      nodes.map(
        (node) =>
          node.id,
      ),
    )

  const hasInput =
    nodes.some(
      (node) =>
        node.data.node
          .stage ===
        'INPUT',
    )

  const hasOutput =
    nodes.some(
      (node) =>
        node.data.node
          .stage ===
        'OUTPUT',
    )

  if (
    !hasInput ||
    !hasOutput
  ) {
    return false
  }

  const adjacency =
    new Map<
      string,
      Set<string>
    >()

  for (
    const node of nodes
  ) {
    adjacency.set(
      node.id,
      new Set<string>(),
    )
  }

  for (
    const edge of edges
  ) {
    if (
      !nodeIds.has(
        edge.source,
      ) ||
      !nodeIds.has(
        edge.target,
      )
    ) {
      continue
    }

    adjacency
      .get(
        edge.source,
      )
      ?.add(
        edge.target,
      )

    adjacency
      .get(
        edge.target,
      )
      ?.add(
        edge.source,
      )
  }

  const firstNodeId =
    nodes[0].id

  const visited =
    new Set<string>([
      firstNodeId,
    ])

  const queue =
    [firstNodeId]

  while (
    queue.length >
    0
  ) {
    const current =
      queue.shift()

    if (!current) {
      continue
    }

    const connected =
      adjacency.get(
        current,
      )

    if (!connected) {
      continue
    }

    for (
      const next of
        connected
    ) {
      if (
        visited.has(
          next,
        )
      ) {
        continue
      }

      visited.add(
        next,
      )

      queue.push(
        next,
      )
    }
  }

  return (
    visited.size ===
    nodes.length
  )
}

function buildPreviewRequestFromSavedFlow(
  blockFlow:
    Awaited<
      ReturnType<
        typeof getFlow
      >
    >['result']['blockFlow'],
): PreviewFlowRequest {
  const blocks =
    [...blockFlow]
      .sort(
        (
          first,
          second,
        ) =>
          first.blockOrder -
          second.blockOrder,
      )
      .map(
        (block) => {
          const options =
            block.options ??
            {}

          return {
            blockId:
              block.blockId,

            blockOrder:
              block.blockOrder,

            input:
              getInputFromOptions(
                options,
              ),

            options,

            resolvedContext:
              {},
          }
        },
      )

  if (
    blocks.length ===
    0
  ) {
    throw new Error(
      '미리보기에 사용할 저장된 블록이 없습니다.',
    )
  }

  return {
    blocks,
  }
}

export function Studio_create_review1() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const {
    flowId:
      routeFlowId,
  } =
    useParams<{
      flowId?: string
    }>()

  const [
    searchParams,
  ] =
    useSearchParams()

  const navigationState =
    (
      location.state as
        | StudioSaveNavigationState
        | null
    ) ?? {}

  const flowId =
    parseFlowId(
      routeFlowId,
    ) ??
    parseFlowId(
      navigationState.flowId,
    )

  const nodes =
    useMemo(
      () =>
        navigationState.nodes ??
        [],
      [
        navigationState.nodes,
      ],
    )

  const edges =
    useMemo(
      () =>
        navigationState.edges ??
        [],
      [
        navigationState.edges,
      ],
    )

  const validationResult =
    navigationState.validationResult ??
    null

  const saveDraft =
    navigationState.saveDraft

  const isPreviewRoute =
    location.pathname.endsWith(
      '/preview',
    )

  const isExampleView =
    searchParams.get(
      'view',
    ) ===
    'example'

  const [
    previewResult,
    setPreviewResult,
  ] =
    useState<
      PreviewFlowResponse[
        'result'
      ] | null
    >(
      null,
    )

  const [
    previewError,
    setPreviewError,
  ] =
    useState('')

  const [
    isPreviewLoading,
    setIsPreviewLoading,
  ] =
    useState(false)

  const orderedFlowBlocks =
    useMemo(
      () => {
        return [
          ...nodes,
        ]
          .sort(
            (
              first,
              second,
            ) => {
              const firstStage =
                STUDIO_STAGE_ORDER.indexOf(
                  first.data.node
                    .stage,
                )

              const secondStage =
                STUDIO_STAGE_ORDER.indexOf(
                  second.data.node
                    .stage,
                )

              if (
                firstStage !==
                secondStage
              ) {
                return (
                  firstStage -
                  secondStage
                )
              }

              return (
                first.data.node
                  .order -
                second.data.node
                  .order
              )
            },
          )
          .flatMap(
            (node) =>
              [
                ...node.data.node
                  .slots,
              ]
                .sort(
                  (
                    first,
                    second,
                  ) =>
                    (
                      getStudioBlockDefinition(
                        first.id,
                      )?.order ??
                      Number.MAX_SAFE_INTEGER
                    ) -
                    (
                      getStudioBlockDefinition(
                        second.id,
                      )?.order ??
                      Number.MAX_SAFE_INTEGER
                    ),
                )
                .map(
                  (slot) => ({
                    id:
                      `${node.id}:${slot.id}`,

                    label:
                      getStudioBlockDefinition(
                        slot.id,
                      )?.title ??
                      slot.label,

                    stage:
                      node.data.node
                        .stage,
                  }),
                ),
          )
      },
      [
        nodes,
      ],
    )

  const flowConnected =
    useMemo(
      () =>
        isWorkflowConnected(
          nodes,
          edges,
        ),
      [
        nodes,
        edges,
      ],
    )

  const requiredSlotIssues =
    validationResult?.issues.filter(
      (issue) =>
        (
          issue.type ===
            'missing-required-slot-value' ||
          issue.type ===
            'invalid-required-slot'
        ) &&
        issue.severity ===
          'error',
    ) ?? []

  const requiredSlotsValid =
    validationResult
      ? requiredSlotIssues.length ===
        0
      : false

  const hasTitleSummary =
    Boolean(
      saveDraft?.title.trim(),
    ) &&
    Boolean(
      saveDraft?.summary.trim(),
    )

  const canContinueToDetails =
    Boolean(
      validationResult?.valid,
    ) &&
    flowConnected

  const remainingConditionCount =
    [
      flowConnected,
      requiredSlotsValid,
      hasTitleSummary,
    ].filter(
      (passed) =>
        !passed,
    ).length

  const buildCurrentNavigationState =
    (): StudioSaveNavigationState => ({
      ...navigationState,

      flowId,

      nodes,

      edges,

      validationResult,
    })

  const handleBackToEditor =
    () => {
      const state =
        buildCurrentNavigationState()

      if (!flowId) {
        navigate(
          '/studio/create',
          {
            state,
          },
        )

        return
      }

      const mode =
        navigationState.mode ??
        'edit'

      navigate(
        `/studio/create?flowId=${flowId}&mode=${mode}`,
        {
          state,
        },
      )
    }

  const handleNext =
    () => {
      if (
        !canContinueToDetails
      ) {
        return
      }

      navigate(
        '/studio/save/details',
        {
          state:
            buildCurrentNavigationState(),
        },
      )
    }

  const runPreview =
    useCallback(
      async () => {
        if (!flowId) {
          setPreviewError(
            '미리보기에 사용할 flowId가 없습니다.',
          )

          return
        }

        setIsPreviewLoading(
          true,
        )

        setPreviewError(
          '',
        )

        setPreviewResult(
          null,
        )

        try {
          const accessToken =
            getAccessToken()

          let request:
            PreviewFlowRequest

          if (
            nodes.length >
            0
          ) {
            const blockResponse =
              await getStudioBlocks(
                {
                  ...(navigationState.tutorialId
                    ? {
                        tutorialId:
                          navigationState.tutorialId,
                      }
                    : {}),
                },
                accessToken,
              )

            if (
              !blockResponse.success ||
              !blockResponse.result
            ) {
              throw new Error(
                blockResponse.message ||
                  '블록 정보를 불러오지 못했습니다.',
              )
            }

            const serializedBlocks =
              buildStudioFlowBlocks(
                {
                  nodes,

                  blockPalette:
                    blockResponse.result,
                },
              )

            request = {
              blocks:
                serializedBlocks.map(
                  (block) => ({
                    blockId:
                      block.blockId,

                    blockOrder:
                      block.blockOrder,

                    input:
                      getInputFromOptions(
                        block.options,
                      ),

                    options:
                      block.options,

                    resolvedContext:
                      {},
                  }),
                ),
            }
          } else {
            const flowResponse =
              await getFlow(
                flowId,
                accessToken,
              )

            if (
              !flowResponse.success ||
              !flowResponse.result
            ) {
              throw new Error(
                flowResponse.message ||
                  '저장된 흐름을 불러오지 못했습니다.',
              )
            }

            request =
              buildPreviewRequestFromSavedFlow(
                flowResponse
                  .result
                  .blockFlow,
              )
          }

          const response =
            await previewFlow(
              flowId,
              request,
              accessToken,
            )

          if (
            !response.success
          ) {
            throw new Error(
              response.message ||
                '미리보기 생성에 실패했습니다.',
            )
          }

          setPreviewResult(
            response.result,
          )
        } catch (error) {
          console.error(
            'Flow 미리보기 실패:',
            error,
          )

          setPreviewError(
            error instanceof Error
              ? error.message
              : '미리보기를 생성하는 중 오류가 발생했습니다.',
          )
        } finally {
          setIsPreviewLoading(
            false,
          )
        }
      },
      [
        flowId,
        navigationState.tutorialId,
        nodes,
      ],
    )

  useEffect(
    () => {
      if (
        !isPreviewRoute
      ) {
        return
      }

      void runPreview()
    },
    [
      isPreviewRoute,
      runPreview,
    ],
  )

  if (
    isPreviewRoute
  ) {
    return (
      <>
        <Header />

        <div className="flex min-h-screen justify-center bg-[#F5F5F7] px-[24px] pb-[60px]">
          <main className="w-full max-w-[1158px] text-[#27272A]">
            <div className="mt-[34px] flex items-start justify-between gap-[24px]">
              <div>
                <p className="text-[14px] font-bold text-[#9A9AA3]">
                  {isExampleView
                    ? '예시 결과'
                    : '워크플로우 미리보기'}
                </p>

                <h1 className="mt-[4px] text-[38px] font-bold">
                  {isExampleView
                    ? '예시 결과를 확인하세요'
                    : '현재 흐름의 실행 결과를 확인하세요'}
                </h1>

                <p className="mt-[7px] text-[18px] text-[#52525B]">
                  저장 전 현재 블록 설정을 기준으로 서버 Preview API를 실행합니다.
                </p>
              </div>

              <div className="flex gap-[10px]">
                <button
                  type="button"
                  onClick={() =>
                    navigate(-1)
                  }
                  className="flex h-[46px] items-center justify-center rounded-[10px] border-[1.5px] border-[#E4E4E7] bg-white px-[20px] text-[15px] font-bold text-[#52525B] hover:bg-[#F0F0F3]"
                >
                  ← 이전으로
                </button>

                <button
                  type="button"
                  disabled={
                    isPreviewLoading
                  }
                  onClick={() => {
                    void runPreview()
                  }}
                  className={[
                    'flex h-[46px] items-center justify-center rounded-[10px] px-[20px] text-[15px] font-bold text-white',

                    isPreviewLoading
                      ? 'cursor-not-allowed bg-[#A5A6F6]'
                      : 'bg-[#6366F1] hover:bg-[#5558DB]',
                  ].join(
                    ' ',
                  )}
                >
                  {isPreviewLoading
                    ? '생성 중...'
                    : '다시 생성'}
                </button>
              </div>
            </div>

            <section className="mt-[26px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[30px] py-[28px]">
              <div className="flex items-center justify-between gap-[20px]">
                <div>
                  <p className="text-[14px] font-bold text-[#9A9AA3]">
                    실행 결과
                  </p>

                  <p className="mt-[5px] text-[18px] font-bold text-[#27272A]">
                    Flow #{flowId}
                  </p>
                </div>

                {previewResult && (
                  <div className="flex flex-wrap justify-end gap-[8px]">
                    <span className="rounded-[8px] bg-[#F0F0F3] px-[10px] py-[6px] text-[13px] font-bold text-[#52525B]">
                      {previewResult.resultSource}
                    </span>

                    <span className="rounded-[8px] bg-[#F0F0FF] px-[10px] py-[6px] text-[13px] font-bold text-[#6366F1]">
                      {previewResult.modelName}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-[22px] min-h-[360px] rounded-[12px] border-[1.5px] border-[#EEEEF1] bg-[#FAFAFB] px-[24px] py-[22px]">
                {isPreviewLoading ? (
                  <div className="flex min-h-[310px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-[42px] w-[42px] animate-spin rounded-full border-[4px] border-[#E4E4E7] border-t-[#6366F1]" />

                      <p className="mt-[16px] text-[15px] font-bold text-[#52525B]">
                        현재 블록 흐름을 실행하고 있습니다.
                      </p>
                    </div>
                  </div>
                ) : previewError ? (
                  <div className="flex min-h-[310px] items-center justify-center">
                    <div className="max-w-[620px] text-center">
                      <p className="text-[18px] font-bold text-[#B4453A]">
                        미리보기를 생성하지 못했습니다.
                      </p>

                      <p className="mt-[9px] text-[14px] leading-[22px] text-[#9A9AA3]">
                        {previewError}
                      </p>
                    </div>
                  </div>
                ) : previewResult ? (
                  <p className="whitespace-pre-wrap break-words text-[16px] leading-[27px] text-[#3F3F46]">
                    {previewResult.resultText}
                  </p>
                ) : (
                  <div className="flex min-h-[310px] items-center justify-center text-[15px] text-[#9A9AA3]">
                    생성된 미리보기 결과가 없습니다.
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />

      <div className="flex h-[62px] items-center justify-between border-b-[1.5px] border-[#E4E4E7] bg-white pl-[27px] pr-[9.4px] text-[#27272A]">
        <p className="text-[17.5px] font-bold">
          워크플로우 저장
        </p>

        <div className="ml-[27px] flex flex-1 items-center gap-[22px]">
          <div className="flex items-center gap-[9px]">
            <div className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#6366F1] text-white" />

            <p className="text-[15.5px] font-bold text-[#6366F1]">
              검토
            </p>
          </div>

          <div className="h-[3px] w-[16px] bg-[#E4E4E7]" />

          <div className="flex items-center gap-[9px]">
            <div className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#E7E7EC] text-[12px] font-bold text-[#9A9AA3]">
              2
            </div>

            <p className="text-[15.5px] font-bold text-[#9A9AA3]">
              상세정보
            </p>
          </div>

          <div className="h-[3px] w-[16px] bg-[#E4E4E7]" />

          <div className="flex items-center gap-[9px]">
            <p className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#E7E7EC] text-[12px] font-bold text-[#9A9AA3]">
              3
            </p>

            <p className="text-[15.5px] font-bold text-[#9A9AA3]">
              공개 설정
            </p>
          </div>
        </div>

        <p className="text-[14.5px] text-[#9A9AA3]">
          자유 제작 흐름 · 저장 전 마지막 단계
        </p>
      </div>

      <main className="flex min-h-screen justify-center bg-[#F5F5F7] pb-[60px]">
        <div className="flex min-h-screen w-[1158px] flex-col text-[#27272A]">
          <p className="mt-[34px] text-[14px] font-bold text-[#9A9AA3]">
            자유 제작 · 저장 검토
          </p>

          <p className="text-[38px] font-bold">
            저장하기 전에 흐름을 검토하세요
          </p>

          <p className="mt-[7px] text-[18px] text-[#52525B]">
            내가 만든 블록 흐름과 저장 조건을 먼저 확인합니다. 이어서 상세 정보를 입력하고 공개 범위를 정해요.
          </p>

          <div className="mt-[26px] w-[1158px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[26px] py-[22px]">
            <div className="flex w-full items-center justify-between text-[14px] text-[#9A9AA3]">
              <p className="font-bold">
                내가 만든 블록 흐름
              </p>

              <p className="text-[15px]">
                노드 {nodes.length}개 · 블록 {orderedFlowBlocks.length}개
              </p>
            </div>

            {orderedFlowBlocks.length > 0 ? (
              <div className="mt-[17px] flex items-center gap-[10px] overflow-x-auto pb-[5px]">
                {orderedFlowBlocks.map(
                  (
                    block,
                    index,
                  ) => {
                    const style =
                      stageStyleMap[
                        block.stage
                      ]

                    return (
                      <div
                        key={
                          block.id
                        }
                        className="flex shrink-0 items-center gap-[10px]"
                      >
                        {index >
                          0 && (
                          <p className="text-[#9A9AA3]">
                            →
                          </p>
                        )}

                        <div
                          className={[
                            'flex h-[42px] shrink-0 items-center justify-center gap-[7.5px] rounded-[50px] border-[1.5px] bg-[#F0F0F3] px-[14px] text-[15px] font-bold text-[#52525B]',
                            style.border,
                          ].join(
                            ' ',
                          )}
                        >
                          <div
                            className={[
                              'h-[11px] w-[11px] rounded-[4px]',
                              style.dot,
                            ].join(
                              ' ',
                            )}
                          />

                          {
                            block.label
                          }
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            ) : (
              <div className="mt-[17px] flex h-[52px] items-center justify-center rounded-[10px] border border-dashed border-[#D4D4D8] text-[14px] text-[#9A9AA3]">
                저장할 블록 흐름이 없습니다.
              </div>
            )}
          </div>

          <div className="mt-[22px] w-full rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[30px] pb-[28px] pt-[22px]">
            <div className="flex items-center justify-between font-bold">
              <p className="text-[15px] text-[#9A9AA3]">
                저장 조건
              </p>

              <p className={[
                'flex h-[26.6px] min-w-[73px] items-center justify-center rounded-[8px] px-[9px] text-[14px]',
                remainingConditionCount ===
                0
                  ? 'bg-[#EEF4EE] text-[#2F7D52]'
                  : 'bg-[#FBF6EC] text-[#9A6A1E]',
              ].join(
                ' ',
              )}>
                {remainingConditionCount ===
                0
                  ? '완료'
                  : `${remainingConditionCount}개 남음`}
              </p>
            </div>

            <div className="mt-[18px] w-full rounded-[12px] border-[1.5px] border-[#E4E4E7]">
              <div className="flex min-h-[78px] items-center">
                <div
                  className={[
                    'ml-[21.75px] h-[23px] w-[23px] rounded-[50%]',
                    flowConnected
                      ? 'bg-[#2F8A5B]'
                      : 'bg-[#B4453A]',
                  ].join(
                    ' ',
                  )}
                />

                <div className="ml-[15px] flex-1">
                  <p className="text-[17px] font-bold">
                    블록 흐름 · 입력 → 결과 연결
                  </p>

                  <p className="text-[14.5px] text-[#9A9AA3]">
                    {flowConnected
                      ? `${nodes.length}개 노드가 하나의 흐름으로 연결되어 있습니다.`
                      : '입력부터 결과까지 모든 노드가 연결되어 있어야 합니다.'}
                  </p>
                </div>

                <p
                  className={[
                    'mr-[30px] flex h-[24px] min-w-[46px] items-center justify-center rounded-[8px] px-[8px] text-[14px] font-bold',
                    flowConnected
                      ? 'bg-[#EEF4EE] text-[#2F7D52]'
                      : 'bg-[#FBF1F0] text-[#B4453A]',
                  ].join(
                    ' ',
                  )}
                >
                  {flowConnected
                    ? '통과'
                    : '확인'}
                </p>
              </div>

              <div className="border-b-[1.5px] border-[#EEEEF1]" />

              <div className="flex min-h-[78px] items-center">
                <div
                  className={[
                    'ml-[21.75px] h-[25.5px] w-[25.5px] rounded-[50%]',
                    requiredSlotsValid
                      ? 'bg-[#2F8A5B]'
                      : validationResult
                        ? 'bg-[#B4453A]'
                        : 'bg-[#E7E7EC]',
                  ].join(
                    ' ',
                  )}
                />

                <div className="ml-[15px] flex-1">
                  <p className="text-[17px] font-bold">
                    각 노드 필수 슬롯
                  </p>

                  <p className="text-[14.5px] text-[#9A9AA3]">
                    {requiredSlotsValid
                      ? '필수 슬롯 설정이 모두 완료되었습니다.'
                      : validationResult
                        ? `필수 슬롯 오류 ${requiredSlotIssues.length}개가 남아 있습니다.`
                        : 'Studio에서 검증을 실행해 주세요.'}
                  </p>
                </div>

                <p
                  className={[
                    'mr-[30px] flex h-[24px] min-w-[46px] items-center justify-center rounded-[8px] px-[8px] text-[14px] font-bold',
                    requiredSlotsValid
                      ? 'bg-[#EEF4EE] text-[#2F7D52]'
                      : validationResult
                        ? 'bg-[#FBF1F0] text-[#B4453A]'
                        : 'bg-[#F0F0F3] text-[#9A9AA3]',
                  ].join(
                    ' ',
                  )}
                >
                  {requiredSlotsValid
                    ? '통과'
                    : validationResult
                      ? '확인'
                      : '대기'}
                </p>
              </div>

              <div className="border-b-[1.5px] border-[#EEEEF1]" />

              <div className="flex min-h-[78px] items-center">
                <div
                  className={[
                    'ml-[21.75px] h-[25.5px] w-[25.5px] rounded-[50%]',
                    hasTitleSummary
                      ? 'bg-[#2F8A5B]'
                      : 'bg-[#E7E7EC]',
                  ].join(
                    ' ',
                  )}
                />

                <div className="ml-[15px] flex-1">
                  <p className="text-[17px] font-bold">
                    제목 · 한 줄 요약
                  </p>

                  <p className="text-[14.5px] text-[#9A9AA3]">
                    {hasTitleSummary
                      ? '제목과 한 줄 요약이 작성되어 있습니다.'
                      : '다음 단계(상세 정보)에서 작성합니다.'}
                  </p>
                </div>

                <p
                  className={[
                    'mr-[30px] flex h-[24px] min-w-[46px] items-center justify-center rounded-[8px] px-[8px] text-[14px] font-bold',
                    hasTitleSummary
                      ? 'bg-[#EEF4EE] text-[#2F7D52]'
                      : 'bg-[#F0F0F3] text-[#9A9AA3]',
                  ].join(
                    ' ',
                  )}
                >
                  {hasTitleSummary
                    ? '완료'
                    : '대기'}
                </p>
              </div>
            </div>

            <div className="mt-[24px] flex items-center gap-[12px]">
              <p className="flex h-[24px] w-[24px] items-center justify-center rounded-[50px] bg-[#6366F1] text-[16.5px] text-white">
                i
              </p>

              <p className="text-[17px] text-[#52525B]">
                Studio 검증을 통과한 흐름만 상세 정보 단계로 이동할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex h-[82px] items-center bg-white pl-[52px] pr-[28px]">
        <button
          type="button"
          onClick={
            handleBackToEditor
          }
          className="text-[18.5px] font-bold text-[#52525B]"
        >
          ← 편집으로
        </button>

        <p className="flex-1 pl-[38px] text-[16px] text-[#9A9AA3]">
          1 / 3 · 검토 · 흐름과 저장 조건 확인
        </p>

        <button
          type="button"
          disabled={
            !canContinueToDetails
          }
          onClick={
            handleNext
          }
          className={[
            'flex h-[50px] w-[186px] items-center justify-center rounded-[12px] text-[17.5px] font-bold text-white',

            canContinueToDetails
              ? 'cursor-pointer bg-[#6366F1] hover:bg-[#3A3DC2]'
              : 'cursor-not-allowed bg-[#A5A6F6]',
          ].join(
            ' ',
          )}
        >
          다음: 상세 정보 →
        </button>
      </footer>
    </>
  )
}