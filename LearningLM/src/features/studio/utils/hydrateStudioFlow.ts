import type {
  Edge,
  XYPosition,
} from '@xyflow/react'

import {
  STUDIO_FLOW_NODE_TYPE,
  type StudioFlowNodeInstance,
} from '../components/node/StudioFlowNode'

import {
  STUDIO_STAGE_ORDER,
  getStudioBlockDefinition,
  studioBlockCatalog,
  studioStageLabelMap,
} from '../data/studioBlockCatalog'

import type {
  StudioBlockConfig,
  StudioBlockConfigValue,
  StudioNodeSlot,
  StudioSlotState,
  StudioStage,
} from '../types/studioNode'

import type {
  StudioSaveDifficulty,
  StudioSaveDraft,
  StudioSaveVisibility,
} from '../types/studioSave'

import type {
  FlowBlock,
  GetFlowResult,
} from '../../../pages/api/StudioApi'

const RESERVED_OPTION_KEYS =
  new Set([
    'studioBlockId',
    'studioStage',
    'studioNodeId',
    'studioNodeOrder',
    'studioNodePosition',
    'studioSlotState',
    'value',
  ])

const SLOT_STATES:
  readonly StudioSlotState[] = [
    'default',
    'filled',
    'empty',
    'warning',
    'missing',
    'error',
  ]

function isStudioStage(
  value: unknown,
): value is StudioStage {
  return (
    typeof value ===
      'string' &&
    STUDIO_STAGE_ORDER.includes(
      value as StudioStage,
    )
  )
}

function isStudioSlotState(
  value: unknown,
): value is StudioSlotState {
  return (
    typeof value ===
      'string' &&
    SLOT_STATES.includes(
      value as StudioSlotState,
    )
  )
}

function isJsonConfigValue(
  value: unknown,
): value is StudioBlockConfigValue {
  if (
    value === null ||
    typeof value ===
      'string' ||
    typeof value ===
      'number' ||
    typeof value ===
      'boolean'
  ) {
    return true
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return value.every(
      isJsonConfigValue,
    )
  }

  if (
    typeof value !==
      'object'
  ) {
    return false
  }

  return Object.values(
    value as Record<
      string,
      unknown
    >,
  ).every(
    isJsonConfigValue,
  )
}

function parsePosition(
  value: unknown,
): XYPosition | null {
  if (
    typeof value !==
      'object' ||
    value === null
  ) {
    return null
  }

  const candidate =
    value as {
      x?: unknown
      y?: unknown
    }

  if (
    typeof candidate.x !==
      'number' ||
    typeof candidate.y !==
      'number' ||
    !Number.isFinite(
      candidate.x,
    ) ||
    !Number.isFinite(
      candidate.y,
    )
  ) {
    return null
  }

  return {
    x:
      candidate.x,

    y:
      candidate.y,
  }
}

function getFallbackPosition(
  stage: StudioStage,
): XYPosition {
  const stageIndex =
    STUDIO_STAGE_ORDER.indexOf(
      stage,
    )

  return {
    x:
      80 +
      stageIndex * 420,

    y:
      150,
  }
}

function getNodeOrder(
  stage: StudioStage,
  value: unknown,
): number {
  if (
    typeof value ===
      'number' &&
    Number.isInteger(
      value,
    ) &&
    value > 0
  ) {
    return value
  }

  return (
    STUDIO_STAGE_ORDER.indexOf(
      stage,
    ) + 1
  )
}

function getBlockOptions(
  block: FlowBlock,
): Record<
  string,
  unknown
> {
  return (
    block.options ??
    {}
  )
}

function resolveBlockDefinition(
  block: FlowBlock,
) {
  const options =
    getBlockOptions(
      block,
    )

  const storedBlockId =
    options.studioBlockId

  if (
    typeof storedBlockId ===
      'string'
  ) {
    const storedDefinition =
      getStudioBlockDefinition(
        storedBlockId,
      )

    if (
      storedDefinition
    ) {
      return storedDefinition
    }
  }

  const stage =
    isStudioStage(
      block.stage,
    )
      ? block.stage
      : null

  if (!stage) {
    return undefined
  }

  return studioBlockCatalog.find(
    (definition) =>
      definition.stage ===
        stage &&
      definition.title.trim() ===
        block.name.trim(),
  )
}

function buildSlotConfig(
  options:
    Record<
      string,
      unknown
    >,
): StudioBlockConfig | undefined {
  const config:
    StudioBlockConfig =
      {}

  for (
    const [
      key,
      value,
    ] of Object.entries(
      options,
    )
  ) {
    if (
      RESERVED_OPTION_KEYS.has(
        key,
      )
    ) {
      continue
    }

    if (
      !isJsonConfigValue(
        value,
      )
    ) {
      continue
    }

    config[key] =
      value
  }

  return (
    Object.keys(
      config,
    ).length > 0
  )
    ? config
    : undefined
}

/**
 * 공개 라이브러리 복사본이나 구버전 Flow는
 * Inspector config는 존재하지만 FE 전용 options.value가
 * 저장되어 있지 않을 수 있습니다.
 *
 * 이 경우 config에서 Canvas 표시용 짧은 값을 복원합니다.
 */
function getHydratedConfigValueSummary(
  value: unknown,
): string | undefined {
  if (
    typeof value ===
    'string'
  ) {
    const normalized =
      value.trim()

    return normalized
      ? normalized
      : undefined
  }

  if (
    typeof value ===
      'number' &&
    Number.isFinite(
      value,
    )
  ) {
    return String(
      value,
    )
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    const values =
      value
        .map(
          (
            item,
          ) =>
            getHydratedConfigValueSummary(
              item,
            ),
        )
        .filter(
          (
            item,
          ): item is string =>
            Boolean(
              item,
            ),
        )

    if (
      values.length ===
      0
    ) {
      return undefined
    }

    const visibleValues =
      values.slice(
        0,
        2,
      )

    const remainingCount =
      values.length -
      visibleValues.length

    return remainingCount >
      0
      ? `${visibleValues.join(', ')} 외 ${remainingCount}개`
      : visibleValues.join(
          ', ',
        )
  }

  if (
    typeof value ===
      'object' &&
    value !== null
  ) {
    const object =
      value as Record<
        string,
        unknown
      >

    /*
     * 파일이나 객체형 설정에서는
     * 사람이 읽을 수 있는 값을 우선 사용합니다.
     */
    const preferredKeys = [
      'fileName',
      'name',
      'label',
      'title',
      'content',
      'value',
    ]

    for (
      const key of
        preferredKeys
    ) {
      const summary =
        getHydratedConfigValueSummary(
          object[key],
        )

      if (summary) {
        return summary
      }
    }

    /*
     * 위 이름이 없는 일반 객체도
     * 내부의 첫 의미 있는 값을 찾습니다.
     */
    for (
      const nestedValue of
        Object.values(
          object,
        )
    ) {
      const summary =
        getHydratedConfigValueSummary(
          nestedValue,
        )

      if (summary) {
        return summary
      }
    }
  }

  return undefined
}

function getHydratedConfigSummary(
  config:
    StudioBlockConfig |
    undefined,
): string | undefined {
  if (!config) {
    return undefined
  }

  /*
   * Canvas에 표시하기 좋은 Inspector 필드를
   * 먼저 탐색합니다.
   */
  const preferredKeys = [
    'request',
    'userRequest',
    'topic',
    'content',
    'role',
    'background',
    'purpose',
    'resultUsage',
    'targetAudience',
    'customCriteria',
    'targetTone',
    'extractionTargets',
    'requiredTargets',
    'structure',
    'format',
    'length',
    'readRange',
    'matchingMode',
    'compositionMode',
    'files',
    'uploadedFiles',
  ]

  for (
    const key of
      preferredKeys
  ) {
    const summary =
      getHydratedConfigValueSummary(
        config[key],
      )

    if (summary) {
      return summary.slice(
        0,
        100,
      )
    }
  }

  /*
   * 블록별 config key가 목록에 없어도
   * 첫 번째 의미 있는 설정값으로 fallback합니다.
   */
  for (
    const value of
      Object.values(
        config,
      )
  ) {
    const summary =
      getHydratedConfigValueSummary(
        value,
      )

    if (summary) {
      return summary.slice(
        0,
        100,
      )
    }
  }

  return undefined
}

function resolveSlotState(
  options:
    Record<
      string,
      unknown
    >,
  value: string | undefined,
): StudioSlotState {
  if (
    isStudioSlotState(
      options.studioSlotState,
    )
  ) {
    return (
      options.studioSlotState
    )
  }

  return (
    value?.trim()
  )
    ? 'filled'
    : 'empty'
}

function createHydratedSlot(
  block: FlowBlock,
): {
  stage: StudioStage
  nodeId: string
  nodeOrder: number
  position: XYPosition
  slot: StudioNodeSlot
} {
  if (
    !isStudioStage(
      block.stage,
    )
  ) {
    throw new Error(
      `지원하지 않는 Studio Stage입니다: ${block.stage}`,
    )
  }

  const definition =
    resolveBlockDefinition(
      block,
    )

  if (!definition) {
    throw new Error(
      [
        '저장된 블록을 Studio Catalog와 연결할 수 없습니다.',
        `blockId=${block.blockId}`,
        `stage=${block.stage}`,
        `name=${block.name}`,
      ].join(' '),
    )
  }

  const options =
    getBlockOptions(
      block,
    )

  const storedNodeId =
    options.studioNodeId

  const nodeId =
    typeof storedNodeId ===
      'string' &&
    storedNodeId.trim()
      ? storedNodeId.trim()
      : `studio-${block.stage.toLowerCase()}-hydrated`

  const config =
    buildSlotConfig(
      options,
    )

  /*
   * 현재 FE에서 정상 저장한 Flow는
   * options.value를 우선 사용합니다.
   *
   * 공개 라이브러리 복사본이나 구버전 Flow처럼
   * Inspector config만 있고 value가 없는 경우에는
   * config에서 Canvas 표시용 summary를 복원합니다.
   */
  const storedValue =
    typeof options.value ===
      'string'
      ? options.value
      : undefined

  const value =
    storedValue ??
    getHydratedConfigSummary(
      config,
    )

  return {
    stage:
      block.stage,

    nodeId,

    nodeOrder:
      getNodeOrder(
        block.stage,
        options.studioNodeOrder,
      ),

    position:
      parsePosition(
        options.studioNodePosition,
      ) ??
      getFallbackPosition(
        block.stage,
      ),

    slot: {
      id:
        definition.id,

      label:
        definition.title,

      required:
        definition.requirement ===
        'required',

      state:
        resolveSlotState(
          options,
          value,
        ),

      ...(value !==
      undefined
        ? {
            value,
          }
        : {}),

      ...(config
        ? {
            config,
          }
        : {}),
    },
  }
}

function sortSlots(
  slots:
    StudioNodeSlot[],
): StudioNodeSlot[] {
  return [
    ...slots,
  ].sort(
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
}

function buildHydratedEdges(
  nodes:
    readonly StudioFlowNodeInstance[],
): Edge[] {
  const sortedNodes =
    [...nodes].sort(
      (
        first,
        second,
      ) => {
        const stageDifference =
          STUDIO_STAGE_ORDER.indexOf(
            first.data.node
              .stage,
          ) -
          STUDIO_STAGE_ORDER.indexOf(
            second.data.node
              .stage,
          )

        if (
          stageDifference !== 0
        ) {
          return stageDifference
        }

        return (
          first.data.node
            .order -
          second.data.node
            .order
        )
      },
    )

  const edges:
    Edge[] = []

  for (
    let index = 0;
    index <
    sortedNodes.length - 1;
    index += 1
  ) {
    const source =
      sortedNodes[index]

    const target =
      sortedNodes[
        index + 1
      ]

    edges.push(
      {
        id:
          `hydrated-${source.id}-${target.id}`,

        source:
          source.id,

        target:
          target.id,

        sourceHandle:
          'source',

        targetHandle:
          'target',

        type:
          'smoothstep',
      },
    )
  }

  return edges
}

function normalizeDifficulty(
  difficulty:
    string | null,
): StudioSaveDifficulty {
  if (
    difficulty ===
      'BEGINNER' ||
    difficulty ===
      'BASIC' ||
    difficulty ===
      'ADVANCED'
  ) {
    return difficulty
  }

  return 'BASIC'
}

function normalizeVisibility(
  visibility: string,
): StudioSaveVisibility {
  return (
    visibility ===
    'PUBLIC'
  )
    ? 'PUBLIC'
    : 'PRIVATE'
}

export interface HydratedStudioFlow {
  nodes:
    StudioFlowNodeInstance[]

  edges:
    Edge[]

  saveDraft:
    StudioSaveDraft
}

/**
 * GET /flows/{flowId} 응답을
 * Studio React Flow 상태로 복원합니다.
 *
 * 새 버전에서 저장한 Flow는 options의
 * studioNodeId / studioNodePosition / studioBlockId를 우선 사용합니다.
 *
 * 해당 메타데이터가 없는 기존 Flow는
 * block.name + stage를 Catalog와 매칭하고
 * Stage별 기본 위치에 복원합니다.
 */
export function hydrateStudioFlowFromApi(
  flow: GetFlowResult,
): HydratedStudioFlow {
  const groups =
    new Map<
      string,
      {
        stage: StudioStage
        order: number
        position: XYPosition
        slots: StudioNodeSlot[]
      }
    >()

  const sortedBlocks =
    [
      ...flow.blockFlow,
    ].sort(
      (
        first,
        second,
      ) =>
        first.blockOrder -
        second.blockOrder,
    )

  for (
    const block of
      sortedBlocks
  ) {
    const hydrated =
      createHydratedSlot(
        block,
      )

    const existing =
      groups.get(
        hydrated.nodeId,
      )

    if (
      existing &&
      existing.stage !==
        hydrated.stage
    ) {
      throw new Error(
        `동일한 Studio Node ID에 서로 다른 Stage가 저장되어 있습니다: ${hydrated.nodeId}`,
      )
    }

    if (existing) {
      if (
        !existing.slots.some(
          (slot) =>
            slot.id ===
            hydrated.slot.id,
        )
      ) {
        existing.slots.push(
          hydrated.slot,
        )
      }

      continue
    }

    groups.set(
      hydrated.nodeId,
      {
        stage:
          hydrated.stage,

        order:
          hydrated.nodeOrder,

        position:
          hydrated.position,

        slots: [
          hydrated.slot,
        ],
      },
    )
  }

  const nodes =
    Array.from(
      groups.entries(),
    )
      .map(
        (
          [
            nodeId,
            group,
          ],
        ): StudioFlowNodeInstance => ({
          id:
            nodeId,

          type:
            STUDIO_FLOW_NODE_TYPE,

          position:
            group.position,

          selected:
            false,

          data: {
            node: {
              id:
                nodeId,

              order:
                group.order,

              stage:
                group.stage,

              title:
                studioStageLabelMap[
                  group.stage
                ],

              state:
                'default',

              slots:
                sortSlots(
                  group.slots,
                ),
            },
          },
        }),
      )
      .sort(
        (
          first,
          second,
        ) => {
          const stageDifference =
            STUDIO_STAGE_ORDER.indexOf(
              first.data.node
                .stage,
            ) -
            STUDIO_STAGE_ORDER.indexOf(
              second.data.node
                .stage,
            )

          if (
            stageDifference !== 0
          ) {
            return stageDifference
          }

          return (
            first.data.node
              .order -
            second.data.node
              .order
          )
        },
      )

  return {
    nodes,

    edges:
      buildHydratedEdges(
        nodes,
      ),

    saveDraft: {
      title:
        flow.title ??
        '',

      summary:
        flow.summary ??
        '',

      purpose:
        flow.purpose ??
        '',

      categories:
        flow.categories.map(
          (category) =>
            category.name,
        ),

      difficulty:
        normalizeDifficulty(
          flow.difficulty,
        ),

      tags:
        [],

      exampleInput:
        flow.exampleInput ??
        '',

      exampleResult:
        flow.exampleResult ??
        '',

      authorNote:
        flow.authorNote ??
        '',

      visibility:
        normalizeVisibility(
          flow.visibility,
        ),
    },
  }
}