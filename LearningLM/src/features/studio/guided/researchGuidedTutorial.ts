import {
  useCallback,
  useMemo,
  useState,
} from 'react'

import type {
  Edge,
} from '@xyflow/react'

import type {
  StudioFlowNodeInstance,
} from '../components/node/StudioFlowNode'

import {
  getStudioBlockDefinition,
} from '../data/studioBlockCatalog'

import {
  createStudioNode,
} from '../utils/createStudioNode'

import type {
  StudioNodeSlot,
  StudioStage,
} from '../types/studioNode'

export const RESEARCH_GUIDED_TOTAL_STEPS =
  5

/**
 * Guided Studio에서 사용할 수 있는 블록 전체입니다.
 *
 * 각 단계의 미리 배치 블록 + 사용자가 직접 추가할 목표 블록만
 * 일반 Studio Palette에서 노출되도록 기존 Stdio_create1.tsx와
 * 호환되는 형태로 함께 export합니다.
 */
export const RESEARCH_GUIDED_TUTORIAL_BLOCK_IDS:
  readonly string[] = [
    'input-text',
    'input-topic',
    'context-role',
    'context-direct-input',
    'process-extract-core',
    'process-summary',
    'review-condition',
    'review-evidence',
    'output-table',
    'output-text',
  ]

export interface ResearchGuidedStep {
  stage: StudioStage
  targetBlockId: string
  title: string
  instruction: string
  inspectorHint: string
  paletteHint: string
}

export interface ResearchGuidedStepStatus {
  step: ResearchGuidedStep
  nodeId?: string
  placed: boolean
  configured: boolean
  connected: boolean
  complete: boolean
}

export const RESEARCH_GUIDED_STEPS:
  readonly ResearchGuidedStep[] = [
    {
      stage:
        'INPUT',

      targetBlockId:
        'input-topic',

      title:
        '조사 주제 정하기',

      instruction:
        '입력 노드에 ‘주제 입력하기’ 블록을 추가하세요.',

      inspectorHint:
        '블록을 추가한 뒤 인스펙터에서 조사할 주제와 키워드를 입력하세요.',

      paletteHint:
        '1단계 · 입력 — ‘주제 입력하기’ 블록을 골라 입력 노드에 추가하세요.',
    },
    {
      stage:
        'CONTEXT',

      targetBlockId:
        'context-direct-input',

      title:
        '참고 자료 추가하기',

      instruction:
        '컨텍스트 노드에 ‘직접 입력 내용 사용하기’ 블록을 추가하세요.',

      inspectorHint:
        '참고할 배경 내용이나 알고 있는 사실을 입력한 뒤 입력 노드와 연결하세요.',

      paletteHint:
        '2단계 · 컨텍스트 — 참고 내용을 추가하고 입력 노드와 연결하세요.',
    },
    {
      stage:
        'PROCESS',

      targetBlockId:
        'process-summary',

      title:
        '자료 요약하기',

      instruction:
        '프로세스 노드에 ‘요약하기’ 블록을 추가하세요.',

      inspectorHint:
        '요약 길이와 형식을 설정한 뒤 컨텍스트 노드와 연결하세요.',

      paletteHint:
        '3단계 · 프로세스 — ‘요약하기’ 블록을 추가하고 설정을 완료하세요.',
    },
    {
      stage:
        'REVIEW',

      targetBlockId:
        'review-evidence',

      title:
        '근거 확인하기',

      instruction:
        '검토 노드에 ‘근거 확인하기’ 블록을 추가하세요.',

      inspectorHint:
        '검토 옵션을 설정한 뒤 프로세스 노드와 연결하세요.',

      paletteHint:
        '4단계 · 검토 — 조사 결과의 근거를 확인할 블록을 추가하세요.',
    },
    {
      stage:
        'OUTPUT',

      targetBlockId:
        'output-text',

      title:
        '결과 출력하기',

      instruction:
        '결과 노드에 ‘텍스트로 출력하기’ 블록을 추가하세요.',

      inspectorHint:
        '출력 형식과 분량을 설정한 뒤 검토 노드와 연결하세요.',

      paletteHint:
        '5단계 · 결과 — 텍스트 출력 블록을 추가해 자료조사 흐름을 완성하세요.',
    },
  ]

/**
 * 각 단계에 미리 배치해 둘 블록입니다.
 *
 * PM 합의대로 가이드 모드는 빈 캔버스가 아니라
 * 각 단계에 일부 블록이 이미 들어 있는 상태에서 시작합니다.
 * 사용자는 RESEARCH_GUIDED_STEPS의 targetBlockId를 직접 추가하고,
 * Inspector 설정과 노드 연결을 완료해야 다음 단계로 갈 수 있습니다.
 */
const RESEARCH_GUIDED_PRESET_BLOCKS:
  ReadonlyArray<{
    stage: StudioStage
    blockId: string
    value: string
  }> = [
    {
      stage:
        'INPUT',

      blockId:
        'input-text',

      value:
        '국내 생성형 AI 서비스 시장 동향을 조사해줘',
    },
    {
      stage:
        'CONTEXT',

      blockId:
        'context-role',

      value:
        '리서치 분석가',
    },
    {
      stage:
        'PROCESS',

      blockId:
        'process-extract-core',

      value:
        '사실 · 키워드 추출',
    },
    {
      stage:
        'REVIEW',

      blockId:
        'review-condition',

      value:
        '모두 충족',
    },
    {
      stage:
        'OUTPUT',

      blockId:
        'output-table',

      value:
        '표 형식',
    },
  ]

const RESEARCH_GUIDED_POSITIONS:
  Record<
    StudioStage,
    {
      x: number
      y: number
    }
  > = {
    INPUT: {
      x: 80,
      y: 160,
    },

    CONTEXT: {
      x: 500,
      y: 250,
    },

    PROCESS: {
      x: 920,
      y: 160,
    },

    REVIEW: {
      x: 1340,
      y: 250,
    },

    OUTPUT: {
      x: 1760,
      y: 160,
    },
  }

function requireBlock(
  blockId: string,
) {
  const block =
    getStudioBlockDefinition(
      blockId,
    )

  if (!block) {
    throw new Error(
      `가이드 튜토리얼 블록을 찾을 수 없습니다: ${blockId}`,
    )
  }

  return block
}

function fillPresetSlot(
  node:
    StudioFlowNodeInstance,
  blockId: string,
  value: string,
): StudioFlowNodeInstance {
  return {
    ...node,

    data: {
      ...node.data,

      node: {
        ...node.data.node,

        slots:
          node.data.node.slots.map(
            (
              slot,
            ) =>
              slot.id ===
              blockId
                ? {
                    ...slot,

                    value,

                    state:
                      'filled',
                  }
                : slot,
          ),
      },
    },
  }
}

/**
 * 가이드 모드 최초 진입 시 사용할 5개 Stage Node입니다.
 *
 * 각 노드에는 일부 블록만 미리 배치합니다.
 * 튜토리얼의 목표 블록은 의도적으로 넣지 않습니다.
 */
export function createResearchGuidedInitialNodes():
  StudioFlowNodeInstance[] {
  return RESEARCH_GUIDED_PRESET_BLOCKS.map(
    (
      preset,
      index,
    ) => {
      const block =
        requireBlock(
          preset.blockId,
        )

      const node =
        createStudioNode({
          block,

          position:
            RESEARCH_GUIDED_POSITIONS[
              preset.stage
            ],

          idFactory: () =>
            `research-guide-${preset.stage.toLowerCase()}`,
        })

      const filledNode =
        fillPresetSlot(
          node,
          preset.blockId,
          preset.value,
        )

      return {
        ...filledNode,

        selected:
          index ===
          0,
      }
    },
  )
}

/**
 * 연결선은 사용자가 직접 만들어야 하므로 최초에는 비어 있습니다.
 */
export function createResearchGuidedInitialEdges():
  Edge[] {
  return []
}

function hasSlotValue(
  slot:
    StudioNodeSlot,
): boolean {
  if (
    slot.state ===
    'filled'
  ) {
    return true
  }

  return (
    typeof slot.value ===
      'string' &&
    slot.value.trim().length >
      0
  )
}

function findStageNode(
  nodes:
    readonly StudioFlowNodeInstance[],
  stage: StudioStage,
) {
  return nodes.find(
    (
      node,
    ) =>
      node.data.node.stage ===
      stage,
  )
}

function hasDirectedConnection(
  edges:
    readonly Edge[],
  sourceNodeId:
    string |
    undefined,
  targetNodeId:
    string |
    undefined,
): boolean {
  if (
    !sourceNodeId ||
    !targetNodeId
  ) {
    return false
  }

  return edges.some(
    (
      edge,
    ) =>
      edge.source ===
        sourceNodeId &&
      edge.target ===
        targetNodeId,
  )
}

export function getResearchGuidedStepStatuses(
  nodes:
    readonly StudioFlowNodeInstance[],
  edges:
    readonly Edge[],
): ResearchGuidedStepStatus[] {
  return RESEARCH_GUIDED_STEPS.map(
    (
      step,
      index,
    ) => {
      const node =
        findStageNode(
          nodes,
          step.stage,
        )

      const slot =
        node?.data.node.slots.find(
          (
            item,
          ) =>
            item.id ===
            step.targetBlockId,
        )

      const previousStage =
        index >
        0
          ? RESEARCH_GUIDED_STEPS[
              index -
                1
            ].stage
          : undefined

      const previousNode =
        previousStage
          ? findStageNode(
              nodes,
              previousStage,
            )
          : undefined

      const placed =
        Boolean(
          slot,
        )

      const configured =
        Boolean(
          slot &&
            hasSlotValue(
              slot,
            ),
        )

      const connected =
        index ===
        0
          ? true
          : hasDirectedConnection(
              edges,
              previousNode?.id,
              node?.id,
            )

      return {
        step,

        nodeId:
          node?.id,

        placed,

        configured,

        connected,

        complete:
          placed &&
          configured &&
          connected,
      }
    },
  )
}

function getStepStorageKey(
  tutorialId:
    number |
    undefined,
  flowId:
    number |
    undefined,
) {
  return [
    'learninglm',
    'guided-research-step',
    tutorialId ??
      'tutorial',
    flowId ??
      'flow',
  ].join(
    ':',
  )
}

function getInitialStepIndex(
  tutorialId:
    number |
    undefined,
  flowId:
    number |
    undefined,
) {
  if (
    typeof window ===
    'undefined'
  ) {
    return 0
  }

  const stored =
    sessionStorage.getItem(
      getStepStorageKey(
        tutorialId,
        flowId,
      ),
    )

  const parsed =
    Number(
      stored,
    )

  if (
    Number.isInteger(
      parsed,
    ) &&
    parsed >=
      0 &&
    parsed <
      RESEARCH_GUIDED_TOTAL_STEPS
  ) {
    return parsed
  }

  return 0
}

export interface UseResearchGuidedTutorialOptions {
  enabled: boolean

  tutorialId?:
    number

  flowId?:
    number

  nodes:
    readonly StudioFlowNodeInstance[]

  edges:
    readonly Edge[]
}

export function useResearchGuidedTutorial({
  enabled,
  tutorialId,
  flowId,
  nodes,
  edges,
}: UseResearchGuidedTutorialOptions) {
  const [
    currentStepIndex,
    setCurrentStepIndex,
  ] =
    useState(
      () =>
        getInitialStepIndex(
          tutorialId,
          flowId,
        ),
    )

  const stepStatuses =
    useMemo(
      () =>
        getResearchGuidedStepStatuses(
          nodes,
          edges,
        ),
      [
        edges,
        nodes,
      ],
    )

  const currentStatus =
    stepStatuses[
      currentStepIndex
    ]

  const setStep =
    useCallback(
      (
        nextIndex:
          number,
      ) => {
        const clamped =
          Math.min(
            RESEARCH_GUIDED_TOTAL_STEPS -
              1,

            Math.max(
              0,
              nextIndex,
            ),
          )

        setCurrentStepIndex(
          clamped,
        )

        if (
          enabled &&
          typeof window !==
            'undefined'
        ) {
          sessionStorage.setItem(
            getStepStorageKey(
              tutorialId,
              flowId,
            ),
            String(
              clamped,
            ),
          )
        }
      },
      [
        enabled,
        flowId,
        tutorialId,
      ],
    )

  const goPrevious =
    useCallback(
      () => {
        setStep(
          currentStepIndex -
            1,
        )
      },
      [
        currentStepIndex,
        setStep,
      ],
    )

  const goNext =
    useCallback(
      () => {
        if (
          !currentStatus
            ?.complete
        ) {
          return
        }

        setStep(
          currentStepIndex +
            1,
        )
      },
      [
        currentStatus,
        currentStepIndex,
        setStep,
      ],
    )

  return {
    currentStepIndex,

    currentStep:
      RESEARCH_GUIDED_STEPS[
        currentStepIndex
      ],

    currentStatus,

    stepStatuses,

    canGoPrevious:
      currentStepIndex >
      0,

    canGoNext:
      Boolean(
        currentStatus
          ?.complete,
      ) &&
      currentStepIndex <
        RESEARCH_GUIDED_TOTAL_STEPS -
          1,

    isLastStep:
      currentStepIndex ===
      RESEARCH_GUIDED_TOTAL_STEPS -
        1,

    isTutorialComplete:
      stepStatuses.every(
        (
          status,
        ) =>
          status.complete,
      ),

    goPrevious,
    goNext,

    setStep,
  }
}