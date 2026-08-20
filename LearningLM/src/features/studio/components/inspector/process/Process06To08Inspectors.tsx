import {
  useRef,
  useState,
} from 'react'

import {
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import {
  uploadFlowFile,
} from '../../../../../pages/api/StudioApi'

import {
  Layers3,
  Link2,
  TriangleAlert,
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
 * PR-006
 * 기능으로 분해하기
 *
 * UI 문구는 기존 와이어프레임을 유지하되,
 * Studio config에는 BE main V9 schema의 key / enum을 저장합니다.
 *
 * BE:
 * decomposeTarget: SCREEN | REQUIREMENT | FLOW | DOCUMENT
 * decomposeLevel: HIGH | BASIC | DETAILED
 * includeInfo: NAME | PURPOSE | TRIGGER | INPUT | STATUS
 *
 * 기존 저장 Flow의 한글/legacy key도 읽을 수 있게 호환 처리합니다.
 * ============================================================
 */

const decompositionTargets = [
  { label: '화면', value: 'SCREEN' },
  { label: '요구사항', value: 'REQUIREMENT' },
  { label: '흐름', value: 'FLOW' },
  { label: '문서', value: 'DOCUMENT' },
] as const

const decompositionLevels = [
  { label: '상위', value: 'HIGH' },
  { label: '기본', value: 'BASIC' },
  { label: '세부', value: 'DETAILED' },
] as const

const decompositionInfoOptions = [
  { label: '기능명', value: 'NAME' },
  { label: '목적', value: 'PURPOSE' },
  { label: '트리거', value: 'TRIGGER' },
  { label: '입력', value: 'INPUT' },
  {
    label: '출력',
    value: 'OUTPUT',
    backendUnsupported: true,
  },
  { label: '상태', value: 'STATUS' },
] as const

const legacyDecomposeTargetMap: Record<string, string> = {
  화면: 'SCREEN',
  요구사항: 'REQUIREMENT',
  흐름: 'FLOW',
  문서: 'DOCUMENT',
}

const legacyDecomposeLevelMap: Record<string, string> = {
  상위: 'HIGH',
  기본: 'BASIC',
  세부: 'DETAILED',
}

const legacyIncludeInfoMap: Record<string, string> = {
  기능명: 'NAME',
  목적: 'PURPOSE',
  트리거: 'TRIGGER',
  입력: 'INPUT',
  출력: 'OUTPUT',
  상태: 'STATUS',
}

function normalizeDecomposeTarget(value: string): string {
  return legacyDecomposeTargetMap[value] ?? value
}

function normalizeDecomposeLevel(value: string): string {
  return legacyDecomposeLevelMap[value] ?? value
}

function normalizeIncludeInfo(values: string[]): string[] {
  return values
    .map((value) => legacyIncludeInfoMap[value] ?? value)
    .filter((value) => value !== 'OUTPUT')
}

export function DecomposeFunctionsInspector({
  slot,
  onConfigChange,
}: StudioBlockInspectorComponentProps) {
  const decomposeTarget = normalizeDecomposeTarget(
    getString(
      slot.config,
      'decomposeTarget',
      getString(slot.config, 'decompositionTarget', 'SCREEN'),
    ),
  )

  const decomposeLevel = normalizeDecomposeLevel(
    getString(
      slot.config,
      'decomposeLevel',
      getString(slot.config, 'decompositionLevel', 'BASIC'),
    ),
  )

  const includeInfo = normalizeIncludeInfo(
    getStringArray(
      slot.config,
      'includeInfo',
      getStringArray(slot.config, 'includedInfo', ['NAME', 'PURPOSE']),
    ),
  )

  const groupByScreen = getBoolean(slot.config, 'groupByScreen', false)
  const autoAssignId = getBoolean(slot.config, 'autoAssignId', false)

  const showRequirementLevel = getBoolean(
    slot.config,
    'showRequirementLevel',
    false,
  )

  const save = (patch: StudioBlockConfig) => {
    const nextTarget =
      typeof patch.decomposeTarget === 'string'
        ? normalizeDecomposeTarget(patch.decomposeTarget)
        : decomposeTarget

    const nextLevel =
      typeof patch.decomposeLevel === 'string'
        ? normalizeDecomposeLevel(patch.decomposeLevel)
        : decomposeLevel

    const nextIncludeInfo =
      'includeInfo' in patch
        ? normalizeIncludeInfo(readStringArray(patch.includeInfo, includeInfo))
        : includeInfo

    const nextGroupByScreen =
      typeof patch.groupByScreen === 'boolean'
        ? patch.groupByScreen
        : groupByScreen

    const nextAutoAssignId =
      typeof patch.autoAssignId === 'boolean'
        ? patch.autoAssignId
        : autoAssignId

    const nextShowRequirementLevel =
      typeof patch.showRequirementLevel === 'boolean'
        ? patch.showRequirementLevel
        : showRequirementLevel

    const complete =
      Boolean(nextTarget) &&
      Boolean(nextLevel) &&
      nextIncludeInfo.length > 0

    const targetLabel =
      decompositionTargets.find((option) => option.value === nextTarget)?.label ??
      nextTarget

    const levelLabel =
      decompositionLevels.find((option) => option.value === nextLevel)?.label ??
      nextLevel

    onConfigChange(
      {
        decomposeTarget: nextTarget,
        decomposeLevel: nextLevel,
        includeInfo: nextIncludeInfo,
        groupByScreen: nextGroupByScreen,
        autoAssignId: nextAutoAssignId,
        showRequirementLevel: nextShowRequirementLevel,
      },
      {
        summaryValue: complete ? `${targetLabel} · ${levelLabel}` : '',
        state: resolveState(complete),
      },
    )
  }

  const toggleIncludeInfo = (value: string) => {
    if (value === 'OUTPUT') {
      return
    }

    const next = includeInfo.includes(value)
      ? includeInfo.filter((current) => current !== value)
      : [...includeInfo, value]

    save({ includeInfo: next })
  }

  return (
    <ExpandableSettingBlock
      title="기능으로 분해하기"
      required={slot.required}
      defaultOpen
      className={studioInspectorClassName}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            기본값으로 적용 가능
          </span>

          <button
            type="button"
            onClick={() => save({})}
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
            분해 대상 <span className="text-rose-500">*</span>
          </p>

          <div className="grid grid-cols-4 gap-2">
            {decompositionTargets.map((option) => {
              const selected = decomposeTarget === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => save({ decomposeTarget: option.value })}
                  className={[
                    'h-[48px] rounded-xl border-2 text-xs font-bold',
                    selected
                      ? 'border-indigo-500 text-indigo-500'
                      : 'border-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            분해 수준 <span className="text-rose-500">*</span>
          </p>

          <div className="flex overflow-hidden rounded-xl border-2 border-slate-200">
            {decompositionLevels.map((option) => {
              const selected = decomposeLevel === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => save({ decomposeLevel: option.value })}
                  className={[
                    'h-[44px] flex-1 border-r border-slate-200 text-xs font-bold last:border-r-0',
                    selected
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-slate-600',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            포함 정보 <span className="text-rose-500">*</span>
          </p>

          <div className="flex flex-wrap gap-2">
            {decompositionInfoOptions.map((option) => {
              const selected = includeInfo.includes(option.value)
              const disabled =
                'backendUnsupported' in option && option.backendUnsupported

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  title={
                    disabled
                      ? '현재 백엔드 PR-006 스키마에서 지원하지 않는 항목입니다.'
                      : undefined
                  }
                  onClick={() => toggleIncludeInfo(option.value)}
                  className={[
                    'flex h-[34px] items-center gap-2 rounded-lg border px-3 text-xs font-bold',
                    disabled
                      ? 'cursor-not-allowed border-slate-200 text-slate-300 opacity-60'
                      : selected
                        ? 'border-indigo-200 text-indigo-600'
                        : 'border-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex h-4 w-4 items-center justify-center rounded',
                      disabled
                        ? 'border border-slate-200'
                        : selected
                          ? 'bg-indigo-500 text-white'
                          : 'border border-slate-300',
                    ].join(' ')}
                  >
                    {selected ? '✓' : ''}
                  </span>

                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">그룹화</p>
            <span className="text-[11px] text-emerald-500">선택</span>
          </div>

          <ToggleRow
            label="화면별로 그룹"
            checked={groupByScreen}
            onChange={() => save({ groupByScreen: !groupByScreen })}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">ID·우선순위</p>
            <span className="text-[11px] text-emerald-500">선택</span>
          </div>

          <div className="space-y-4">
            <ToggleRow
              label="자동 ID 부여"
              checked={autoAssignId}
              onChange={() => save({ autoAssignId: !autoAssignId })}
            />

            <ToggleRow
              label="필수·권장 표시"
              checked={showRequirementLevel}
              onChange={() =>
                save({ showRequirementLevel: !showRequirementLevel })
              }
            />
          </div>
        </div>
      </div>
    </ExpandableSettingBlock>
  )
}

/*
 * ============================================================
 * PR-007
 * 정책과 연결하기
 *
 * BE main:
 * - input.policyDocuments: string[]
 * - options.targetType
 * - options.policyTypes
 * - options.matchingMode
 * - options.missingPolicy
 *
 * 정책 파일은 POST /flows/{flowId}/files로 서버에 업로드합니다.
 * Flow Preview에서 BE가 해당 Flow의 업로드 파일을 REFERENCE artifact로
 * AI에 전달하므로, policyDocuments에는 업로드 성공한 파일명을 저장합니다.
 * ============================================================
 */

const policyLinkTargets = [
  {
    label: '기능',
    value: 'FEATURE',
  },
  {
    label: '화면',
    value: 'SCREEN',
  },
  {
    label: '행동',
    value: 'BEHAVIOR',
  },
  {
    label: '데이터',
    value: 'DATA',
  },
] as const

const policyTypeOptions = [
  {
    label: '권한',
    value: 'PERMISSION',
  },
  {
    label: '상태',
    value: 'STATUS',
  },
  {
    label: '검증',
    value: 'VALIDATION',
  },
  {
    label: '예외',
    value: 'EXCEPTION',
  },
  {
    label: '저장',
    value: 'PERSISTENCE',
  },
  {
    label: '공개',
    value: 'PUBLICATION',
  },
] as const

const policyMatchingModeOptions = [
  {
    label: '직접',
    value: 'MANUAL',
  },
  {
    label: '추천',
    value: 'RECOMMENDED',
  },
] as const

const noPolicyHandlingOptions = [
  {
    label: '미정으로 표시',
    value: 'UNDECIDED',
  },
  {
    label: '질문으로 남김',
    value: 'QUESTION',
  },
  {
    label: '제외',
    value: 'EXCLUDE',
  },
] as const

const policyAllowedExtensions =
  new Set([
    'pdf',
    'docx',
    'xlsx',
    'jpg',
    'jpeg',
    'png',
  ])

const policyMaxFileSize =
  20 *
  1024 *
  1024

const legacyPolicyTargetMap:
  Record<string, string> = {
    기능: 'FEATURE',
    화면: 'SCREEN',
    행동: 'BEHAVIOR',
    데이터: 'DATA',
  }

const legacyPolicyTypeMap:
  Record<string, string> = {
    권한: 'PERMISSION',
    상태: 'STATUS',
    검증: 'VALIDATION',
    예외: 'EXCEPTION',
    저장: 'PERSISTENCE',
    공개: 'PUBLICATION',
  }

const legacyPolicyMatchingModeMap:
  Record<string, string> = {
    직접: 'MANUAL',
    추천: 'RECOMMENDED',
  }

const legacyMissingPolicyMap:
  Record<string, string> = {
    '미정으로 표시':
      'UNDECIDED',
    '질문으로 남김':
      'QUESTION',
    제외: 'EXCLUDE',
  }

function parsePolicyFlowId(
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
    parsed >
      0
  )
    ? parsed
    : undefined
}

function normalizePolicyTarget(
  value: string,
): string {
  return (
    legacyPolicyTargetMap[
      value
    ] ??
    value
  )
}

function normalizePolicyTypes(
  values: string[],
): string[] {
  return values.map(
    (
      value,
    ) =>
      legacyPolicyTypeMap[
        value
      ] ??
      value,
  )
}

function normalizePolicyMatchingMode(
  value: string,
): string {
  return (
    legacyPolicyMatchingModeMap[
      value
    ] ??
    value
  )
}

function normalizeMissingPolicy(
  value: string,
): string {
  return (
    legacyMissingPolicyMap[
      value
    ] ??
    value
  )
}

function getPolicyFileValidationError(
  file: File,
): string | null {
  const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() ??
    ''

  if (
    !policyAllowedExtensions.has(
      extension,
    )
  ) {
    return '지원하지 않는 파일 형식입니다.'
  }

  if (
    file.size >
    policyMaxFileSize
  ) {
    return '20MB 용량을 초과했습니다.'
  }

  return null
}

export function LinkPolicyInspector({
  slot,
  onConfigChange,
}: StudioBlockInspectorComponentProps) {
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

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    )

  const [
    isUploading,
    setIsUploading,
  ] =
    useState(false)

  const [
    uploadErrors,
    setUploadErrors,
  ] =
    useState<string[]>(
      [],
    )

  const locationState =
    location.state as
      | {
          flowId?:
            | number
            | string
            | null
        }
      | null

  const flowId =
    parsePolicyFlowId(
      searchParams.get(
        'flowId',
      ),
    ) ??
    parsePolicyFlowId(
      routeFlowId,
    ) ??
    parsePolicyFlowId(
      locationState?.flowId,
    )

  const legacyPolicyDocument =
    getString(
      slot.config,
      'policyDocument',
      '',
    )

  const policyDocuments =
    getStringArray(
      slot.config,
      'policyDocuments',
      legacyPolicyDocument
        ? [
            legacyPolicyDocument,
          ]
        : [],
    )

  const targetType =
    normalizePolicyTarget(
      getString(
        slot.config,
        'targetType',
        getString(
          slot.config,
          'connectionTarget',
          'FEATURE',
        ),
      ),
    )

  const policyTypes =
    normalizePolicyTypes(
      getStringArray(
        slot.config,
        'policyTypes',
      ),
    )

  const matchingMode =
    normalizePolicyMatchingMode(
      getString(
        slot.config,
        'matchingMode',
        'RECOMMENDED',
      ),
    )

  const missingPolicy =
    normalizeMissingPolicy(
      getString(
        slot.config,
        'missingPolicy',
        getString(
          slot.config,
          'noPolicyHandling',
          'UNDECIDED',
        ),
      ),
    )

  const complete =
    Boolean(
      targetType,
    ) &&
    policyDocuments.length >
      0 &&
    policyTypes.length >
      0 &&
    Boolean(
      matchingMode,
    ) &&
    Boolean(
      missingPolicy,
    )

  const save = (
    patch:
      StudioBlockConfig,
  ) => {
    const nextTargetType =
      typeof patch.targetType ===
        'string'
        ? normalizePolicyTarget(
            patch.targetType,
          )
        : targetType

    const nextPolicyDocuments =
      'policyDocuments' in
        patch
        ? readStringArray(
            patch.policyDocuments,
            policyDocuments,
          )
        : policyDocuments

    const nextPolicyTypes =
      'policyTypes' in
        patch
        ? normalizePolicyTypes(
            readStringArray(
              patch.policyTypes,
              policyTypes,
            ),
          )
        : policyTypes

    const nextMatchingMode =
      typeof patch.matchingMode ===
        'string'
        ? normalizePolicyMatchingMode(
            patch.matchingMode,
          )
        : matchingMode

    const nextMissingPolicy =
      typeof patch.missingPolicy ===
        'string'
        ? normalizeMissingPolicy(
            patch.missingPolicy,
          )
        : missingPolicy

    const nextComplete =
      Boolean(
        nextTargetType,
      ) &&
      nextPolicyDocuments.length >
        0 &&
      nextPolicyTypes.length >
        0 &&
      Boolean(
        nextMatchingMode,
      ) &&
      Boolean(
        nextMissingPolicy,
      )

    const targetLabel =
      policyLinkTargets.find(
        (
          option,
        ) =>
          option.value ===
          nextTargetType,
      )?.label ??
      nextTargetType

    onConfigChange(
      {
        /*
         * BE PR-007 input_schema.
         * 현재 Preview 정규화 과정에서 input으로 분류될 값입니다.
         */
        policyDocuments:
          nextPolicyDocuments,

        /*
         * BE PR-007 option_schema.
         */
        targetType:
          nextTargetType,

        policyTypes:
          nextPolicyTypes,

        matchingMode:
          nextMatchingMode,

        missingPolicy:
          nextMissingPolicy,

        ...patch,
      },
      {
        summaryValue:
          nextComplete
            ? `${targetLabel} · 정책 문서 ${nextPolicyDocuments.length}개`
            : '',

        state:
          resolveState(
            nextComplete,
          ),
      },
    )
  }

  const togglePolicyType = (
    value: string,
  ) => {
    const next =
      policyTypes.includes(
        value,
      )
        ? policyTypes.filter(
            (
              item,
            ) =>
              item !==
              value,
          )
        : [
            ...policyTypes,
            value,
          ]

    save({
      policyTypes:
        next,
    })
  }

  const handlePolicyFiles =
    async (
      files:
        | FileList
        | File[],
    ) => {
      const selectedFiles =
        Array.from(
          files,
        )

      if (
        selectedFiles.length ===
          0 ||
        isUploading
      ) {
        return
      }

      if (!flowId) {
        setUploadErrors([
          'Flow ID가 없어 정책 문서를 업로드할 수 없습니다. 스튜디오를 다시 진입해 주세요.',
        ])

        return
      }

      const validationErrors:
        string[] = []

      const validFiles =
        selectedFiles.filter(
          (
            file,
          ) => {
            const error =
              getPolicyFileValidationError(
                file,
              )

            if (error) {
              validationErrors.push(
                `${file.name}: ${error}`,
              )

              return false
            }

            return true
          },
        )

      if (
        validFiles.length ===
        0
      ) {
        setUploadErrors(
          validationErrors,
        )

        return
      }

      setIsUploading(
        true,
      )

      const uploadedDocumentNames:
        string[] = []

      const requestErrors =
        [
          ...validationErrors,
        ]

      try {
        for (
          const file of
            validFiles
        ) {
          try {
            const response =
              await uploadFlowFile(
                flowId,
                file,
              )

            if (
              !response.success
            ) {
              throw new Error(
                response.message ||
                  '정책 문서 업로드에 실패했습니다.',
              )
            }

            if (
              response.result.status ===
              'PARSE_FAILED'
            ) {
              requestErrors.push(
                `${response.result.fileName}: 서버에서 문서 내용을 처리하지 못했습니다.`,
              )

              continue
            }

            uploadedDocumentNames.push(
              response.result.fileName,
            )
          } catch (
            error
          ) {
            requestErrors.push(
              `${file.name}: ${
                error instanceof
                  Error &&
                error.message
                  ? error.message
                  : '정책 문서 업로드에 실패했습니다.'
              }`,
            )
          }
        }

        if (
          uploadedDocumentNames.length >
          0
        ) {
          save({
            policyDocuments: [
              ...new Set([
                ...policyDocuments,
                ...uploadedDocumentNames,
              ]),
            ],
          })
        }

        setUploadErrors(
          requestErrors,
        )
      } finally {
        setIsUploading(
          false,
        )
      }
    }

  return (
    <ExpandableSettingBlock
      title="정책과 연결하기"
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
            {isUploading
              ? '정책 문서 업로드 중'
              : complete
                ? '정책 연결 설정 완료'
                : '정책 연결 설정 대기'}
          </span>

          <button
            type="button"
            disabled={
              isUploading
            }
            onClick={() =>
              save({})
            }
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            검증
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            연결 대상{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="grid grid-cols-4 gap-2">
            {policyLinkTargets.map(
              (
                option,
              ) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    save({
                      targetType:
                        option.value,
                    })
                  }
                  className={[
                    'h-[44px] rounded-xl border-2 text-xs font-bold',
                    targetType ===
                      option.value
                      ? 'border-indigo-500 text-indigo-500'
                      : 'border-slate-200 text-slate-600',
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
            정책 문서{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={(
              event,
            ) => {
              if (
                event.target
                  .files
              ) {
                void handlePolicyFiles(
                  event.target
                    .files,
                )
              }

              event.target.value =
                ''
            }}
          />

          <button
            type="button"
            disabled={
              isUploading ||
              !flowId
            }
            onClick={() =>
              fileInputRef.current?.click()
            }
            className={[
              'flex min-h-[64px] w-full items-center gap-3 rounded-xl border-2 px-4 text-left transition',
              policyDocuments.length >
                0
                ? 'border-slate-200 bg-white'
                : 'border-rose-200 bg-rose-50',
              isUploading ||
              !flowId
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30',
            ].join(
              ' ',
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-[10px] font-bold text-slate-400">
              DOC
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-500">
                {isUploading
                  ? '정책 문서를 서버에 업로드하고 있습니다.'
                  : policyDocuments.length >
                      0
                    ? '정책 문서 추가 선택'
                    : '정책 문서를 선택하세요'}
              </p>

              <p
                className={[
                  'mt-1 text-[10px] font-bold',
                  policyDocuments.length >
                    0
                    ? 'text-emerald-500'
                    : 'text-rose-400',
                ].join(
                  ' ',
                )}
              >
                {policyDocuments.length >
                0
                  ? `${policyDocuments.length}개 선택됨`
                  : '필수 · 미선택'}
              </p>
            </div>
          </button>

          {!flowId && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              Flow ID를 확인할 수 없어 업로드가 비활성화되었습니다.
            </p>
          )}

          <p className="mt-2 text-[11px] text-slate-400">
            PDF · DOCX · XLSX · JPG · PNG · 파일당 최대 20MB
          </p>

          {uploadErrors.length >
            0 && (
            <div className="mt-2 rounded-lg bg-rose-50 px-3 py-2">
              {uploadErrors.map(
                (
                  message,
                ) => (
                  <p
                    key={
                      message
                    }
                    className="text-xs font-semibold leading-5 text-rose-600"
                  >
                    {
                      message
                    }
                  </p>
                ),
              )}
            </div>
          )}

          {policyDocuments.length >
            0 && (
            <div className="mt-3 space-y-2">
              {policyDocuments.map(
                (
                  document,
                ) => (
                  <div
                    key={
                      document
                    }
                    className="flex min-h-[58px] items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500">
                      DOC
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-700">
                        {
                          document
                        }
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-emerald-500">
                        서버 업로드 완료
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            정책 유형{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="flex flex-wrap gap-2">
            {policyTypeOptions.map(
              (
                option,
              ) => {
                const selected =
                  policyTypes.includes(
                    option.value,
                  )

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      togglePolicyType(
                        option.value,
                      )
                    }
                    className={[
                      'flex h-[34px] items-center gap-2 rounded-lg border px-3 text-xs font-bold',
                      selected
                        ? 'border-indigo-200 text-indigo-600'
                        : 'border-slate-200 text-slate-600',
                    ].join(
                      ' ',
                    )}
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

                    {
                      option.label
                    }
                  </button>
                )
              },
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            매칭 방식{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="flex overflow-hidden rounded-xl border-2 border-slate-200">
            {policyMatchingModeOptions.map(
              (
                option,
              ) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    save({
                      matchingMode:
                        option.value,
                    })
                  }
                  className={[
                    'h-[44px] flex-1 text-xs font-bold',
                    matchingMode ===
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
            정책 없음 처리{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="space-y-2">
            {noPolicyHandlingOptions.map(
              (
                option,
              ) => {
                const selected =
                  missingPolicy ===
                  option.value

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      save({
                        missingPolicy:
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
 * PR-008
 * 예외 케이스 찾기
 *
 * BE main V9 schema의 enum/key를 config에 저장하고,
 * UI에는 기존 한글 라벨을 그대로 보여줍니다.
 * ============================================================
 */

const exceptionTypeOptions = [
  { label: '빈 상태', value: 'EMPTY_STATE' },
  { label: '입력 오류', value: 'INPUT' },
  { label: '네트워크', value: 'NETWORK' },
  { label: '권한', value: 'PERMISSION' },
  { label: '중복', value: 'DUPLICATE' },
  { label: '삭제', value: 'DELETION' },
  { label: '한도 초과', value: 'LIMIT' },
] as const

const exceptionAnalysisScopes = [
  { label: '선택 기능', value: 'SELECTED_FEATURE' },
  { label: '단계', value: 'STAGE' },
  { label: '전체', value: 'ALL' },
] as const

const responseScopeOptions = [
  { label: '사용자 대응', value: 'USER' },
  { label: '시스템 대응', value: 'SYSTEM' },
  { label: '정책 질문', value: 'POLICY_QUESTION' },
] as const

const legacyExceptionTypeMap: Record<string, string> = {
  '빈 상태': 'EMPTY_STATE',
  '입력 오류': 'INPUT',
  네트워크: 'NETWORK',
  권한: 'PERMISSION',
  중복: 'DUPLICATE',
  삭제: 'DELETION',
  '한도 초과': 'LIMIT',
}

const legacyExceptionScopeMap: Record<string, string> = {
  '선택 기능': 'SELECTED_FEATURE',
  단계: 'STAGE',
  전체: 'ALL',
}

const legacyResponseScopeMap: Record<string, string> = {
  '사용자 대응': 'USER',
  '시스템 대응': 'SYSTEM',
  '정책 질문': 'POLICY_QUESTION',
}

function normalizeExceptionTypes(values: string[]): string[] {
  return values.map((value) => legacyExceptionTypeMap[value] ?? value)
}

function normalizeExceptionScope(value: string): string {
  return legacyExceptionScopeMap[value] ?? value
}

function normalizeResponseScopes(values: string[]): string[] {
  return values.map((value) => legacyResponseScopeMap[value] ?? value)
}

export function FindExceptionsInspector({
  slot,
  onConfigChange,
}: StudioBlockInspectorComponentProps) {
  const exceptionTypes = normalizeExceptionTypes(
    getStringArray(slot.config, 'exceptionTypes', ['EMPTY_STATE', 'INPUT']),
  )

  const analysisScope = normalizeExceptionScope(
    getString(slot.config, 'analysisScope', 'ALL'),
  )

  const includeSeverity = getBoolean(
    slot.config,
    'includeSeverity',
    getBoolean(slot.config, 'showSeverity', false),
  )

  const responseScopes = normalizeResponseScopes(
    getStringArray(slot.config, 'responseScopes'),
  )

  const save = (patch: StudioBlockConfig) => {
    const nextTypes =
      'exceptionTypes' in patch
        ? normalizeExceptionTypes(
            readStringArray(patch.exceptionTypes, exceptionTypes),
          )
        : exceptionTypes

    const nextScope =
      typeof patch.analysisScope === 'string'
        ? normalizeExceptionScope(patch.analysisScope)
        : analysisScope

    const nextIncludeSeverity =
      typeof patch.includeSeverity === 'boolean'
        ? patch.includeSeverity
        : includeSeverity

    const nextResponseScopes =
      'responseScopes' in patch
        ? normalizeResponseScopes(
            readStringArray(patch.responseScopes, responseScopes),
          )
        : responseScopes

    const complete = nextTypes.length > 0 && Boolean(nextScope)

    const scopeLabel =
      exceptionAnalysisScopes.find((option) => option.value === nextScope)
        ?.label ?? nextScope

    onConfigChange(
      {
        exceptionTypes: nextTypes,
        analysisScope: nextScope,
        includeSeverity: nextIncludeSeverity,
        responseScopes: nextResponseScopes,
      },
      {
        summaryValue: complete
          ? `유형 ${nextTypes.length}개 · ${scopeLabel}`
          : '',
        state: resolveState(complete),
      },
    )
  }

  const toggleExceptionType = (value: string) => {
    const next = exceptionTypes.includes(value)
      ? exceptionTypes.filter((current) => current !== value)
      : [...exceptionTypes, value]

    save({ exceptionTypes: next })
  }

  const toggleResponseScope = (value: string) => {
    const next = responseScopes.includes(value)
      ? responseScopes.filter((current) => current !== value)
      : [...responseScopes, value]

    save({ responseScopes: next })
  }

  const analysisScopeLabel =
    exceptionAnalysisScopes.find((option) => option.value === analysisScope)
      ?.label ?? analysisScope

  return (
    <ExpandableSettingBlock
      title="예외 케이스 찾기"
      required={slot.required}
      defaultOpen
      className={studioInspectorClassName}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            유형 {exceptionTypes.length}개 선택 · {analysisScopeLabel} 범위
          </span>

          <button
            type="button"
            onClick={() => save({})}
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
            예외 유형 <span className="text-rose-500">*</span>
          </p>

          <div className="space-y-2">
            {exceptionTypeOptions.map((option) => {
              const selected = exceptionTypes.includes(option.value)

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleExceptionType(option.value)}
                  className={[
                    'flex h-[48px] w-full items-center gap-3 rounded-xl border-2 px-4 text-left text-sm font-bold',
                    selected
                      ? 'border-indigo-500 text-slate-700'
                      : 'border-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'h-4 w-4 rounded',
                      selected
                        ? 'bg-indigo-500'
                        : 'border border-slate-300',
                    ].join(' ')}
                  />

                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold text-slate-700">
            분석 범위 <span className="text-rose-500">*</span>
          </p>

          <div className="flex gap-2">
            {exceptionAnalysisScopes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => save({ analysisScope: option.value })}
                className={[
                  'h-[38px] rounded-lg px-4 text-xs font-bold',
                  analysisScope === option.value
                    ? 'text-indigo-500'
                    : 'border border-slate-200 text-slate-600',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">심각도</p>
            <span className="text-[11px] text-emerald-500">선택</span>
          </div>

          <ToggleRow
            label="치명적·주의·경미 구분 표시"
            checked={includeSeverity}
            onChange={() => save({ includeSeverity: !includeSeverity })}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">대응 범위</p>
            <span className="text-[11px] text-emerald-500">선택</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {responseScopeOptions.map((option) => {
              const selected = responseScopes.includes(option.value)

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleResponseScope(option.value)}
                  className={[
                    'flex h-[34px] items-center gap-2 rounded-lg border px-3 text-xs font-bold',
                    selected
                      ? 'border-indigo-200 text-indigo-600'
                      : 'border-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'h-4 w-4 rounded',
                      selected
                        ? 'bg-indigo-500'
                        : 'border border-slate-300',
                    ].join(' ')}
                  />

                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </ExpandableSettingBlock>
  )
}