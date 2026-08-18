import type {
  StudioFlowNodeInstance,
} from '../components/node/StudioFlowNode'

import {
  STUDIO_STAGE_ORDER,
  getStudioBlockDefinition,
} from '../data/studioBlockCatalog'

import type {
  StudioSaveDraft,
} from '../types/studioSave'

import type {
  FlowUpdateRequest,
  GetStudioBlocksResult,
} from '../../../pages/api/StudioApi'

const CATEGORY_ID_BY_LABEL:
  Record<string, number> = {
    커뮤니티: 1,
    자료조사: 2,
    튜토리얼: 3,
    문서요약: 4,
    '문서 요약': 4,
    요약: 5,
    글쓰기: 6,
    '결과물 검토': 7,
    'AI 툴 활용': 8,
    '반복 작업 정리': 9,
  }

function emptyToNull(
  value: string,
): string | null {
  const normalized =
    value.trim()

  return normalized.length > 0
    ? normalized
    : null
}

function buildBlockLookup(
  blockPalette:
    GetStudioBlocksResult,
): Map<string, number> {
  const lookup =
    new Map<string, number>()

  for (
    const stage of
      blockPalette.stages
  ) {
    for (
      const block of
        stage.blocks
    ) {
      lookup.set(
        [
          stage.stage,
          block.name.trim(),
        ].join('::'),
        block.blockId,
      )
    }
  }

  return lookup
}

function resolveCategoryIds(
  categories:
    readonly string[],
): number[] {
  const ids =
    categories.map(
      (category) => {
        const categoryId =
          CATEGORY_ID_BY_LABEL[
            category
          ]

        if (!categoryId) {
          throw new Error(
            `BE categoryId를 찾을 수 없습니다: ${category}`,
          )
        }

        return categoryId
      },
    )

  return Array.from(
    new Set(ids),
  )
}

function getStageIndex(
  node:
    StudioFlowNodeInstance,
): number {
  const index =
    STUDIO_STAGE_ORDER.indexOf(
      node.data.node.stage,
    )

  return index === -1
    ? Number.MAX_SAFE_INTEGER
    : index
}

function getSlotOrder(
  slotId: string,
): number {
  return (
    getStudioBlockDefinition(
      slotId,
    )?.order ??
    Number.MAX_SAFE_INTEGER
  )
}

export interface BuildStudioFlowBlocksOptions {
  nodes:
    readonly StudioFlowNodeInstance[]

  blockPalette:
    GetStudioBlocksResult
}

/**
 * Studio의 Stage Node 안에 들어있는 slot을
 * 백엔드 Flow block 배열로 직렬화합니다.
 *
 * Studio Node 1개 = BE Block 1개가 아니라,
 * Node 내부 slot 1개 = BE Block 1개입니다.
 *
 * 이 함수는 저장 PUT과 Preview POST가
 * 같은 blockId 매핑 규칙을 공유하도록 분리한 공통 함수입니다.
 */
export function buildStudioFlowBlocks({
  nodes,
  blockPalette,
}: BuildStudioFlowBlocksOptions): FlowUpdateRequest['blocks'] {
  if (nodes.length === 0) {
    throw new Error(
      'Studio 노드가 없습니다.',
    )
  }

  const blockLookup =
    buildBlockLookup(
      blockPalette,
    )

  const sortedNodes =
    [...nodes].sort(
      (
        first,
        second,
      ) => {
        const stageDifference =
          getStageIndex(first) -
          getStageIndex(second)

        if (
          stageDifference !== 0
        ) {
          return stageDifference
        }

        return (
          first.data.node.order -
          second.data.node.order
        )
      },
    )

  const serializedBlocks:
    FlowUpdateRequest['blocks'] =
      []

  for (
    const node of
      sortedNodes
  ) {
    const sortedSlots =
      [
        ...node.data.node.slots,
      ].sort(
        (
          first,
          second,
        ) =>
          getSlotOrder(
            first.id,
          ) -
          getSlotOrder(
            second.id,
          ),
      )

    for (
      const slot of
        sortedSlots
    ) {
      const definition =
        getStudioBlockDefinition(
          slot.id,
        )

      const blockTitle =
        definition?.title ??
        slot.label

      const lookupKey =
        [
          node.data.node.stage,
          blockTitle.trim(),
        ].join('::')

      const blockId =
        blockLookup.get(
          lookupKey,
        )

      if (!blockId) {
        throw new Error(
          [
            'BE 블록 ID를 찾을 수 없습니다.',
            `stage=${node.data.node.stage}`,
            `title=${blockTitle}`,
            `studioBlockId=${slot.id}`,
          ].join(' '),
        )
      }

      const options:
        Record<
          string,
          unknown
        > = {
          ...(
            slot.config ??
            {}
          ),

          studioBlockId:
            slot.id,

          studioStage:
            node.data.node.stage,

          studioNodeId:
            node.id,

          studioNodeOrder:
            node.data.node.order,

          studioNodePosition: {
            x:
              node.position.x,

            y:
              node.position.y,
          },

          studioSlotState:
            slot.state ??
            null,
        }

      if (
        typeof slot.value ===
        'string'
      ) {
        options.value =
          slot.value
      }

      serializedBlocks.push(
        {
          blockId,

          blockOrder:
            serializedBlocks.length +
            1,

          options,

          promptTemplateId:
            null,
        },
      )
    }
  }

  if (
    serializedBlocks.length ===
    0
  ) {
    throw new Error(
      'Studio 블록이 없습니다.',
    )
  }

  return serializedBlocks
}

export interface BuildStudioFlowUpdateRequestOptions {
  nodes:
    readonly StudioFlowNodeInstance[]

  saveDraft:
    StudioSaveDraft

  blockPalette:
    GetStudioBlocksResult
}

export function buildStudioFlowUpdateRequest({
  nodes,
  saveDraft,
  blockPalette,
}: BuildStudioFlowUpdateRequestOptions): FlowUpdateRequest {
  const normalizedTitle =
    saveDraft.title.trim()

  if (
    normalizedTitle.length ===
    0
  ) {
    throw new Error(
      '워크플로우 제목을 입력해 주세요.',
    )
  }

  const categoryIds =
    resolveCategoryIds(
      saveDraft.categories,
    )

  if (
    categoryIds.length ===
    0
  ) {
    throw new Error(
      '카테고리를 하나 이상 선택해 주세요.',
    )
  }

  const blocks =
    buildStudioFlowBlocks({
      nodes,
      blockPalette,
    })

  return {
    title:
      normalizedTitle,

    summary:
      emptyToNull(
        saveDraft.summary,
      ),

    purpose:
      emptyToNull(
        saveDraft.purpose,
      ),

    difficulty:
      saveDraft.difficulty,

    categoryIds,

    visibility:
      saveDraft.visibility,

    status:
      'COMPLETED',

    authorNote:
      emptyToNull(
        saveDraft.authorNote,
      ),

    exampleInput:
      emptyToNull(
        saveDraft.exampleInput,
      ),

    exampleResult:
      emptyToNull(
        saveDraft.exampleResult,
      ),

    blocks,
  }
}