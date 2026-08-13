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

    /*
     * 화면에서는 "문서 요약",
     * BE CategoryCode 표시명은 "문서요약"이므로
     * 두 표기를 같은 categoryId로 처리합니다.
     */
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

  return normalized.length >
    0
    ? normalized
    : null
}

function buildBlockLookup(
  blockPalette:
    GetStudioBlocksResult,
): Map<string, number> {
  const lookup =
    new Map<
      string,
      number
    >()

  for (
    const stage of
      blockPalette.stages
  ) {
    for (
      const block of
        stage.blocks
    ) {
      const key =
        [
          stage.stage,
          block.name.trim(),
        ].join('::')

      lookup.set(
        key,
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
      (
        category,
      ) => {
        const categoryId =
          CATEGORY_ID_BY_LABEL[
            category
          ]

        if (
          !categoryId
        ) {
          throw new Error(
            `BE categoryId를 찾을 수 없습니다: ${category}`,
          )
        }

        return categoryId
      },
    )

  return Array.from(
    new Set(
      ids,
    ),
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
  slotId:
    string,
): number {
  return (
    getStudioBlockDefinition(
      slotId,
    )?.order ??
    Number.MAX_SAFE_INTEGER
  )
}

export interface BuildStudioFlowUpdateRequestOptions {
  nodes:
    readonly StudioFlowNodeInstance[]

  saveDraft:
    StudioSaveDraft

  blockPalette:
    GetStudioBlocksResult
}

/**
 * React Flow의 Stage Node/slot 구조를
 * 백엔드 FlowUpdateRequest.blocks 구조로 변환합니다.
 *
 * 중요한 점:
 *
 * Studio의 "노드" 하나가 BE 블록 하나가 아닙니다.
 * 노드 내부의 slot 하나가 실제 BE Block 하나입니다.
 */
export function buildStudioFlowUpdateRequest({
  nodes,
  saveDraft,
  blockPalette,
}: BuildStudioFlowUpdateRequestOptions): FlowUpdateRequest {
  if (
    nodes.length ===
    0
  ) {
    throw new Error(
      '저장할 Studio 노드가 없습니다.',
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

  const blockLookup =
    buildBlockLookup(
      blockPalette,
    )

  const sortedNodes =
    [...nodes].sort(
      (
        first,
        second,
      ) =>
        getStageIndex(
          first,
        ) -
        getStageIndex(
          second,
        ),
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

      if (
        !blockId
      ) {
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
          ...(slot.config ??
            {}),

          /*
           * 이후 GET /flows/{flowId} → Studio 복원 시
           * FE 블록과 캔버스 위치를 다시 찾을 수 있도록
           * Studio 메타데이터도 options에 함께 저장합니다.
           */
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

          /*
           * BE validation에서 blockOrder는
           * 1 이상이어야 하므로 1부터 시작합니다.
           */
          blockOrder:
            serializedBlocks.length +
            1,

          options,

          /*
           * 현재 Studio Inspector는
           * promptTemplateId를 선택하지 않으므로
           * 임의의 0을 보내지 않고 null을 사용합니다.
           */
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
      '저장할 Studio 블록이 없습니다.',
    )
  }

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

    blocks:
      serializedBlocks,
  }
}