import {
  useState,
} from 'react'

import {
  FilePenLine,
  ListChecks,
  Plus,
  Table2,
} from 'lucide-react'

import {
  ExpandableSettingBlock,
} from '../../../../Block/components/layouts/ExpandableSettingBlock'

import type {
  StudioBlockConfig,
} from '../../../types/studioNode'

import type {
  StudioBlockInspectorComponentProps,
} from '../StudioBlockInspector'

import {
  studioInspectorClassName,
  resolveState,
  getString,
  getBoolean,
  getStringArray,
  readStringArray,
  ToggleRow,
} from './processInspectorUtils'

/*
 * ============================================================
 * PR-009
 * 초안 작성하기
 *
 * BE #78 V15 기준
 *
 * input:
 * - documentType
 * - purpose
 *
 * options:
 * - compositionMode
 * - sections
 * - completionLevel
 * - missingInformationPolicy
 *
 * CUSTOM_OUTLINE에서는 모든 section 제목이 채워져 있어야 합니다.
 * AUTO / TEMPLATE에서는 sections가 실제 요청에서 제거됩니다.
 * ============================================================
 */

const draftDocumentTypes = [
  '보고서',
  '기획',
  '기능명세',
  '이메일',
  '발표',
  '안내',
  '일반',
]

const draftCompositionModes = [
  {
    label: '자동',
    value: 'AUTO',
  },
  {
    label: '템플릿',
    value: 'TEMPLATE',
  },
  {
    label: '직접 목차',
    value: 'CUSTOM_OUTLINE',
  },
] as const

const draftCompletionLevels = [
  {
    label: '뼈대',
    value: 'SKELETON',
  },
  {
    label: '수정용',
    value: 'EDITABLE',
  },
  {
    label: '거의 완성',
    value: 'NEAR_COMPLETE',
  },
] as const

const draftMissingInfoOptions = [
  {
    label: '미정으로 표시',
    value: 'UNDECIDED',
  },
  {
    label: '가정으로 채움',
    value: 'ASSUMPTION',
  },
  {
    label: '질문으로 남김',
    value: 'QUESTION',
  },
] as const

const legacyCompositionModeMap:
  Record<string, string> = {
    자동: 'AUTO',
    템플릿: 'TEMPLATE',
    '직접 목차':
      'CUSTOM_OUTLINE',
  }

const legacyCompletionLevelMap:
  Record<string, string> = {
    뼈대: 'SKELETON',
    수정용: 'EDITABLE',
    '거의 완성':
      'NEAR_COMPLETE',
  }

const legacyMissingInformationPolicyMap:
  Record<string, string> = {
    '미정으로 표시':
      'UNDECIDED',
    '가정으로 채움':
      'ASSUMPTION',
    '질문으로 남김':
      'QUESTION',
  }

function normalizeCompositionMode(
  value: string,
): string {
  return (
    legacyCompositionModeMap[
      value
    ] ??
    value
  )
}

function normalizeCompletionLevel(
  value: string,
): string {
  return (
    legacyCompletionLevelMap[
      value
    ] ??
    value
  )
}

function normalizeMissingInformationPolicy(
  value: string,
): string {
  return (
    legacyMissingInformationPolicyMap[
      value
    ] ??
    value
  )
}

export function DraftInspector({
  slot,
  onConfigChange,
}: StudioBlockInspectorComponentProps) {
  const documentType =
    getString(
      slot.config,
      'documentType',
      '보고서',
    )

  const purpose =
    getString(
      slot.config,
      'purpose',
    )

  const compositionMode =
    normalizeCompositionMode(
      getString(
        slot.config,
        'compositionMode',
        'CUSTOM_OUTLINE',
      ),
    )

  const sections =
    getStringArray(
      slot.config,
      'sections',
      [''],
    )

  const completionLevel =
    normalizeCompletionLevel(
      getString(
        slot.config,
        'completionLevel',
        'EDITABLE',
      ),
    )

  const missingInformationPolicy =
    normalizeMissingInformationPolicy(
      getString(
        slot.config,
        'missingInformationPolicy',
        getString(
          slot.config,
          'missingInfoHandling',
          'UNDECIDED',
        ),
      ),
    )

  const [
    dragIndex,
    setDragIndex,
  ] =
    useState<
      number | null
    >(null)

  const save = (
    patch:
      StudioBlockConfig,
  ) => {
    const nextDocumentType =
      typeof patch.documentType ===
        'string'
        ? patch.documentType
        : documentType

    const nextPurpose =
      typeof patch.purpose ===
        'string'
        ? patch.purpose
        : purpose

    const nextCompositionMode =
      typeof patch.compositionMode ===
        'string'
        ? normalizeCompositionMode(
            patch.compositionMode,
          )
        : compositionMode

    const nextSections =
      'sections' in
        patch
        ? readStringArray(
            patch.sections,
            sections,
          )
        : sections

    const nextCompletionLevel =
      typeof patch.completionLevel ===
        'string'
        ? normalizeCompletionLevel(
            patch.completionLevel,
          )
        : completionLevel

    const nextMissingInformationPolicy =
      typeof patch.missingInformationPolicy ===
        'string'
        ? normalizeMissingInformationPolicy(
            patch.missingInformationPolicy,
          )
        : missingInformationPolicy

    const customOutlineComplete =
      nextCompositionMode !==
        'CUSTOM_OUTLINE' ||
      (
        nextSections.length >
          0 &&
        nextSections.every(
          (section) =>
            Boolean(
              section.trim(),
            ),
        )
      )

    const complete =
      Boolean(
        nextDocumentType,
      ) &&
      Boolean(
        nextPurpose.trim(),
      ) &&
      Boolean(
        nextCompositionMode,
      ) &&
      Boolean(
        nextCompletionLevel,
      ) &&
      Boolean(
        nextMissingInformationPolicy,
      ) &&
      customOutlineComplete

    const completionLabel =
      draftCompletionLevels.find(
        (option) =>
          option.value ===
          nextCompletionLevel,
      )?.label ??
      nextCompletionLevel

    onConfigChange(
      {
        documentType:
          nextDocumentType,

        purpose:
          nextPurpose,

        compositionMode:
          nextCompositionMode,

        sections:
          nextSections,

        completionLevel:
          nextCompletionLevel,

        missingInformationPolicy:
          nextMissingInformationPolicy,
      },
      {
        summaryValue:
          complete
            ? `${nextDocumentType} · ${completionLabel}`
            : '',

        state:
          resolveState(
            complete,
          ),
      },
    )
  }

  const updateSection = (
    index: number,
    value: string,
  ) => {
    const next =
      [...sections]

    next[index] =
      value

    save({
      sections:
        next,
    })
  }

  const addSection =
    () => {
      save({
        sections: [
          ...sections,
          '',
        ],
      })
    }

  const reorderSection = (
    sourceIndex: number,
    targetIndex: number,
  ) => {
    if (
      sourceIndex ===
      targetIndex
    ) {
      return
    }

    const next =
      [...sections]

    const [
      moved,
    ] =
      next.splice(
        sourceIndex,
        1,
      )

    next.splice(
      targetIndex,
      0,
      moved,
    )

    save({
      sections:
        next,
    })
  }

  const hasInvalidSection =
    compositionMode ===
      'CUSTOM_OUTLINE' &&
    (
      sections.length ===
        0 ||
      sections.some(
        (section) =>
          !section.trim(),
      )
    )

  return (
    <ExpandableSettingBlock
      title="초안 작성하기"
      required={
        slot.required
      }
      defaultOpen
      className={
        studioInspectorClassName
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {!purpose.trim()
              ? '작성 목적 미입력'
              : hasInvalidSection
                ? '목차 항목 미완료'
                : '초안 설정 완료'}
          </span>

          <button
            type="button"
            onClick={() =>
              save({})
            }
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700"
          >
            검증
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            문서 유형{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="grid grid-cols-4 gap-2">
            {draftDocumentTypes.map(
              (option) => {
                const selected =
                  documentType ===
                  option

                return (
                  <button
                    key={
                      option
                    }
                    type="button"
                    onClick={() =>
                      save({
                        documentType:
                          option,
                      })
                    }
                    className={[
                      'min-h-[64px] rounded-xl border-2 px-2 text-xs font-bold',
                      selected
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-slate-200 text-slate-600',
                    ].join(
                      ' ',
                    )}
                  >
                    {option}
                  </button>
                )
              },
            )}
          </div>
        </div>

        <label className="block">
          <span className="mb-3 block text-xs font-bold text-slate-700">
            작성 목적{' '}
            <span className="text-rose-500">
              *
            </span>
          </span>

          <input
            type="text"
            value={
              purpose
            }
            onChange={(
              event,
            ) =>
              save({
                purpose:
                  event.target.value,
              })
            }
            placeholder="작성 목적을 입력하세요"
            className={[
              'h-[48px] w-full rounded-xl border-2 px-4 text-sm outline-none',
              purpose.trim()
                ? 'border-slate-200 focus:border-indigo-500'
                : 'border-rose-200 focus:border-rose-400',
            ].join(
              ' ',
            )}
          />

          {!purpose.trim() && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              ▲ 필수 항목입니다
            </p>
          )}
        </label>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            구성 방식{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="flex overflow-hidden rounded-xl border-2 border-slate-200">
            {draftCompositionModes.map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    save({
                      compositionMode:
                        option.value,
                    })
                  }
                  className={[
                    'h-[44px] flex-1 border-r border-slate-200 text-xs font-bold last:border-r-0',
                    compositionMode ===
                    option.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-slate-600',
                  ].join(
                    ' ',
                  )}
                >
                  {
                    option.label
                  }
                </button>
              ),
            )}
          </div>
        </div>

        {compositionMode ===
          'CUSTOM_OUTLINE' && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-bold text-slate-700">
                목차 블록
              </p>

              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                조건부
              </span>
            </div>

            <p className="mb-3 text-[11px] font-semibold text-indigo-500">
              ↳ 직접 목차 선택됨 · 모든 항목 입력 필요
            </p>

            <div className="space-y-3">
              {sections.map(
                (
                  section,
                  index,
                ) => {
                  const invalid =
                    !section.trim()

                  return (
                    <div
                      key={
                        index
                      }
                    >
                      <div
                        draggable
                        onDragStart={() =>
                          setDragIndex(
                            index,
                          )
                        }
                        onDragOver={(
                          event,
                        ) =>
                          event.preventDefault()
                        }
                        onDrop={() => {
                          if (
                            dragIndex !==
                            null
                          ) {
                            reorderSection(
                              dragIndex,
                              index,
                            )
                          }

                          setDragIndex(
                            null,
                          )
                        }}
                        className={[
                          'flex h-[52px] items-center gap-3 rounded-xl border-2 px-4',
                          invalid
                            ? 'border-rose-200'
                            : 'border-slate-200',
                        ].join(
                          ' ',
                        )}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-[10px] font-bold text-white">
                          {index +
                            1}
                        </span>

                        <input
                          type="text"
                          value={
                            section
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSection(
                              index,
                              event.target.value,
                            )
                          }
                          placeholder="섹션 제목 입력"
                          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {invalid && (
                        <p className="mt-1.5 text-xs font-semibold text-rose-500">
                          빈 목차 항목은 사용할 수 없습니다.
                        </p>
                      )}
                    </div>
                  )
                },
              )}

              <button
                type="button"
                onClick={
                  addSection
                }
                className="flex h-[48px] w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-400"
              >
                <Plus
                  size={
                    14
                  }
                  className="mr-1"
                />

                섹션 추가
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              완성도
            </p>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </div>

          <div className="flex overflow-hidden rounded-xl border-2 border-slate-200">
            {draftCompletionLevels.map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    save({
                      completionLevel:
                        option.value,
                    })
                  }
                  className={[
                    'h-[44px] flex-1 border-r border-slate-200 text-xs font-bold last:border-r-0',
                    completionLevel ===
                    option.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-slate-600',
                  ].join(
                    ' ',
                  )}
                >
                  {
                    option.label
                  }
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              빈 정보
            </p>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </div>

          <div className="space-y-2">
            {draftMissingInfoOptions.map(
              (option) => {
                const selected =
                  missingInformationPolicy ===
                  option.value

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      save({
                        missingInformationPolicy:
                          option.value,
                      })
                    }
                    className={[
                      'flex h-[48px] w-full items-center gap-3 rounded-xl border-2 px-4 text-left text-sm font-bold',
                      selected
                        ? 'border-indigo-500 text-slate-700'
                        : 'border-slate-200 text-slate-500',
                    ].join(
                      ' ',
                    )}
                  >
                    <span
                      className={[
                        'h-4 w-4 rounded-full',
                        selected
                          ? 'bg-indigo-500'
                          : 'border border-slate-200',
                      ].join(
                        ' ',
                      )}
                    />

                    {
                      option.label
                    }
                  </button>
                )
              },
            )}
          </div>
        </div>
      </div>
    </ExpandableSettingBlock>
  )
}

/*
 * ============================================================
 * PR-010
 * 표로 재구성하기
 *
 * BE #78 V15 기준
 *
 * input:
 * - columns
 *
 * options:
 * - tablePurpose
 * - rowKey
 * - cellLength
 *
 * FE에서도 다음을 보장합니다.
 * - 빈 열 이름은 유효 열로 취급하지 않음
 * - 중복 열 이름 차단
 * - rowKey는 실제 columns 중 하나
 * - 기본 columns / rowKey 일치
 * ============================================================
 */

const tablePurposeOptions = [
  {
    label: '요약',
    value: 'SUMMARY',
  },
  {
    label: '비교',
    value: 'COMPARISON',
  },
  {
    label: '기능',
    value: 'FEATURE',
  },
  {
    label: '일정',
    value: 'SCHEDULE',
  },
  {
    label: '체크',
    value: 'CHECK',
  },
] as const

const tableCellLengthOptions = [
  {
    label: '한 줄',
    value: 'ONE_LINE',
  },
  {
    label: '짧게',
    value: 'SHORT',
  },
  {
    label: '자세히',
    value: 'DETAILED',
  },
] as const

const defaultTableColumns = [
  '항목',
  '제품 A',
  '제품 B',
]

const legacyTablePurposeMap:
  Record<string, string> = {
    요약: 'SUMMARY',
    비교: 'COMPARISON',
    기능: 'FEATURE',
    일정: 'SCHEDULE',
    체크: 'CHECK',
  }

const legacyCellLengthMap:
  Record<string, string> = {
    '한 줄':
      'ONE_LINE',
    짧게: 'SHORT',
    자세히:
      'DETAILED',
  }

function normalizeTablePurpose(
  value: string,
): string {
  return (
    legacyTablePurposeMap[
      value
    ] ??
    value
  )
}

function normalizeCellLength(
  value: string,
): string {
  return (
    legacyCellLengthMap[
      value
    ] ??
    value
  )
}

function getNormalizedTableColumns(
  values: string[],
): string[] {
  return values
    .map(
      (value) =>
        value.trim(),
    )
    .filter(
      Boolean,
    )
}

function hasDuplicateTableColumns(
  values: string[],
): boolean {
  const normalized =
    getNormalizedTableColumns(
      values,
    )

  return (
    new Set(
      normalized,
    ).size !==
    normalized.length
  )
}

export function TableTransformInspector({
  slot,
  onConfigChange,
}: StudioBlockInspectorComponentProps) {
  const tablePurpose =
    normalizeTablePurpose(
      getString(
        slot.config,
        'tablePurpose',
        'COMPARISON',
      ),
    )

  const columns =
    getStringArray(
      slot.config,
      'columns',
      defaultTableColumns,
    )

  const normalizedColumns =
    getNormalizedTableColumns(
      columns,
    )

  const configuredRowKey =
    getString(
      slot.config,
      'rowKey',
      '항목',
    ).trim()

  const rowKey =
    normalizedColumns.includes(
      configuredRowKey,
    )
      ? configuredRowKey
      : normalizedColumns[0] ??
        ''

  const cellLength =
    normalizeCellLength(
      getString(
        slot.config,
        'cellLength',
        'SHORT',
      ),
    )

  const [
    dragIndex,
    setDragIndex,
  ] =
    useState<
      number | null
    >(null)

  const save = (
    patch:
      StudioBlockConfig,
  ) => {
    const nextPurpose =
      typeof patch.tablePurpose ===
        'string'
        ? normalizeTablePurpose(
            patch.tablePurpose,
          )
        : tablePurpose

    const nextColumns =
      'columns' in
        patch
        ? readStringArray(
            patch.columns,
            columns,
          )
        : columns

    const nextNormalizedColumns =
      getNormalizedTableColumns(
        nextColumns,
      )

    const requestedRowKey =
      typeof patch.rowKey ===
        'string'
        ? patch.rowKey.trim()
        : rowKey

    const nextRowKey =
      nextNormalizedColumns.includes(
        requestedRowKey,
      )
        ? requestedRowKey
        : nextNormalizedColumns[0] ??
          ''

    const nextCellLength =
      typeof patch.cellLength ===
        'string'
        ? normalizeCellLength(
            patch.cellLength,
          )
        : cellLength

    const hasBlankColumn =
      nextColumns.some(
        (column) =>
          !column.trim(),
      )

    const hasDuplicateColumn =
      hasDuplicateTableColumns(
        nextColumns,
      )

    const complete =
      Boolean(
        nextPurpose,
      ) &&
      nextNormalizedColumns.length >=
        2 &&
      !hasBlankColumn &&
      !hasDuplicateColumn &&
      Boolean(
        nextRowKey,
      ) &&
      nextNormalizedColumns.includes(
        nextRowKey,
      )

    const purposeLabel =
      tablePurposeOptions.find(
        (option) =>
          option.value ===
          nextPurpose,
      )?.label ??
      nextPurpose

    onConfigChange(
      {
        tablePurpose:
          nextPurpose,

        columns:
          nextColumns,

        rowKey:
          nextRowKey,

        cellLength:
          nextCellLength,
      },
      {
        summaryValue:
          complete
            ? `${purposeLabel} · 열 ${nextNormalizedColumns.length}개`
            : '',

        state:
          resolveState(
            complete,
          ),
      },
    )
  }

  const updateColumn = (
    index: number,
    value: string,
  ) => {
    const next =
      [...columns]

    next[index] =
      value

    save({
      columns:
        next,
    })
  }

  const addColumn =
    () => {
      save({
        columns: [
          ...columns,
          '',
        ],
      })
    }

  const reorderColumn = (
    sourceIndex: number,
    targetIndex: number,
  ) => {
    if (
      sourceIndex ===
      targetIndex
    ) {
      return
    }

    const next =
      [...columns]

    const [
      moved,
    ] =
      next.splice(
        sourceIndex,
        1,
      )

    next.splice(
      targetIndex,
      0,
      moved,
    )

    save({
      columns:
        next,
    })
  }

  const hasBlankColumn =
    columns.some(
      (column) =>
        !column.trim(),
    )

  const hasDuplicateColumn =
    hasDuplicateTableColumns(
      columns,
    )

  const tableValid =
    normalizedColumns.length >=
      2 &&
    !hasBlankColumn &&
    !hasDuplicateColumn &&
    Boolean(
      rowKey,
    ) &&
    normalizedColumns.includes(
      rowKey,
    )

  return (
    <ExpandableSettingBlock
      title="표로 재구성하기"
      required={
        slot.required
      }
      defaultOpen
      className={
        studioInspectorClassName
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {hasBlankColumn
              ? '빈 열 이름이 있습니다.'
              : hasDuplicateColumn
                ? '중복된 열 이름이 있습니다.'
                : tableValid
                  ? `열 ${normalizedColumns.length}개 · 행 기준 ${rowKey}`
                  : '표 설정을 확인해 주세요.'}
          </span>

          <button
            type="button"
            onClick={() =>
              save({})
            }
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700"
          >
            적용
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            표 목적{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="flex flex-wrap gap-2">
            {tablePurposeOptions.map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    save({
                      tablePurpose:
                        option.value,
                    })
                  }
                  className={[
                    'h-[38px] rounded-lg px-4 text-xs font-bold',
                    tablePurpose ===
                    option.value
                      ? 'text-indigo-500'
                      : 'border border-slate-200 text-slate-600',
                  ].join(
                    ' ',
                  )}
                >
                  {
                    option.label
                  }
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            열 구성 · 가로 드래그{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {columns.map(
              (
                column,
                index,
              ) => {
                const normalized =
                  column.trim()

                const duplicate =
                  Boolean(
                    normalized,
                  ) &&
                  normalizedColumns.filter(
                    (item) =>
                      item ===
                      normalized,
                  ).length >
                    1

                const invalid =
                  !normalized ||
                  duplicate

                return (
                  <div
                    key={
                      index
                    }
                    draggable
                    onDragStart={() =>
                      setDragIndex(
                        index,
                      )
                    }
                    onDragOver={(
                      event,
                    ) =>
                      event.preventDefault()
                    }
                    onDrop={() => {
                      if (
                        dragIndex !==
                        null
                      ) {
                        reorderColumn(
                          dragIndex,
                          index,
                        )
                      }

                      setDragIndex(
                        null,
                      )
                    }}
                    className={[
                      'w-[120px] shrink-0 rounded-xl border-2 p-3',
                      invalid
                        ? 'border-rose-200'
                        : 'border-slate-200',
                    ].join(
                      ' ',
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>
                        •••
                      </span>
                    </div>

                    <input
                      type="text"
                      value={
                        column
                      }
                      onChange={(
                        event,
                      ) =>
                        updateColumn(
                          index,
                          event.target.value,
                        )
                      }
                      placeholder="열 이름"
                      className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none"
                    />

                    <div className="mt-3 space-y-1">
                      <div className="h-2 rounded bg-slate-100" />
                      <div className="h-2 w-4/5 rounded bg-slate-100" />
                      <div className="h-2 w-2/3 rounded bg-slate-100" />
                    </div>

                    {invalid && (
                      <p className="mt-2 text-[10px] font-bold leading-4 text-rose-500">
                        {duplicate
                          ? '중복 열'
                          : '이름 필요'}
                      </p>
                    )}
                  </div>
                )
              },
            )}

            <button
              type="button"
              onClick={
                addColumn
              }
              className="flex w-[62px] shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400"
            >
              <Plus
                size={
                  22
                }
              />
            </button>
          </div>

          {hasBlankColumn && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              이름이 비어 있는 열은 사용할 수 없습니다.
            </p>
          )}

          {hasDuplicateColumn && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              같은 열 이름을 두 번 사용할 수 없습니다.
            </p>
          )}
        </div>

        <label className="block">
          <span className="mb-3 block text-xs font-bold text-slate-700">
            행 기준{' '}
            <span className="text-rose-500">
              *
            </span>
          </span>

          <select
            value={
              rowKey
            }
            onChange={(
              event,
            ) =>
              save({
                rowKey:
                  event.target.value,
              })
            }
            disabled={
              normalizedColumns.length ===
              0
            }
            className="h-[48px] w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            {normalizedColumns
              .filter(
                (
                  column,
                  index,
                  array,
                ) =>
                  array.indexOf(
                    column,
                  ) ===
                  index,
              )
              .map(
                (column) => (
                  <option
                    key={
                      column
                    }
                    value={
                      column
                    }
                  >
                    {
                      column
                    }
                  </option>
                ),
              )}
          </select>
        </label>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              셀 길이
            </p>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </div>

          <div className="flex overflow-hidden rounded-xl border-2 border-slate-200">
            {tableCellLengthOptions.map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    save({
                      cellLength:
                        option.value,
                    })
                  }
                  className={[
                    'h-[44px] flex-1 border-r border-slate-200 text-xs font-bold last:border-r-0',
                    cellLength ===
                    option.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-slate-600',
                  ].join(
                    ' ',
                  )}
                >
                  {
                    option.label
                  }
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            미리보기
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-3 bg-slate-100">
              {normalizedColumns
                .slice(
                  0,
                  3,
                )
                .map(
                  (
                    column,
                    index,
                  ) => (
                    <div
                      key={
                        `${column}-${index}`
                      }
                      className="px-3 py-3 text-xs font-bold text-slate-700"
                    >
                      {
                        column
                      }
                    </div>
                  ),
                )}
            </div>

            <div className="grid grid-cols-3 border-t border-slate-200">
              <div className="px-3 py-3 text-xs text-slate-600">
                가격
              </div>

              <div className="px-3 py-3 text-xs text-slate-600">
                ₩29,000
              </div>

              <div className="px-3 py-3 text-xs text-slate-600">
                ₩34,000
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-slate-200">
              <div className="px-3 py-3 text-xs text-slate-600">
                지원
              </div>

              <div className="px-3 py-3 text-xs text-slate-600">
                24시간
              </div>

              <div className="px-3 py-3 text-xs text-slate-600">
                평일
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExpandableSettingBlock>
  )
}

/*
 * ============================================================
 * PR-011
 * 체크리스트로 바꾸기
 * ============================================================
 */

const checklistPurposeOptions = [
  '실행',
  '품질',
  '제출',
  'QA',
]

const checklistDetailLevels = [
  '핵심',
  '기본',
  '상세',
]

const checklistStatusOptions = [
  '미완료',
  '진행',
  '완료',
  '보류',
]

export function ChecklistTransformInspector({
  slot,
  onConfigChange,
}: StudioBlockInspectorComponentProps) {
  const checklistPurpose =
    getString(
      slot.config,
      'checklistPurpose',
      '실행',
    )

  const detailLevel =
    getString(
      slot.config,
      'detailLevel',
      '기본',
    )

  const groupBasis =
    getString(
      slot.config,
      'groupBasis',
      '단계',
    )

  const statusValues =
    getStringArray(
      slot.config,
      'statusValues',
      [
        '미완료',
      ],
    )

  const showCompletionCriteria =
    getBoolean(
      slot.config,
      'showCompletionCriteria',
      false,
    )

  const showAssignee =
    getBoolean(
      slot.config,
      'showAssignee',
      false,
    )

  const save = (
    patch: StudioBlockConfig,
  ) => {
    const nextPurpose =
      typeof patch.checklistPurpose ===
        'string'
        ? patch.checklistPurpose
        : checklistPurpose

    const nextDetailLevel =
      typeof patch.detailLevel ===
        'string'
        ? patch.detailLevel
        : detailLevel

    const nextStatusValues =
      'statusValues' in patch
        ? readStringArray(
          patch.statusValues,
          statusValues,
        )
        : statusValues

    const complete =
      Boolean(
        nextPurpose,
      ) &&
      Boolean(
        nextDetailLevel,
      )

    onConfigChange(
      {
        checklistPurpose,
        detailLevel,
        groupBasis,
        statusValues,
        showCompletionCriteria,
        showAssignee,
        ...patch,
      },
      {
        summaryValue:
          complete
            ? `${nextPurpose} · ${nextDetailLevel}`
            : '',

        state:
          resolveState(
            complete,
          ),
      },
    )

    void nextStatusValues
  }

  const toggleStatus = (
    option: string,
  ) => {
    const next =
      statusValues.includes(
        option,
      )
        ? statusValues.filter(
          (item) =>
            item !==
            option,
        )
        : [
          ...statusValues,
          option,
        ]

    save({
      statusValues:
        next,
    })
  }

  return (
    <ExpandableSettingBlock
      title="체크리스트로 바꾸기"
      // code="PR-011"
      // stage="PROCESS"
      // description="내용을 점검 가능한 체크리스트로 변환합니다."
      // icon={
      //   <ListChecks
      //     size={18}
      //   />
      // }
      // category="RECOMMENDED"
      // tagCounts={{
      //   required: 2,
      //   optional: 3,
      // }}
      required={
        slot.required
      }
      defaultOpen
      className={
        studioInspectorClassName
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            기본값으로 적용 가능
          </span>

          <button
            type="button"
            onClick={() =>
              save({})
            }
            className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-bold text-white"
          >
            적용
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            체크 목적{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="grid grid-cols-4 gap-2">
            {checklistPurposeOptions.map(
              (
                option,
              ) => (
                <button
                  key={
                    option
                  }
                  type="button"
                  onClick={() =>
                    save({
                      checklistPurpose:
                        option,
                    })
                  }
                  className={[
                    'min-h-[64px] rounded-xl border-2 text-xs font-bold',
                    checklistPurpose ===
                      option
                      ? 'border-indigo-500 text-indigo-500'
                      : 'border-slate-200 text-slate-600',
                  ].join(
                    ' ',
                  )}
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            상세 수준{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="flex overflow-hidden rounded-xl border-2 border-slate-200">
            {checklistDetailLevels.map(
              (
                option,
              ) => (
                <button
                  key={
                    option
                  }
                  type="button"
                  onClick={() =>
                    save({
                      detailLevel:
                        option,
                    })
                  }
                  className={[
                    'h-[44px] flex-1 border-r border-slate-200 text-xs font-bold last:border-r-0',
                    detailLevel ===
                      option
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-slate-600',
                  ].join(
                    ' ',
                  )}
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </div>

        <label className="block">
          <span className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              그룹 기준
            </span>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </span>

          <select
            value={
              groupBasis
            }
            onChange={(
              event,
            ) =>
              save({
                groupBasis:
                  event.target
                    .value,
              })
            }
            className="h-[48px] w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="단계">
              단계
            </option>

            <option value="기능">
              기능
            </option>

            <option value="담당자">
              담당자
            </option>

            <option value="없음">
              없음
            </option>
          </select>
        </label>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              상태값
            </p>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {checklistStatusOptions.map(
              (
                option,
              ) => {
                const selected =
                  statusValues.includes(
                    option,
                  )

                return (
                  <button
                    key={
                      option
                    }
                    type="button"
                    onClick={() =>
                      toggleStatus(
                        option,
                      )
                    }
                    className="flex h-[34px] items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600"
                  >
                    <span
                      className={[
                        'flex h-4 w-4 items-center justify-center rounded',
                        selected
                          ? 'bg-indigo-500 text-white'
                          : 'border border-slate-300',
                      ].join(
                        ' ',
                      )}
                    >
                      {selected
                        ? '✓'
                        : ''}
                    </span>

                    {option}
                  </button>
                )
              },
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              부가 열
            </p>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </div>

          <div className="space-y-4">
            <ToggleRow
              label="완료 기준 열"
              checked={
                showCompletionCriteria
              }
              onChange={() =>
                save({
                  showCompletionCriteria:
                    !showCompletionCriteria,
                })
              }
            />

            <ToggleRow
              label="담당자 열"
              checked={
                showAssignee
              }
              onChange={() =>
                save({
                  showAssignee:
                    !showAssignee,
                })
              }
            />
          </div>
        </div>
      </div>
    </ExpandableSettingBlock>
  )
}

