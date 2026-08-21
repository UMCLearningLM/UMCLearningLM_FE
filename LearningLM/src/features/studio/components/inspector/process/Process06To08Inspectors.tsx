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
 * BE #78 V15 기준
 *
 * input.policyDocuments:
 * - 업로드 파일:
 *   {
 *     fileId,
 *     fileName,
 *     fileType,
 *     fileSize,
 *   }
 *
 * - 웹 문서:
 *   {
 *     url,
 *     title?,
 *   }
 *
 * options:
 * - targetType
 * - policyTypes
 * - matchingMode
 * - missingPolicy
 *
 * 파일은 POST /flows/{flowId}/files로 먼저 업로드하고
 * 서버가 발급한 실제 fileId를 Studio config에 저장합니다.
 *
 * 웹 URL은 파일과 별도 객체로 저장합니다.
 * 현재 BE에서는 URL 본문을 직접 가져오는 기능은 지원하지 않습니다.
 * ============================================================
 */

type PolicyFileDocument = {
  fileId: number
  fileName: string
  fileType: string
  fileSize: number
}

type PolicyWebDocument = {
  url: string
  title?: string
}

type PolicyDocument =
  | PolicyFileDocument
  | PolicyWebDocument

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
    parsed > 0
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
    (value) =>
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
  if (file.size <= 0) {
    return '빈 파일은 업로드할 수 없습니다.'
  }

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

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      'object' &&
    value !== null &&
    !Array.isArray(
      value,
    )
  )
}

function isPolicyFileDocument(
  value: unknown,
): value is PolicyFileDocument {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.fileId ===
      'number' &&
    value.fileId > 0 &&
    typeof value.fileName ===
      'string' &&
    Boolean(
      value.fileName.trim(),
    ) &&
    typeof value.fileType ===
      'string' &&
    typeof value.fileSize ===
      'number'
  )
}

function isPolicyWebDocument(
  value: unknown,
): value is PolicyWebDocument {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.url ===
      'string' &&
    Boolean(
      value.url.trim(),
    )
  )
}

function readPolicyDocuments(
  value: unknown,
): PolicyDocument[] {
  if (!Array.isArray(value)) {
    return []
  }

  const documents:
    PolicyDocument[] = []

  for (const item of value) {
    if (
      isPolicyFileDocument(
        item,
      )
    ) {
      documents.push({
        fileId:
          item.fileId,

        fileName:
          item.fileName,

        fileType:
          item.fileType,

        fileSize:
          item.fileSize,
      })

      continue
    }

    if (
      isPolicyWebDocument(
        item,
      )
    ) {
      documents.push({
        url:
          item.url.trim(),

        ...(typeof item.title ===
          'string' &&
        item.title.trim()
          ? {
              title:
                item.title.trim(),
            }
          : {}),
      })
    }
  }

  return documents
}

function readLegacyPolicyDocumentNames(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (
      item,
    ): item is string =>
      typeof item ===
        'string' &&
      Boolean(
        item.trim(),
      ),
  )
}

function getPolicyDocumentKey(
  document: PolicyDocument,
): string {
  if (
    'fileId' in
    document
  ) {
    return `file:${document.fileId}`
  }

  return `url:${document.url}`
}

function mergePolicyDocuments(
  current:
    PolicyDocument[],
  additions:
    PolicyDocument[],
): PolicyDocument[] {
  const result =
    [...current]

  const keys =
    new Set(
      current.map(
        getPolicyDocumentKey,
      ),
    )

  for (
    const document of
      additions
  ) {
    const key =
      getPolicyDocumentKey(
        document,
      )

    if (
      keys.has(
        key,
      )
    ) {
      continue
    }

    keys.add(
      key,
    )

    result.push(
      document,
    )
  }

  return result
}

function isValidPolicyUrl(
  value: string,
): boolean {
  try {
    const url =
      new URL(
        value,
      )

    return (
      url.protocol ===
        'http:' ||
      url.protocol ===
        'https:'
    )
  } catch {
    return false
  }
}

function formatPolicyFileSize(
  bytes: number,
): string {
  if (
    bytes <
    1024 * 1024
  ) {
    return `${Math.max(
      1,
      Math.round(
        bytes / 1024,
      ),
    )}KB`
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)}MB`
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

  const [
    webDocumentUrl,
    setWebDocumentUrl,
  ] =
    useState('')

  const [
    webDocumentTitle,
    setWebDocumentTitle,
  ] =
    useState('')

  const [
    webDocumentError,
    setWebDocumentError,
  ] =
    useState('')

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

  const policyDocuments =
    readPolicyDocuments(
      slot.config
        ?.policyDocuments,
    )

  const legacyPolicyDocument =
    getString(
      slot.config,
      'policyDocument',
      '',
    )

  const legacyPolicyDocuments =
    [
      ...readLegacyPolicyDocumentNames(
        slot.config
          ?.policyDocuments,
      ),

      ...(legacyPolicyDocument
        ? [
            legacyPolicyDocument,
          ]
        : []),
    ]

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
        ? readPolicyDocuments(
            patch.policyDocuments,
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
        (option) =>
          option.value ===
          nextTargetType,
      )?.label ??
      nextTargetType

    onConfigChange(
      {
        policyDocuments:
          nextPolicyDocuments,

        targetType:
          nextTargetType,

        policyTypes:
          nextPolicyTypes,

        matchingMode:
          nextMatchingMode,

        missingPolicy:
          nextMissingPolicy,
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
            (item) =>
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

  const removePolicyDocument = (
    target:
      PolicyDocument,
  ) => {
    const targetKey =
      getPolicyDocumentKey(
        target,
      )

    save({
      policyDocuments:
        policyDocuments.filter(
          (document) =>
            getPolicyDocumentKey(
              document,
            ) !==
            targetKey,
        ),
    })
  }

  const addWebDocument =
    () => {
      const normalizedUrl =
        webDocumentUrl.trim()

      if (
        !isValidPolicyUrl(
          normalizedUrl,
        )
      ) {
        setWebDocumentError(
          'http:// 또는 https:// 형식의 URL을 입력해 주세요.',
        )

        return
      }

      const document:
        PolicyWebDocument = {
        url:
          normalizedUrl,

        ...(webDocumentTitle.trim()
          ? {
              title:
                webDocumentTitle.trim(),
            }
          : {}),
      }

      save({
        policyDocuments:
          mergePolicyDocuments(
            policyDocuments,
            [
              document,
            ],
          ),
      })

      setWebDocumentUrl(
        '',
      )

      setWebDocumentTitle(
        '',
      )

      setWebDocumentError(
        '',
      )
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
          (file) => {
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

      const uploadedDocuments:
        PolicyFileDocument[] =
        []

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

            const result =
              response.result

            if (
              result.status ===
              'PARSE_FAILED'
            ) {
              requestErrors.push(
                `${result.fileName}: 서버에서 문서 내용을 처리하지 못했습니다.`,
              )

              continue
            }

            uploadedDocuments.push(
              {
                fileId:
                  result.fileId,

                fileName:
                  result.fileName,

                fileType:
                  result.fileType,

                fileSize:
                  result.fileSize,
              },
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
          uploadedDocuments.length >
          0
        ) {
          save({
            policyDocuments:
              mergePolicyDocuments(
                policyDocuments,
                uploadedDocuments,
              ),
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
              (option) => (
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
            정책 파일{' '}
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
              isUploading ||
              !flowId
                ? 'cursor-not-allowed border-slate-200 opacity-60'
                : 'cursor-pointer border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30',
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
                  : '정책 파일 선택'}
              </p>

              <p className="mt-1 text-[10px] font-bold text-slate-400">
                실제 서버 fileId를 사용합니다.
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

          {legacyPolicyDocuments.length >
            0 && (
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2">
              <p className="text-xs font-bold text-amber-700">
                이전 버전에서 파일명만 저장된 정책 문서가 있습니다.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-amber-600">
                실제 fileId가 없어 AI 파일 컨텍스트로 사용할 수 없습니다. 정책 파일을 다시 업로드해 주세요.
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              웹 문서 URL
            </p>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="url"
              value={
                webDocumentUrl
              }
              onChange={(
                event,
              ) => {
                setWebDocumentUrl(
                  event.target.value,
                )

                if (
                  webDocumentError
                ) {
                  setWebDocumentError(
                    '',
                  )
                }
              }}
              placeholder="https://example.com/policy"
              className="h-[46px] w-full rounded-xl border-2 border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
            />

            <input
              type="text"
              value={
                webDocumentTitle
              }
              onChange={(
                event,
              ) =>
                setWebDocumentTitle(
                  event.target.value,
                )
              }
              placeholder="문서 제목 · 선택"
              className="h-[46px] w-full rounded-xl border-2 border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={
                addWebDocument
              }
              className="h-[42px] w-full rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-300"
            >
              웹 문서 추가
            </button>
          </div>

          {webDocumentError && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              {
                webDocumentError
              }
            </p>
          )}

          <p className="mt-2 text-[11px] leading-5 text-amber-600">
            URL 값은 파일과 구분해 전달합니다. 현재 백엔드는 웹 페이지 본문을 직접 불러오는 기능을 지원하지 않습니다.
          </p>
        </div>

        {policyDocuments.length >
          0 && (
          <div>
            <p className="mb-2 text-xs font-bold text-slate-700">
              연결된 정책 문서
            </p>

            <div className="space-y-2">
              {policyDocuments.map(
                (
                  document,
                ) => {
                  const isFile =
                    'fileId' in
                    document

                  const key =
                    getPolicyDocumentKey(
                      document,
                    )

                  return (
                    <div
                      key={
                        key
                      }
                      className="flex min-h-[64px] items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500">
                        {isFile
                          ? 'DOC'
                          : 'URL'}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-700">
                          {isFile
                            ? document.fileName
                            : document.title ||
                              document.url}
                        </p>

                        <p className="mt-1 truncate text-[10px] font-semibold text-slate-400">
                          {isFile
                            ? `fileId ${document.fileId} · ${formatPolicyFileSize(
                                document.fileSize,
                              )}`
                            : document.url}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removePolicyDocument(
                            document,
                          )
                        }
                        className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-500 hover:border-rose-200 hover:text-rose-500"
                      >
                        제외
                      </button>
                    </div>
                  )
                },
              )}
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              제외하면 서버 파일 자체를 삭제하지 않고 현재 Preview 요청에서만 빠집니다.
            </p>
          </div>
        )}

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