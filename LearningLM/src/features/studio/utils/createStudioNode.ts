import type {
  XYPosition,
} from '@xyflow/react'

import {
  STUDIO_FLOW_NODE_TYPE,
  type StudioFlowNodeInstance,
} from '../components/node/StudioFlowNode'

import {
  STUDIO_STAGE_ORDER,
  getStudioBlockDefinition,
  studioStageLabelMap,
} from '../data/studioBlockCatalog'

import type {
  StudioBlockDefinition,
} from '../types/studioBlock'

import type {
  StudioBlockConfig,
  StudioNodeCardData,
  StudioNodeSlot,
  StudioSlotState,
} from '../types/studioNode'

/**
 * 노드 ID를 생성하는 함수 타입입니다.
 *
 * 테스트에서는 고정 ID 함수를 전달할 수 있고,
 * 실제 실행에서는 기본 UUID 생성기를 사용합니다.
 */
export type StudioNodeIdFactory =
  () => string

export interface CreateStudioNodeOptions {
  /**
   * 노드에 최초로 추가할 팔레트 블록입니다.
   */
  block: StudioBlockDefinition

  /**
   * React Flow 캔버스에 생성될 위치입니다.
   */
  position: XYPosition

  /**
   * 노드 ID 생성 방식을 외부에서 주입할 때 사용합니다.
   */
  idFactory?: StudioNodeIdFactory
}

export interface AppendStudioBlockResult {
  /**
   * 블록 추가 후의 노드입니다.
   */
  node: StudioFlowNodeInstance

  /**
   * 실제로 슬롯이 추가됐는지 나타냅니다.
   *
   * 이미 같은 블록이 존재하면 false입니다.
   */
  added: boolean
}

export type UpsertStudioBlockReason =
  | 'created'
  | 'added'
  | 'duplicate'
  | 'unavailable'

export interface UpsertStudioBlockNodeOptions {
  /**
   * 현재 React Flow 노드 목록입니다.
   */
  nodes:
    readonly StudioFlowNodeInstance[]

  /**
   * 드롭된 팔레트 블록입니다.
   */
  block: StudioBlockDefinition

  /**
   * 새 Stage Node가 필요할 때 사용할 캔버스 위치입니다.
   *
   * 같은 Stage Node가 이미 존재하면 이 위치는 사용되지 않습니다.
   */
  position: XYPosition

  /**
   * 테스트 또는 외부 ID 정책이 필요할 때 전달합니다.
   */
  idFactory?: StudioNodeIdFactory
}

export interface UpsertStudioBlockNodeResult {
  /**
   * 블록 추가 처리 후의 전체 노드 목록입니다.
   */
  nodes:
    StudioFlowNodeInstance[]

  /**
   * 생성되거나 수정된 Stage Node ID입니다.
   *
   * 사용할 수 없는 블록이면 null입니다.
   */
  nodeId:
    string | null

  /**
   * 새 Stage Node가 생성됐는지 나타냅니다.
   */
  created: boolean

  /**
   * 블록이 실제로 추가됐는지 나타냅니다.
   *
   * 새 노드 생성과 기존 노드 슬롯 추가 모두 true입니다.
   */
  added: boolean

  /**
   * 처리 결과를 구분하는 코드입니다.
   */
  reason:
    UpsertStudioBlockReason
}

/**
 * Inspector가 화면에 처음부터 표시하는 기본값 중
 * 별도의 사용자 입력 없이 이미 유효한 설정을 정의합니다.
 *
 * 중요한 점:
 * 기존 createStudioNodeSlot은 모든 블록을 무조건 state: 'empty'로
 * 생성했습니다.
 *
 * 따라서 Inspector에서는 기본값이 선택되어 보이는데도
 * Studio FE validator에서는 미입력으로 판단되는 불일치가 있었습니다.
 *
 * 예:
 * - 필요한 스킬 확인하기: "요약"이 이미 선택됨
 * - 역할 부여하기: "기획자"가 이미 선택됨
 * - 조건 충족 확인하기: "모두 충족"이 이미 선택됨
 * - 오류 위치 표시하기: "블록 단위 · 강조 ON"이 이미 선택됨
 *
 * 아래 preset은 Inspector의 실제 기본값과 동일한 값만 사용합니다.
 * 사용자가 직접 입력해야 하는 필드는 절대 자동으로 채우지 않습니다.
 */
interface StudioInitialSlotPreset {
  config:
    StudioBlockConfig

  value: string

  state:
    StudioSlotState
}

const STUDIO_INITIAL_SLOT_PRESETS:
  Partial<
    Record<
      string,
      StudioInitialSlotPreset
    >
  > = {
    /**
     * IN-006 필요한 스킬 확인하기
     *
     * InputBlockInspectors.tsx 기본값:
     * selectedSkills = ['요약']
     * mainSkill = '요약'
     * showRecommendation = true
     *
     * Inspector 내부 complete 조건도 위 기본값만으로 true입니다.
     */
    'input-required-skill': {
      config: {
        selectedSkills: [
          '요약',
        ],

        mainSkill:
          '요약',

        showRecommendation:
          true,
      },

      value:
        '대표 요약',

      state:
        'filled',
    },

    /**
     * CTX-005 역할 부여하기
     *
     * ContextBlockInspectors.tsx 기본값:
     * enabled = true
     * role = '기획자'
     * perspective = '사용자'
     * expertise = '기본'
     *
     * 필수 완료 조건은 role 존재 여부입니다.
     */
    'context-role': {
      config: {
        enabled:
          true,

        role:
          '기획자',

        perspective:
          '사용자',

        expertise:
          '기본',

        behaviorPrinciple:
          '',
      },

      value:
        '기획자',

      state:
        'filled',
    },

    /**
     * RV-003 조건 충족 확인하기
     *
     * ReviewBlockInspectors.tsx 기본값:
     * enabled = true
     * applyMode = '모두 충족'
     * partialAllowed = false
     *
     * Inspector 단계에서는 applyMode 존재 여부로 설정 완료를 판단합니다.
     */
    'review-condition': {
      config: {
        enabled:
          true,

        applyMode:
          '모두 충족',

        partialAllowed:
          false,
      },

      value:
        '모두 충족',

      state:
        'filled',
    },

    /**
     * RV-009 오류 위치 표시하기
     *
     * ReviewBlockInspectors.tsx 기본값:
     * enabled = true
     * displayUnit = 'block'
     * highlight = true
     *
     * 해당 Inspector는 별도의 사용자 입력 없이
     * 이 기본값 자체가 완성된 설정입니다.
     */
    'review-error-location': {
      config: {
        enabled:
          true,

        displayUnit:
          'block',

        highlight:
          true,
      },

      value:
        '블록 단위 · 강조 ON',

      state:
        'filled',
    },
  }

/**
 * 기본 고유 ID를 생성합니다.
 *
 * 브라우저가 randomUUID를 지원하면 UUID를 사용하고,
 * 지원하지 않으면 시간과 난수를 조합한 값을 사용합니다.
 */
function createDefaultStudioNodeId():
  string {
  const randomUUID =
    globalThis.crypto
      ?.randomUUID?.()

  if (randomUUID) {
    return randomUUID
  }

  const timestamp =
    Date.now()
      .toString(
        36,
      )

  const randomText =
    Math.random()
      .toString(
        36,
      )
      .slice(
        2,
        10,
      )

  return `${timestamp}-${randomText}`
}

/**
 * Stage 순서를 StudioNodeCard의 order 값으로 변환합니다.
 */
function getStudioStageOrder(
  block:
    StudioBlockDefinition,
): number {
  const stageIndex =
    STUDIO_STAGE_ORDER.indexOf(
      block.stage,
    )

  return stageIndex >=
    0
    ? stageIndex +
        1
    : STUDIO_STAGE_ORDER.length +
        1
}

/**
 * 팔레트 블록 정의를 StudioNodeCard의 슬롯 데이터로 변환합니다.
 *
 * 기본 설정 자체로 완성되는 블록은 Inspector의 실제 기본값과 동일한
 * config/value/state를 초기 슬롯에 반영합니다.
 *
 * 사용자 입력이 필요한 블록은 기존처럼 state: 'empty'로 시작합니다.
 */
export function createStudioNodeSlot(
  block:
    StudioBlockDefinition,
): StudioNodeSlot {
  const preset =
    STUDIO_INITIAL_SLOT_PRESETS[
      block.id
    ]

  if (preset) {
    return {
      id:
        block.id,

      label:
        block.title,

      required:
        block.requirement ===
        'required',

      config: {
        ...preset.config,
      },

      value:
        preset.value,

      state:
        preset.state,
    }
  }

  return {
    id:
      block.id,

    label:
      block.title,

    required:
      block.requirement ===
      'required',

    state:
      'empty',
  }
}

/**
 * 슬롯을 Catalog의 order 순서에 맞춰 정렬합니다.
 *
 * Catalog에 없는 슬롯은 가장 뒤에 배치합니다.
 */
function sortStudioNodeSlots(
  slots:
    StudioNodeSlot[],
): StudioNodeSlot[] {
  return slots
    .slice()
    .sort(
      (
        firstSlot,
        secondSlot,
      ) => {
        const firstDefinition =
          getStudioBlockDefinition(
            firstSlot.id,
          )

        const secondDefinition =
          getStudioBlockDefinition(
            secondSlot.id,
          )

        const firstOrder =
          firstDefinition?.order ??
          Number.MAX_SAFE_INTEGER

        const secondOrder =
          secondDefinition?.order ??
          Number.MAX_SAFE_INTEGER

        return (
          firstOrder -
          secondOrder
        )
      },
    )
}

/**
 * 팔레트 블록 하나를 포함하는 새 Stage Node를 생성합니다.
 *
 * 같은 Stage의 노드가 이미 존재하는지 여부는 이 함수에서
 * 검사하지 않습니다. 전체 노드 목록을 대상으로 처리할 때는
 * upsertStudioBlockNode를 사용합니다.
 */
export function createStudioNode({
  block,
  position,
  idFactory =
    createDefaultStudioNodeId,
}: CreateStudioNodeOptions):
  StudioFlowNodeInstance {
  if (
    block.availability !==
    'available'
  ) {
    throw new Error(
      `사용할 수 없는 Studio 블록입니다: ${block.id}`,
    )
  }

  const generatedId =
    idFactory()

  const nodeId =
    `studio-${block.stage.toLowerCase()}-${generatedId}`

  const cardData:
    StudioNodeCardData = {
      id:
        nodeId,

      order:
        getStudioStageOrder(
          block,
        ),

      stage:
        block.stage,

      title:
        studioStageLabelMap[
          block.stage
        ],

      state:
        'default',

      slots: [
        createStudioNodeSlot(
          block,
        ),
      ],
    }

  return {
    id:
      nodeId,

    type:
      STUDIO_FLOW_NODE_TYPE,

    position,

    data: {
      node:
        cardData,
    },
  }
}

/**
 * 기존 Stage Node에 팔레트 블록을 슬롯으로 추가합니다.
 *
 * 같은 블록 ID가 이미 존재하면 원래 노드를 그대로 반환합니다.
 */
export function appendStudioBlockToNode(
  node:
    StudioFlowNodeInstance,

  block:
    StudioBlockDefinition,
): AppendStudioBlockResult {
  if (
    node.data.node.stage !==
    block.stage
  ) {
    throw new Error(
      [
        '서로 다른 Stage의 블록은 같은 노드에 추가할 수 없습니다.',
        `노드 Stage: ${node.data.node.stage}`,
        `블록 Stage: ${block.stage}`,
      ].join(
        ' ',
      ),
    )
  }

  const alreadyExists =
    node.data.node.slots.some(
      (
        slot,
      ) =>
        slot.id ===
        block.id,
    )

  if (
    alreadyExists
  ) {
    return {
      node,
      added:
        false,
    }
  }

  const nextSlots =
    sortStudioNodeSlots(
      [
        ...node.data.node.slots,

        createStudioNodeSlot(
          block,
        ),
      ],
    )

  return {
    added:
      true,

    node: {
      ...node,

      data: {
        ...node.data,

        node: {
          ...node.data.node,

          slots:
            nextSlots,
        },
      },
    },
  }
}

/**
 * 드롭된 블록을 전체 노드 목록에 반영합니다.
 *
 * 같은 Stage Node가 없으면 새 노드를 생성합니다.
 * 같은 Stage Node가 있으면 해당 노드의 slots에 블록을 추가합니다.
 */
export function upsertStudioBlockNode({
  nodes,
  block,
  position,
  idFactory,
}: UpsertStudioBlockNodeOptions):
  UpsertStudioBlockNodeResult {
  if (
    block.availability !==
    'available'
  ) {
    return {
      nodes: [
        ...nodes,
      ],

      nodeId:
        null,

      created:
        false,

      added:
        false,

      reason:
        'unavailable',
    }
  }

  const existingNodeIndex =
    nodes.findIndex(
      (
        node,
      ) =>
        node.data.node.stage ===
        block.stage,
    )

  /**
   * 해당 Stage Node가 없으면 새로 생성합니다.
   */
  if (
    existingNodeIndex ===
    -1
  ) {
    const createdNode =
      createStudioNode({
        block,
        position,
        idFactory,
      })

    return {
      nodes: [
        ...nodes,
        createdNode,
      ],

      nodeId:
        createdNode.id,

      created:
        true,

      added:
        true,

      reason:
        'created',
    }
  }

  const existingNode =
    nodes[
      existingNodeIndex
    ]

  const appendResult =
    appendStudioBlockToNode(
      existingNode,
      block,
    )

  /**
   * 이미 같은 블록이 들어 있다면 목록을 변경하지 않습니다.
   */
  if (
    !appendResult.added
  ) {
    return {
      nodes: [
        ...nodes,
      ],

      nodeId:
        existingNode.id,

      created:
        false,

      added:
        false,

      reason:
        'duplicate',
    }
  }

  const nextNodes =
    nodes.map(
      (
        node,
        index,
      ) =>
        index ===
        existingNodeIndex
          ? appendResult.node
          : node,
    )

  return {
    nodes:
      nextNodes,

    nodeId:
      appendResult.node.id,

    created:
      false,

    added:
      true,

    reason:
      'added',
  }
}