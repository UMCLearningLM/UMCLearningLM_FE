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

function sanitizeStudioBlockConfigForRequest(
  slotId: string,
  config:
    Record<
      string,
      unknown
    >,
): Record<
  string,
  unknown
> {
  const sanitized = {
    ...config,
  }

    /*
   * IN-004 파일 업로드 받기
   *
   * FE Inspector:
   * - uploadedFiles
   * - missingFileHandling = STOP | WARN
   *
   * BE #78 V14:
   * - input.files
   * - options.missingAction = stop | warn
   *
   * PARSE_FAILED 파일은 AI 입력 대상으로 보내지 않습니다.
   */
  if (
    slotId ===
    'input-file-upload'
  ) {
    const rawFiles =
      Array.isArray(
        sanitized.uploadedFiles,
      )
        ? sanitized.uploadedFiles
        : Array.isArray(
              sanitized.files,
            )
          ? sanitized.files
          : []

    const fileMap =
      new Map<
        number,
        {
          fileId: number
          fileName: string
          fileType: string
          fileSize: number
        }
      >()

    for (
      const rawFile of
        rawFiles
    ) {
      if (
        typeof rawFile !==
          'object' ||
        rawFile === null ||
        Array.isArray(
          rawFile,
        )
      ) {
        continue
      }

      const file =
        rawFile as
          Record<
            string,
            unknown
          >

      /*
       * 서버에서 parsing에 실패한 파일은
       * 현재 Preview 선택 목록에서 제외합니다.
       */
      if (
        file.status ===
        'PARSE_FAILED'
      ) {
        continue
      }

      const fileId =
        typeof file.fileId ===
          'number'
          ? file.fileId
          : Number(
              file.fileId,
            )

      const fileName =
        typeof file.fileName ===
          'string'
          ? file.fileName.trim()
          : ''

      const fileType =
        typeof file.fileType ===
          'string'
          ? file.fileType.trim()
          : ''

      const fileSize =
        typeof file.fileSize ===
          'number'
          ? file.fileSize
          : Number(
              file.fileSize,
            )

      if (
        !Number.isInteger(
          fileId,
        ) ||
        fileId <= 0 ||
        !fileName ||
        !fileType ||
        !Number.isFinite(
          fileSize,
        ) ||
        fileSize < 0
      ) {
        continue
      }

      fileMap.set(
        fileId,
        {
          fileId,
          fileName,
          fileType,
          fileSize,
        },
      )
    }

    const files =
      [
        ...fileMap.values(),
      ]

    if (
      files.length ===
      0
    ) {
      throw new Error(
        '파일 업로드 받기: 정상적으로 업로드된 파일을 하나 이상 선택해 주세요.',
      )
    }

    sanitized.files =
      files

    const rawMissingAction =
      typeof sanitized.missingAction ===
        'string'
        ? sanitized.missingAction
        : typeof sanitized.missingFileHandling ===
            'string'
          ? sanitized.missingFileHandling
          : 'STOP'

    sanitized.missingAction =
      rawMissingAction
        .trim()
        .toLowerCase() ===
      'warn'
        ? 'warn'
        : 'stop'

    /*
     * #78 schema에 존재하지 않는
     * FE 전용/legacy key는 서버 요청에서 제거합니다.
     */
    delete sanitized.uploadedFiles
    delete sanitized.missingFileHandling
  }

  /*
   * CTX-002 업로드 문서 읽기
   *
   * 실제 파일 선택은 IN-004의 files가 담당합니다.
   * CTX-002는 그 파일을 어떤 범위로 읽을지만 전달합니다.
   *
   * FE Inspector:
   * - uploadedFiles        UI 연결 정보
   * - readScope
   * - pageOrKeyword
   * - includeImage
   *
   * BE #78 V14:
   * - input.locator
   * - options.readRange
   * - options.includeImages
   * - options.includeTable
   * - options.includeAppendix
   */
  if (
    slotId ===
    'context-uploaded-document'
  ) {
    const rawReadScope =
      typeof sanitized.readScope ===
        'string'
        ? sanitized.readScope
        : typeof sanitized.readRange ===
            'string'
          ? sanitized.readRange
          : 'ALL'

    const normalizedReadRange =
      rawReadScope ===
          'PAGE_RANGE' ||
      rawReadScope ===
          'pages'
        ? 'pages'
        : rawReadScope ===
              'KEYWORD_AROUND' ||
            rawReadScope ===
              'keyword'
          ? 'keyword'
          : 'all'

    sanitized.readRange =
      normalizedReadRange

    const rawPageOrKeyword =
      Array.isArray(
        sanitized.pageOrKeyword,
      )
        ? sanitized.pageOrKeyword
            .filter(
              (
                value,
              ): value is string =>
                typeof value ===
                'string',
            )
            .map(
              (value) =>
                value.trim(),
            )
            .filter(
              Boolean,
            )
        : []

    const existingLocator =
      typeof sanitized.locator ===
        'string'
        ? sanitized.locator.trim()
        : ''

    const locator =
      rawPageOrKeyword.length >
        0
        ? rawPageOrKeyword.join(
            ', ',
          )
        : existingLocator

    if (locator) {
      sanitized.locator =
        locator
    } else {
      delete sanitized.locator
    }

    if (
      typeof sanitized.includeImage ===
        'boolean'
    ) {
      sanitized.includeImages =
        sanitized.includeImage
    }

    /*
     * uploadedFiles는 CTX-002 schema 값이 아닙니다.
     * 실제 fileId는 IN-004의 input.files에서
     * PreviewService가 추출합니다.
     */
    delete sanitized.uploadedFiles
    delete sanitized.readScope
    delete sanitized.pageOrKeyword
    delete sanitized.includeImage
  }

  /*
   * PR-009
   *
   * AUTO / TEMPLATE에서는 sections 자체를 전송하지 않습니다.
   *
   * CUSTOM_OUTLINE에서는 빈 목차를 보내지 않고,
   * 목차가 하나도 남지 않으면 요청 전에 차단합니다.
   */
  if (
    slotId ===
    'process-draft'
  ) {
    const compositionMode =
      typeof sanitized.compositionMode ===
        'string'
        ? sanitized.compositionMode
        : 'CUSTOM_OUTLINE'

    if (
      compositionMode !==
      'CUSTOM_OUTLINE'
    ) {
      delete sanitized.sections
    } else {
      const rawSections =
        Array.isArray(
          sanitized.sections,
        )
          ? sanitized.sections.filter(
              (
                value,
              ): value is string =>
                typeof value ===
                'string',
            )
          : []

      if (
        rawSections.some(
          (section) =>
            !section.trim(),
        )
      ) {
        throw new Error(
          '초안 작성하기: 사용자 지정 목차의 빈 항목을 모두 입력해 주세요.',
        )
      }

      const normalizedSections =
        rawSections.map(
          (section) =>
            section.trim(),
        )

      if (
        normalizedSections.length ===
        0
      ) {
        throw new Error(
          '초안 작성하기: 사용자 지정 목차를 하나 이상 입력해 주세요.',
        )
      }

      sanitized.sections =
        normalizedSections
    }
  }

  /*
   * PR-010
   *
   * 빈 열은 요청에서 제거합니다.
   * 중복 열과 rowKey 불일치는 사용자 의도가 모호해지므로
   * 임의 보정하지 않고 요청 전에 차단합니다.
   */
  if (
    slotId ===
    'process-table'
  ) {
    if (
      Array.isArray(
        sanitized.columns,
      )
    ) {
      const normalizedColumns =
        sanitized.columns
          .filter(
            (
              value,
            ): value is string =>
              typeof value ===
                'string',
          )
          .map(
            (column) =>
              column.trim(),
          )
          .filter(
            Boolean,
          )

      if (
        normalizedColumns.length <
        2
      ) {
        throw new Error(
          '표로 재구성하기: 열 이름을 두 개 이상 입력해 주세요.',
        )
      }

      if (
        new Set(
          normalizedColumns,
        ).size !==
        normalizedColumns.length
      ) {
        throw new Error(
          '표로 재구성하기: 중복된 열 이름을 사용할 수 없습니다.',
        )
      }

      sanitized.columns =
        normalizedColumns

      const rowKey =
        typeof sanitized.rowKey ===
          'string'
          ? sanitized.rowKey.trim()
          : '항목'

      if (
        !normalizedColumns.includes(
          rowKey,
        )
      ) {
        throw new Error(
          '표로 재구성하기: 행 기준은 실제 열 중 하나여야 합니다.',
        )
      }

      sanitized.rowKey =
        rowKey
    }
  }

  return sanitized
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

      const sanitizedConfig =
        sanitizeStudioBlockConfigForRequest(
          slot.id,
          slot.config ?? {},
        )

      const options:
        Record<
          string,
          unknown
        > = {
          ...sanitizedConfig,

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