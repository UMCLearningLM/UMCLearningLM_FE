import type {
  StudioBlockRequirement,
} from '../types/studioBlock'

import type {
  Edge,
} from '@xyflow/react'

import type {
  StudioFlowNodeInstance,
} from '../components/node/StudioFlowNode'

import {
  getStudioBlockDefinition,
  studioBlockCatalog,
  type StudioBlockId,
} from '../data/studioBlockCatalog'

import type {
  StudioNodeSlot,
  StudioStage,
} from '../types/studioNode'

import {
  appendStudioBlockToNode,
  createStudioNode,
} from '../utils/createStudioNode'

/**
 * 최신 개발 트렌드를 반영한 코드 리팩토링 및 개선 제안
 * 서브 시나리오용 Guide 식별자입니다.
 *
 * 기존 Research Guided Tutorial과 구분하기 위해
 * 별도의 guide query parameter 값으로 사용합니다.
 */
export const REFACTORING_SCENARIO_GUIDE_KEY =
  'refactoring-scenario'

/**
 * 이 서브 시나리오의 전체 정답 블록입니다.
 *
 * 최초 캔버스에는 전부 배치하지 않습니다.
 * 이후 Scenario 전용 검증에서 사용할 수 있도록
 * 정답 목록만 별도로 유지합니다.
 */
export const REFACTORING_SCENARIO_ANSWER_BLOCK_IDS:
  readonly StudioBlockId[] = [
    /*
     * INPUT
     */
    'input-text',
    'input-topic',
    'input-file-upload',
    'input-required-skill',
    'input-result-usage',

    /*
     * CONTEXT
     */
    'context-uploaded-document',
    'context-role',
    'context-background',

    /*
     * PROCESS
     */
    'process-extract-core',
    'process-decompose-functions',
    'process-link-policy',
    'process-find-exceptions',
    'process-draft',
    'process-table',

    /*
     * REVIEW
     */
    'review-missing',
    'review-quality',
    'review-error-location',
    'review-tone',

    /*
     * OUTPUT
     */
    'output-developer-handoff',
    'output-checklist',
  ]

  /**
 * Scenario 정답 블록 판정용 Set입니다.
 *
 * 이 Guide에서는 기존 Studio의
 * required / recommended / optional 분류를 사용하지 않습니다.
 *
 * 정답 20개 = required
 * 그 외 전체 블록 = optional
 */
const REFACTORING_SCENARIO_ANSWER_BLOCK_ID_SET =
  new Set<string>(
    REFACTORING_SCENARIO_ANSWER_BLOCK_IDS,
  )

/**
 * 코드 리팩토링 서브 시나리오 전용 Catalog입니다.
 *
 * 기존 studioBlockCatalog 자체는 절대 수정하지 않습니다.
 *
 * 따라서:
 *
 * 일반 Studio
 * → 기존 requirement 유지
 *
 * 기존 자료조사 Guided Tutorial
 * → 기존 requirement 유지
 *
 * 코드 리팩토링 Scenario Guide
 * → 정답 20개만 required
 * → 나머지는 모두 optional
 * → recommended 없음
 */
export const REFACTORING_SCENARIO_VALIDATION_CATALOG =
  studioBlockCatalog.map(
    (block) => ({
      ...block,

      requirement:
        REFACTORING_SCENARIO_ANSWER_BLOCK_ID_SET.has(
          block.id,
        )
          ? ('required' as const)
          : ('optional' as const),
    }),
  )

/**
 * Guide 최초 진입 시 사용자에게 제공할 블록입니다.
 *
 * 전체 20개 정답 중 8개만 제공합니다.
 *
 * 나머지 블록은 사용자가 시나리오를 읽고
 * Palette에서 직접 찾아 추가해야 합니다.
 */
export const REFACTORING_SCENARIO_PRESET_BLOCK_IDS:
  readonly StudioBlockId[] = [
    /*
     * INPUT
     */
    'input-text',
    'input-file-upload',

    /*
     * CONTEXT
     */
    'context-uploaded-document',
    'context-role',

    /*
     * PROCESS
     */
    'process-extract-core',
    'process-find-exceptions',

    /*
     * REVIEW
     */
    'review-missing',

    /*
     * OUTPUT
     */
    'output-developer-handoff',
  ]

/**
 * Stage마다 최초에 들어갈 블록입니다.
 *
 * 같은 Stage의 여러 블록은 서로 다른 React Flow Node를
 * 만드는 것이 아니라 하나의 Stage Node 안에 여러 Slot으로
 * 들어갑니다.
 */
const REFACTORING_SCENARIO_PRESET_BLOCKS_BY_STAGE:
  ReadonlyArray<{
    stage: StudioStage
    blockIds: readonly StudioBlockId[]
  }> = [
    {
      stage:
        'INPUT',

      blockIds: [
        'input-text',
        'input-file-upload',
      ],
    },

    {
      stage:
        'CONTEXT',

      blockIds: [
        'context-uploaded-document',
        'context-role',
      ],
    },

    {
      stage:
        'PROCESS',

      blockIds: [
        'process-extract-core',
        'process-find-exceptions',
      ],
    },

    {
      stage:
        'REVIEW',

      blockIds: [
        'review-missing',
      ],
    },

    {
      stage:
        'OUTPUT',

      blockIds: [
        'output-developer-handoff',
      ],
    },
  ]

/**
 * 최초 캔버스 배치 위치입니다.
 *
 * 정답 연결을 암시하지 않도록
 * 연결선 없이 Stage만 좌→우 방향으로 흩어 둡니다.
 */
const REFACTORING_SCENARIO_POSITIONS:
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
      y: 280,
    },

    PROCESS: {
      x: 920,
      y: 140,
    },

    REVIEW: {
      x: 1340,
      y: 300,
    },

    OUTPUT: {
      x: 1760,
      y: 180,
    },
  }

/**
 * Catalog에 반드시 존재해야 하는 Guide 블록을 가져옵니다.
 */
function requireScenarioBlock(
  blockId: StudioBlockId,
) {
  const block =
    getStudioBlockDefinition(
      blockId,
    )

  if (!block) {
    throw new Error(
      `서브 시나리오 Guide 블록을 찾을 수 없습니다: ${blockId}`,
    )
  }

  if (
    block.availability !==
    'available'
  ) {
    throw new Error(
      `서브 시나리오 Guide에서 사용할 수 없는 블록입니다: ${blockId}`,
    )
  }

  return block
}

/**
 * createStudioNode()는 몇몇 Inspector에서
 * 이미 유효한 기본값을 자동 주입합니다.
 *
 * 기존 일반 Studio와 자료조사 튜토리얼에는 필요한 동작이므로
 * createStudioNode 자체는 수정하지 않습니다.
 *
 * 대신 이번 퍼즐형 Guide에서만 모든 Slot을
 * 완전히 미설정 상태로 되돌립니다.
 */
function createEmptyScenarioSlot(
  slot: StudioNodeSlot,
): StudioNodeSlot {
  return {
    id:
      slot.id,

    label:
      slot.label,

    required:
      slot.required,

    state:
      'empty',
  }
}

/**
 * 한 Stage Node 안의 모든 Inspector 값을 제거합니다.
 *
 * config 없음
 * value 없음
 * state = empty
 *
 * 따라서 사용자가 직접 Inspector를 열고 값을 입력해야 합니다.
 */
function clearScenarioNodeConfiguration(
  node: StudioFlowNodeInstance,
): StudioFlowNodeInstance {
  return {
    ...node,

    data: {
      ...node.data,

      node: {
        ...node.data.node,

        state:
          'default',

        slots:
          node.data.node.slots.map(
            createEmptyScenarioSlot,
          ),
      },
    },
  }
}

/**
 * Stage 하나에 필요한 최초 블록들을 배치합니다.
 *
 * 첫 블록으로 Stage Node를 만든 뒤
 * 동일 Stage의 나머지 블록은 Slot으로 추가합니다.
 */
function createScenarioStageNode(
  stage: StudioStage,
  blockIds:
    readonly StudioBlockId[],
  selected: boolean,
): StudioFlowNodeInstance {
  const [
    firstBlockId,
    ...remainingBlockIds
  ] = blockIds

  if (!firstBlockId) {
    throw new Error(
      `서브 시나리오 ${stage} Stage에 최초 블록이 없습니다.`,
    )
  }

  const firstBlock =
    requireScenarioBlock(
      firstBlockId,
    )

  if (
    firstBlock.stage !==
    stage
  ) {
    throw new Error(
      [
        '서브 시나리오 Guide Stage와 블록 Stage가 일치하지 않습니다.',
        `Guide Stage: ${stage}`,
        `Block: ${firstBlockId}`,
        `Block Stage: ${firstBlock.stage}`,
      ].join(
        ' ',
      ),
    )
  }

  let node =
    createStudioNode({
      block:
        firstBlock,

      position:
        REFACTORING_SCENARIO_POSITIONS[
          stage
        ],

      idFactory: () =>
        `refactoring-guide-${stage.toLowerCase()}`,
    })

  for (
    const blockId of
      remainingBlockIds
  ) {
    const block =
      requireScenarioBlock(
        blockId,
      )

    if (
      block.stage !==
      stage
    ) {
      throw new Error(
        [
          '서브 시나리오 Guide Stage와 블록 Stage가 일치하지 않습니다.',
          `Guide Stage: ${stage}`,
          `Block: ${blockId}`,
          `Block Stage: ${block.stage}`,
        ].join(
          ' ',
        ),
      )
    }

    const appendResult =
      appendStudioBlockToNode(
        node,
        block,
      )

    node =
      appendResult.node
  }

  const emptyNode =
    clearScenarioNodeConfiguration(
      node,
    )

  return {
    ...emptyNode,

    selected,
  }
}

/**
 * 서브 시나리오 Guide 최초 진입 시 표시할 노드입니다.
 *
 * 총 5개의 Stage Node를 만들고,
 * 그 안에 8개의 빈 Block Slot을 배치합니다.
 *
 * 정답 블록 20개를 전부 주지 않으며,
 * Inspector 값도 제공하지 않습니다.
 */
export function createRefactoringScenarioInitialNodes():
  StudioFlowNodeInstance[] {
  return REFACTORING_SCENARIO_PRESET_BLOCKS_BY_STAGE.map(
    (
      preset,
      index,
    ) =>
      createScenarioStageNode(
        preset.stage,
        preset.blockIds,
        index ===
          0,
      ),
  )
}

/**
 * 최초 연결선은 하나도 제공하지 않습니다.
 *
 * 사용자가 직접
 * INPUT → CONTEXT → PROCESS → REVIEW → OUTPUT
 * 연결 관계를 구성해야 합니다.
 */
export function createRefactoringScenarioInitialEdges():
  Edge[] {
  return []
}

/**
 * 현재 Guide의 정답 블록인지 확인할 때 사용합니다.
 *
 * 이후 Palette 강조나 Scenario 전용 Validator에서
 * 동일한 목록을 재사용할 수 있습니다.
 */
export function isRefactoringScenarioAnswerBlock(
  blockId: string,
): boolean {
  return (
    REFACTORING_SCENARIO_ANSWER_BLOCK_IDS as
      readonly string[]
  ).includes(
    blockId,
  )
}

/**
 * 최초부터 제공되는 블록인지 확인합니다.
 */
export function isRefactoringScenarioPresetBlock(
  blockId: string,
): boolean {
  return (
    REFACTORING_SCENARIO_PRESET_BLOCK_IDS as
      readonly string[]
  ).includes(
    blockId,
  )
}

/**
 * 리팩토링 서브 시나리오 Guide에서만 사용하는
 * 블록 중요도입니다.
 *
 * 기존 studioBlockCatalog의 requirement는 변경하지 않습니다.
 *
 * 정답 20개:
 * required
 *
 * 그 외 모든 블록:
 * optional
 */
export function getRefactoringScenarioRequirement(
  blockId: string,
): StudioBlockRequirement {
  return isRefactoringScenarioAnswerBlock(
    blockId,
  )
    ? 'required'
    : 'optional'
}