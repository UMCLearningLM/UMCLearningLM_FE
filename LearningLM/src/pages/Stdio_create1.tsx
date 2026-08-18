import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from 'react'

import {
  MarkerType,
  ReactFlow,
  type Edge,
} from '@xyflow/react'

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { Header } from '../components/layout/Header'
import searchRound from '../assets/searchRound.svg'
import searchStick from '../assets/searchStick.svg'
import dashed from '../assets/dashed.png'
import {
  studioNodeTypes,
  type StudioFlowNodeInstance,
} from '../features/studio/components/node/StudioFlowNode'

import {
  hasStudioBlockInspector,
  StudioBlockInspector,
} from '../features/studio/components/inspector/StudioBlockInspector'

import {
  STUDIO_STAGE_ORDER,
  getStudioBlockDefinition,
  studioBlockCatalog,
  studioStageLabelMap,
} from '../features/studio/data/studioBlockCatalog'

import { useStudioEditor } from '../features/studio/hooks/useStudioEditor'

import type {
  StudioBlockDefinition,
  StudioBlockRequirement,
} from '../features/studio/types/studioBlock'

import type {
  StudioNodeSlot,
  StudioStage,
} from '../features/studio/types/studioNode'

import type {
  StudioValidationIssue,
  StudioWorkflowValidationResult,
} from '../features/studio/types/studioValidation'

import type {
  StudioSaveDraft,
  StudioSaveMode,
  StudioSaveNavigationState,
} from '../features/studio/types/studioSave'

import {
  hydrateStudioFlowFromApi,
} from '../features/studio/utils/hydrateStudioFlow'

import {
  getFlow,
} from './api/StudioApi'

type ValidationCheckStatus =
  | 'pass'
  | 'fail'
  | 'warning'
  | 'pending'

type ValidationCheck = {
  id: number
  title: string
  status: ValidationCheckStatus
  criterion: string
  result: string
}

function parseFlowId(
  value: string | number | null | undefined,
): number | undefined {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return undefined
  }

  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0
    ? parsed
    : undefined
}

function parseStudioMode(
  value: string | null,
): StudioSaveMode | undefined {
  if (
    value === 'guided' ||
    value === 'create' ||
    value === 'copied' ||
    value === 'edit' ||
    value === 'preview'
  ) {
    return value
  }

  return undefined
}

function getAccessToken() {
  return (
    localStorage.getItem(
      'accessToken',
    ) ??
    sessionStorage.getItem(
      'accessToken',
    ) ??
    undefined
  )
}

const stageStyleMap: Record<
  StudioStage,
  {
    dot: string
    text: string
    soft: string
  }
> = {
  INPUT: {
    dot: 'bg-[#4A5E8A]',
    text: 'text-[#4A5E8A]',
    soft: 'bg-[#EEF1F7]',
  },
  CONTEXT: {
    dot: 'bg-[#2F8190]',
    text: 'text-[#2F8190]',
    soft: 'bg-[#EDF7F8]',
  },
  PROCESS: {
    dot: 'bg-[#6366F1]',
    text: 'text-[#6366F1]',
    soft: 'bg-[#F0F0FF]',
  },
  REVIEW: {
    dot: 'bg-[#B07A2E]',
    text: 'text-[#B07A2E]',
    soft: 'bg-[#FBF6EC]',
  },
  OUTPUT: {
    dot: 'bg-[#3C7A52]',
    text: 'text-[#3C7A52]',
    soft: 'bg-[#EEF4EE]',
  },
}

const requirementStyleMap: Record<
  StudioBlockRequirement,
  {
    label: string
    className: string
  }
> = {
  required: {
    label: '필수',
    className: 'text-[#6366F1]',
  },
  recommended: {
    label: '권장',
    className:
      'rounded-[8px] bg-[#EEF4EE] px-[8px] py-[4px] text-[#3C7A52]',
  },
  optional: {
    label: '선택',
    className:
      'rounded-[8px] bg-[#F0F0F3] px-[8px] py-[4px] text-[#9A9AA3]',
  },
}

const validationStatusStyleMap: Record<
  ValidationCheckStatus,
  {
    dot: string
    badge: string
    label: string
  }
> = {
  pass: {
    dot: 'bg-[#2F8A5B]',
    badge: 'bg-[#EEF4EE] text-[#2F7D52]',
    label: '통과',
  },
  fail: {
    dot: 'bg-[#B4453A]',
    badge: 'bg-[#FBF1F0] text-[#B4453A]',
    label: '미통과',
  },
  warning: {
    dot: 'bg-[#B88A3C]',
    badge: 'bg-[#FBF6EC] text-[#9A6A1E]',
    label: '미흡',
  },
  pending: {
    dot: 'bg-[#E7E7EC]',
    badge: 'bg-[#F0F0F3] text-[#9A9AA3]',
    label: '대기',
  },
}

function hasSlotValue(
  slot: StudioNodeSlot,
): boolean {
  if (slot.state === 'filled') {
    return true
  }

  return (
    typeof slot.value === 'string' &&
    slot.value.trim().length > 0
  )
}

function getIssueBlockTitles(
  issues: readonly StudioValidationIssue[],
): string {
  const titles = issues.map((issue) => {
    if (!issue.blockId) {
      return issue.message
    }

    return (
      getStudioBlockDefinition(
        issue.blockId,
      )?.title ?? issue.message
    )
  })

  return titles.join(', ')
}

function PaletteBlockCard({
  block,
  onDragStart,
}: {
  block: StudioBlockDefinition
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    blockId: string,
  ) => void
}) {
  const stageStyle = stageStyleMap[block.stage]
  const requirement = requirementStyleMap[block.requirement]
  const available = block.availability === 'available'

  return (
    <div
      draggable={available}
      onDragStart={(event) => {
        if (!available) {
          event.preventDefault()
          return
        }

        onDragStart(event, block.id)
      }}
      className={[
        'mb-[12px] h-[72px] w-[290px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[16.5px] pt-[13.88px] transition',
        available
          ? 'cursor-grab hover:border-[#B8BAFF] hover:bg-[#FAFAFF] active:cursor-grabbing'
          : 'cursor-not-allowed opacity-55',
      ].join(' ')}
    >
      <div className="flex items-center">
        <div
          className={[
            'h-[13px] w-[13px] shrink-0 rounded-[4px]',
            stageStyle.dot,
          ].join(' ')}
        />

        <p className="ml-[12px] min-w-0 flex-1 truncate text-[16px] font-bold">
          {block.title}
        </p>

        <span
          className={[
            'ml-[8px] shrink-0 text-[12px] font-bold',
            available
              ? requirement.className
              : 'rounded-[8px] bg-[#F0F0F3] px-[8px] py-[4px] text-[#9A9AA3]',
          ].join(' ')}
        >
          {available ? requirement.label : '준비중'}
        </span>
      </div>

      <p className="ml-[25px] mt-[2px] truncate text-[14px] text-[#9A9AA3]">
        {block.description}
      </p>
    </div>
  )
}

function ValidationRow({
  check,
  open,
  onToggle,
}: {
  check: ValidationCheck
  open: boolean
  onToggle: () => void
}) {
  const statusStyle = validationStatusStyleMap[check.status]

  return (
    <div className="min-h-[54px] border-t-[1.5px] border-[#EEEEF1] px-[21px] pt-[10px]">
      <div className="flex items-center">
        <div
          className={[
            'h-[23px] w-[23px] shrink-0 rounded-full',
            statusStyle.dot,
          ].join(' ')}
        />

        <p className="ml-[13.5px] min-w-0 flex-1 text-[17px] font-bold">
          {check.title}
        </p>

        <div className="flex items-center">
          <span
            className={[
              'flex h-[22.5px] min-w-[44px] items-center justify-center rounded-[8px] px-[7px] text-[12.5px] font-bold',
              statusStyle.badge,
            ].join(' ')}
          >
            {statusStyle.label}
          </span>

          <button
            type="button"
            onClick={onToggle}
            aria-label={`${check.title} 상세 ${open ? '닫기' : '열기'}`}
            className="ml-[13.5px] mt-[-4px] text-[19.5px] text-[#9A9AA3]"
          >
            {open ? '⌃' : '⌄'}
          </button>
        </div>
      </div>

      {open && (
        <div className="mb-[19px] mt-[10px] pl-[36.5px] pr-[8px] text-[14.5px] font-bold leading-[23px]">
          <p>
            채점 기준
            <span className="font-normal text-[#52525B]">
              · {check.criterion}
            </span>
          </p>

          <p className="mt-[8px]">
            확인 결과
            <span className="font-normal text-[#52525B]">
              · {check.result}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export function Stdio_create1() {
  const navigate = useNavigate()
  const location = useLocation()
  const { flowId: routeFlowId } =
    useParams<{ flowId?: string }>()
  const [searchParams] = useSearchParams()

  const locationState =
    (
      location.state as
        | StudioSaveNavigationState
        | null
    ) ?? null

  const flowId =
    parseFlowId(
      searchParams.get('flowId'),
    ) ??
    parseFlowId(routeFlowId) ??
    parseFlowId(
      locationState?.flowId,
    )

  const mode =
    locationState?.mode ??
    parseStudioMode(
      searchParams.get('mode'),
    ) ??
    (
      flowId
        ? 'edit'
        : 'create'
    )

  const [searchText, setSearchText] = useState('')

  const inspectorScrollRef =
    useRef<HTMLDivElement | null>(null)

  const [openInspectorSlotId, setOpenInspectorSlotId] =
    useState<string | null>(null)
  const [openValidationId, setOpenValidationId] =
    useState<number | null>(null)
  const [validationResult, setValidationResult] =
    useState<StudioWorkflowValidationResult | null>(
      locationState?.validationResult ?? null,
    )

  const [
    loadedSaveDraft,
    setLoadedSaveDraft,
  ] =
    useState<StudioSaveDraft | undefined>(
      locationState?.saveDraft,
    )

  const [
    isHydratingFlow,
    setIsHydratingFlow,
  ] =
    useState(false)

  const [
    hydrationError,
    setHydrationError,
  ] =
    useState<string | null>(
      null,
    )

  /*
   * 같은 페이지에서 저장 검토/미리보기에서 돌아온 경우에는
   * location.state의 React Flow 상태를 즉시 재사용합니다.
   *
   * 브라우저 새로고침 또는 내 저장소에서 편집으로 진입해
   * state가 없는 경우에는 아래 hydration effect가
   * GET /flows/{flowId} 응답으로 캔버스를 복원합니다.
   */
  const studio = useStudioEditor({
    initialNodes: locationState?.nodes ?? [],
    initialEdges: locationState?.edges ?? [],
  })

  const selectedNode =
    studio.nodes.find((node) => node.selected) ?? null

  /*
   * Studio는 자체적으로 좌측 Palette / 중앙 Canvas / 우측 Inspector를
   * 각각 스크롤하는 데스크톱 편집 화면입니다.
   *
   * 긴 Inspector가 열릴 때 body/document까지 높이가 늘어나면
   * 브라우저 scroll anchoring 때문에 화면 전체가 위아래로 튈 수 있으므로
   * Studio가 마운트된 동안 바깥 문서 스크롤을 잠급니다.
   */
  useEffect(() => {
    const html =
      document.documentElement

    const body =
      document.body

    const previousHtmlOverflow =
      html.style.overflow

    const previousHtmlOverscrollBehavior =
      html.style.overscrollBehavior

    const previousBodyOverflow =
      body.style.overflow

    const previousBodyOverscrollBehavior =
      body.style.overscrollBehavior

    html.style.overflow =
      'hidden'

    html.style.overscrollBehavior =
      'none'

    body.style.overflow =
      'hidden'

    body.style.overscrollBehavior =
      'none'

    return () => {
      html.style.overflow =
        previousHtmlOverflow

      html.style.overscrollBehavior =
        previousHtmlOverscrollBehavior

      body.style.overflow =
        previousBodyOverflow

      body.style.overscrollBehavior =
        previousBodyOverscrollBehavior
    }
  }, [])

  useEffect(
    () => {
      /*
       * 자유 제작 CREATE는 서버에 빈 DRAFT Flow를 먼저 만들기 때문에
       * blockFlow가 없는 것이 정상입니다.
       *
       * 반대로 edit/copied/guided 또는 /studio/:flowId/edit 직접 진입은
       * 서버에 저장된 Flow를 복원해야 합니다.
       */
      const hasNavigationNodes =
        (
          locationState?.nodes
            ?.length ??
          0
        ) > 0

      const shouldHydrate =
        Boolean(
          flowId,
        ) &&
        !hasNavigationNodes &&
        (
          Boolean(
            routeFlowId,
          ) ||
          mode !==
            'create'
        )

      if (
        !shouldHydrate ||
        !flowId
      ) {
        return
      }

      let cancelled =
        false

      const hydrate =
        async () => {
          setIsHydratingFlow(
            true,
          )

          setHydrationError(
            null,
          )

          try {
            const response =
              await getFlow(
                flowId,
                getAccessToken(),
              )

            if (
              !response.success ||
              !response.result
            ) {
              throw new Error(
                response.message ||
                  '저장된 흐름을 불러오지 못했습니다.',
              )
            }

            const hydrated =
              hydrateStudioFlowFromApi(
                response.result,
              )

            if (
              cancelled
            ) {
              return
            }

            studio.setNodes(
              hydrated.nodes,
            )

            studio.setEdges(
              hydrated.edges,
            )

            setLoadedSaveDraft(
              hydrated.saveDraft,
            )

            setValidationResult(
              null,
            )

            window.requestAnimationFrame(
              () => {
                studio.fitView()
              },
            )
          } catch (error) {
            if (
              cancelled
            ) {
              return
            }

            console.error(
              'Studio Flow 복원 실패:',
              error,
            )

            setHydrationError(
              error instanceof Error
                ? error.message
                : '저장된 흐름을 Studio로 복원하지 못했습니다.',
            )
          } finally {
            if (
              !cancelled
            ) {
              setIsHydratingFlow(
                false,
              )
            }
          }
        }

      void hydrate()

      return () => {
        cancelled =
          true
      }
    },
    [
      flowId,
      locationState?.nodes,
      mode,
      routeFlowId,
    ],
  )

    const filteredBlocks = useMemo(() => {
      const keyword =
        searchText.trim().toLowerCase()

      /*
      * 제출 시점에는 실제 Inspector가 완성된 블록만
      * Palette에 노출합니다.
      *
      * Catalog 정의 자체는 유지하므로 저장된 Flow,
      * block ID 및 다른 데이터 구조에는 영향을 주지 않습니다.
      */
      const usableBlocks =
        studioBlockCatalog.filter(
          (block) =>
            block.availability ===
              'available' &&
            hasStudioBlockInspector(
              block.id,
            ),
        )

      if (!keyword) {
        return usableBlocks
      }

      return usableBlocks.filter(
        (block) =>
          block.title
            .toLowerCase()
            .includes(
              keyword,
            ) ||
          block.description
            .toLowerCase()
            .includes(
              keyword,
            ),
      )
    }, [searchText])

  const workflowStructureSignature = useMemo(() => {
    return studio.nodes
      .map((node) => {
        const slots = node.data.node.slots
          .map((slot) =>
            [
              slot.id,
              slot.value ?? '',
              slot.state ?? '',
              slot.required ? '1' : '0',
              JSON.stringify(slot.config ?? {}),
            ].join(':'),
          )
          .sort()
          .join(',')

        return [
          node.id,
          node.data.node.stage,
          slots,
        ].join('|')
      })
      .sort()
      .join('||')
  }, [studio.nodes])

  useEffect(() => {
    setValidationResult(null)
  }, [workflowStructureSignature])

  useEffect(() => {
    setOpenInspectorSlotId(null)

    inspectorScrollRef.current?.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [selectedNode?.id])

  const validationChecks = useMemo<ValidationCheck[]>(() => {
    if (!validationResult) {
      return [
        {
          id: 1,
          title: '입력 노드 CORE 블록',
          status: 'pending',
          criterion:
            '입력 단계의 필수 블록이 모두 포함되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 2,
          title: '프로세스 노드 CORE 블록',
          status: 'pending',
          criterion:
            '프로세스 단계의 필수 블록이 모두 포함되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 3,
          title: '결과 노드 CORE 블록',
          status: 'pending',
          criterion:
            '결과 단계의 필수 블록이 모두 포함되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 4,
          title: '필수 슬롯 채움',
          status: 'pending',
          criterion:
            '각 노드의 required slot 설정이 모두 완료되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 5,
          title: '저장 조건',
          status: 'pending',
          criterion:
            '필수 블록과 필수 슬롯 검증을 통과해야 합니다.',
          result: '검증을 실행하면 저장 가능 여부가 표시됩니다.',
        },
      ]
    }

    const missingRequiredByStage = (stage: StudioStage) =>
      validationResult.issues.filter(
        (issue) =>
          issue.stage === stage &&
          issue.type === 'missing-required-block',
      )

    const inputIssues = missingRequiredByStage('INPUT')
    const processIssues = missingRequiredByStage('PROCESS')
    const outputIssues = missingRequiredByStage('OUTPUT')

    const slotIssues = validationResult.issues.filter(
      (issue) =>
        issue.type === 'missing-required-slot-value' ||
        issue.type === 'invalid-required-slot' ||
        issue.type === 'required-slot-warning',
    )

    const slotErrorIssues = slotIssues.filter(
      (issue) => issue.severity === 'error',
    )

    const buildStageResult = (issues: StudioValidationIssue[]) =>
      issues.length === 0
        ? '필수 블록이 모두 포함되어 있습니다.'
        : `누락: ${getIssueBlockTitles(issues)}`

    return [
      {
        id: 1,
        title: '입력 노드 CORE 블록',
        status: inputIssues.length === 0 ? 'pass' : 'fail',
        criterion:
          '입력 단계의 필수 블록이 모두 포함되어야 합니다.',
        result: buildStageResult(inputIssues),
      },
      {
        id: 2,
        title: '프로세스 노드 CORE 블록',
        status: processIssues.length === 0 ? 'pass' : 'fail',
        criterion:
          '프로세스 단계의 필수 블록이 모두 포함되어야 합니다.',
        result: buildStageResult(processIssues),
      },
      {
        id: 3,
        title: '결과 노드 CORE 블록',
        status: outputIssues.length === 0 ? 'pass' : 'fail',
        criterion:
          '결과 단계의 필수 블록이 모두 포함되어야 합니다.',
        result: buildStageResult(outputIssues),
      },
      {
        id: 4,
        title: '필수 슬롯 채움',
        status: slotIssues.length === 0 ? 'pass' : 'warning',
        criterion:
          '각 노드의 required slot 설정이 모두 완료되어야 합니다.',
        result:
          slotIssues.length === 0
            ? '필수 슬롯 설정이 모두 완료되었습니다.'
            : slotIssues.map((issue) => issue.message).join(' '),
      },
      {
        id: 5,
        title: '저장 조건',
        status: validationResult.valid ? 'pass' : 'pending',
        criterion:
          '필수 블록과 필수 슬롯 검증을 통과해야 합니다.',
        result: validationResult.valid
          ? '저장 조건을 충족했습니다.'
          : `오류 ${validationResult.errorCount}개가 남아 있어 저장할 수 없습니다.${
              slotErrorIssues.length > 0
                ? ' 필수 슬롯 설정을 확인하세요.'
                : ''
            }`,
      },
    ]
  }, [validationResult])

  const validationSummary = useMemo(() => {
    const passCount = validationChecks.filter(
      (check) => check.status === 'pass',
    ).length

    const insufficientCount = validationChecks.filter(
      (check) =>
        check.status === 'warning' ||
        check.status === 'fail',
    ).length

    const pendingCount = validationChecks.filter(
      (check) => check.status === 'pending',
    ).length

    return {
      passCount,
      insufficientCount,
      pendingCount,
    }
  }, [validationChecks])

  const overallValidationStatus: ValidationCheckStatus =
    !validationResult
      ? 'pending'
      : validationResult.valid
        ? 'pass'
        : 'fail'

  const selectedRequiredSlots =
    selectedNode?.data.node.slots.filter(
      (slot) => slot.required,
    ) ?? []

  const selectedCompletedRequiredSlots =
    selectedRequiredSlots.filter(hasSlotValue).length

  const selectedConnectionInfo =
    useMemo(() => {
      if (!selectedNode) {
        return undefined
      }

      const toConnectedNode = (
        nodeId: string,
      ) => {
        const node =
          studio.nodes.find(
            (item) =>
              item.id === nodeId,
          )

        if (!node) {
          return null
        }

        return {
          id: node.id,
          title:
            node.data.node.title,
          stage:
            node.data.node.stage,
          slots:
            node.data.node.slots,
        }
      }

      const incomingNodes =
        studio.edges
          .filter(
            (edge) =>
              edge.target ===
              selectedNode.id,
          )
          .map(
            (edge) =>
              toConnectedNode(
                edge.source,
              ),
          )
          .filter(
            (
              node,
            ): node is NonNullable<
              ReturnType<
                typeof toConnectedNode
              >
            > => node !== null,
          )

      const outgoingNodes =
        studio.edges
          .filter(
            (edge) =>
              edge.source ===
              selectedNode.id,
          )
          .map(
            (edge) =>
              toConnectedNode(
                edge.target,
              ),
          )
          .filter(
            (
              node,
            ): node is NonNullable<
              ReturnType<
                typeof toConnectedNode
              >
            > => node !== null,
          )

      return {
        incomingNodes,
        outgoingNodes,
      }
    }, [
      selectedNode,
      studio.edges,
      studio.nodes,
    ])

      /**
       * 현재 선택된 노드의 전체 Inspector 설정을 확인합니다.
       *
       * 각 Inspector의 값은 입력 즉시 studio.nodes에 반영되므로
       * 여기서는 별도의 저장 처리를 다시 하지 않습니다.
       *
       * 대신 현재 노드의 필수 슬롯이 모두 완료됐는지 확인한 뒤
       * 문제가 없을 때만 Inspector를 닫아
       * "설정 저장" 완료 상태로 진행합니다.
       */
      const handleSaveSelectedNodeSettings = () => {
        if (!selectedNode) {
          return
        }

        const incompleteRequiredSlots =
          selectedNode.data.node.slots.filter(
            (slot) =>
              slot.required &&
              !hasSlotValue(slot),
          )

        if (
          incompleteRequiredSlots.length >
          0
        ) {
          const incompleteLabels =
            incompleteRequiredSlots.map(
              (slot) =>
                slot.label,
            )

          window.alert(
            [
              '필수 설정이 완료되지 않았습니다.',
              '',
              incompleteLabels.join(
                ', ',
              ),
            ].join('\n'),
          )

          return
        }

        /*
        * 각 Block Inspector의 onChange에서
        * config/value/state는 이미 Studio state에 저장된 상태입니다.
        *
        * 필수 설정 확인이 끝났으므로
        * 열려 있는 세부 Inspector를 닫습니다.
        */
        setOpenInspectorSlotId(
          null,
        )
      }


    const handleValidate = () => {
      const result =
        studio.validateWorkflow()

      setValidationResult(
        result,
      )
    }

  const buildNavigationState =
    (): StudioSaveNavigationState => ({
      mode,

      flowId,

      tutorialId:
        locationState?.tutorialId,

      originFlowId:
        locationState?.originFlowId,

      copiedLibraryItemId:
        locationState?.copiedLibraryItemId,

      nodes:
        studio.nodes,

      edges:
        studio.edges,

      validationResult,

      saveDraft:
        loadedSaveDraft ??
        locationState?.saveDraft,
    })

      /**
     * Studio 밖의 화면으로 이동하기 전에
     * 현재 History Entry에 최신 편집 상태를 먼저 기록합니다.
     *
     * 예시 결과 / 미리보기에서 브라우저 뒤로가기를 사용해도
     * 최신 nodes / edges / slot config가 복원되도록 합니다.
     */
    const preserveCurrentEditorHistory = async (
      state: StudioSaveNavigationState,
    ) => {
      await navigate(
        `${location.pathname}${location.search}`,
        {
          replace: true,
          state,
        },
      )
    }

    const handleOpenExample = async () => {
      if (!flowId) {
        window.alert(
          '예시 결과를 생성할 flowId가 없습니다.',
        )
        return
      }

      const state =
        buildNavigationState()

      await preserveCurrentEditorHistory(
        state,
      )

      navigate(
        `/workflows/${flowId}/preview?view=example`,
        {
          state,
        },
      )
    }

    const handleOpenPreview = async () => {
      if (!flowId) {
        window.alert(
          '미리보기에 사용할 flowId가 없습니다.',
        )
        return
      }

      const state =
        buildNavigationState()

      await preserveCurrentEditorHistory(
        state,
      )

      navigate(
        `/workflows/${flowId}/preview`,
        {
          state,
        },
      )
    }

      /**
       * 저장 버튼을 누른 시점의 최신 Studio 상태로
       * 전체 Workflow Validation을 다시 실행합니다.
       *
       * 사용자가 별도로 "검증" 버튼을 누르지 않았더라도
       * 저장 직전에 반드시 전체 설정을 확인합니다.
       */
      const handleStartSave = async () => {
        const result =
          studio.validateWorkflow()

        setValidationResult(
          result,
        )

        /*
        * 검증에 실패하면 Review 화면으로 이동하지 않습니다.
        * 우측 검증 결과에 오류가 표시되므로
        * 사용자는 필요한 설정을 수정한 뒤 다시 저장할 수 있습니다.
        */
        if (!result.valid) {
          return
        }

        const state: StudioSaveNavigationState = {
          ...buildNavigationState(),

          /*
          * setValidationResult는 비동기 State 갱신이므로
          * 지금 막 생성한 최신 결과를 Navigation State에
          * 명시적으로 넣습니다.
          */
          validationResult:
            result,
        }

        await preserveCurrentEditorHistory(
          state,
        )

        navigate(
          '/studio/save/review',
          {
            state,
          },
        )
      }

  return (
    <div className="fixed inset-0 flex h-[100dvh] w-screen min-h-0 flex-col overflow-hidden bg-white text-[#27272A]">
      <div className="shrink-0">
            {/* 모바일 / 태블릿 Studio 미지원 안내 */}
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F5F5F7] px-[24px] lg:hidden">
                <div className="w-full max-w-[420px] rounded-[16px] border-[1.5px] border-[#E4E4E7] bg-white px-[28px] py-[34px] text-center shadow-sm">
                  <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-[#EAEBFF] text-[26px]">
                    💻
                  </div>

                  <h1 className="mt-[20px] text-[22px] font-bold text-[#27272A]">
                    Studio는 데스크톱 전용입니다.
                  </h1>

                  <p className="mt-[12px] text-[15px] leading-[23px] text-[#666666]">
                    블록 배치와 연결 기능은
                    PC 환경에서 이용할 수 있습니다.
                    <br />
                    데스크톱에서 다시 접속해주세요.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/',
                      )
                    }
                    className="mt-[26px] flex h-[48px] w-full items-center justify-center rounded-[10px] bg-[#6366F1] text-[16px] font-bold text-white hover:bg-[#5558DB]"
                  >
                    홈으로 돌아가기
                  </button>
                </div>
              </div>
        <Header />
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* 블록 팔레트 */}
        <aside className="relative z-30 flex min-h-0 w-[326px] shrink-0 flex-col border-r-[1.5px] border-[#E4E4E7] bg-white">
          <div className="relative flex h-[122px] shrink-0 items-center justify-center gap-[14px] border-b-[1.5px] border-[#E4E4E7]">
            <p className="text-[22px] font-bold">
              블록 팔레트
            </p>

            <img
              src={dashed}
              alt=""
              className="absolute left-[155px] h-[80px] w-[158px]"
            />

            <div className="relative z-10 w-[150px] py-[4px] pl-[14px] text-[15px] text-[#9A9AA3]">
              📱모바일 미지원 -
              <br />
              블록 스튜디오는
              <br />
              데스크톱 전용
            </div>
          </div>

          <div className="shrink-0 px-[16px] pb-[10px] pt-[13px]">
            <div className="relative flex items-center text-[19px] text-[#9A9AA3]">
              <input
                type="search"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="블록 검색"
                className="h-[50px] w-[296px] rounded-[50px] border-[1.5px] border-[#E4E4E7] bg-white pl-[60px] pr-[18px] text-[#52525B] outline-none placeholder:text-[#9A9AA3] focus:border-[#6366F1]"
              />

              <img
                src={searchRound}
                alt=""
                className="pointer-events-none absolute left-[24px] h-[21px] w-[21px]"
              />

              <img
                src={searchStick}
                alt=""
                className="pointer-events-none absolute left-[40px] top-[27px] h-[8.4px] w-[10px]"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[18px] pb-[32px] [overflow-anchor:none] [scrollbar-gutter:stable]">
            {STUDIO_STAGE_ORDER.map((stage) => {
              const blocks = filteredBlocks.filter(
                (block) => block.stage === stage,
              )

              if (blocks.length === 0) {
                return null
              }

              const stageStyle = stageStyleMap[stage]

              return (
                <section key={stage}>
                  <div className="flex w-[290px] items-center pb-[15.5px] pt-[18px]">
                    <div
                      className={[
                        'h-[13px] w-[13px] rounded-[4px]',
                        stageStyle.dot,
                      ].join(' ')}
                    />

                    <p className="ml-[10.5px] flex-1 text-[13.5px] font-bold text-[#9A9AA3]">
                      {studioStageLabelMap[stage]}
                    </p>

                    <p className="text-[13.5px] font-bold text-[#9A9AA3]">
                      {stage}
                    </p>
                  </div>

                  {blocks.map((block) => (
                    <PaletteBlockCard
                      key={block.id}
                      block={block}
                      onDragStart={studio.onBlockDragStart}
                    />
                  ))}
                </section>
              )
            })}

            {filteredBlocks.length === 0 && (
              <div className="flex min-h-[220px] items-center justify-center text-center">
                <p className="text-[14px] text-[#9A9AA3]">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* 메인 캔버스 */}
        <main className="relative z-10 min-h-0 min-w-0 flex-1 overflow-hidden bg-[#F7F7F9]">
          <ReactFlow<StudioFlowNodeInstance, Edge>
            nodes={studio.nodes}
            edges={studio.edges}
            nodeTypes={studioNodeTypes}
            onNodesChange={studio.onNodesChange}
            onEdgesChange={studio.onEdgesChange}
            onConnect={studio.onConnect}
            isValidConnection={studio.isValidConnection}
            onInit={studio.onInit}
            onDragOver={studio.onDragOver}
            onDrop={studio.onDrop}
            onNodeClick={(_event, node) =>
              studio.selectNode(node.id)
            }
            onPaneClick={studio.clearSelection}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
            panOnDrag
            nodesDraggable
            nodesConnectable
            elementsSelectable
            deleteKeyCode={['Backspace', 'Delete']}
            snapToGrid={studio.snapToGrid}
            snapGrid={studio.snapGrid}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 1,
            }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              style: {
                stroke: '#6366F1',
                strokeWidth: 2,
              },
            }}
            connectionLineStyle={{
              stroke: '#6366F1',
              strokeWidth: 2,
            }}
            className="h-full w-full"
          />

          {isHydratingFlow && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
              <div className="rounded-[14px] border-[1.5px] border-[#E4E4E7] bg-white px-[28px] py-[22px] text-center shadow-sm">
                <div className="mx-auto h-[38px] w-[38px] animate-spin rounded-full border-[4px] border-[#E4E4E7] border-t-[#6366F1]" />

                <p className="mt-[14px] text-[15px] font-bold text-[#52525B]">
                  저장된 흐름을 불러오는 중입니다.
                </p>
              </div>
            </div>
          )}

          {hydrationError && !isHydratingFlow && (
            <div className="absolute left-1/2 top-[22px] z-20 w-[min(620px,calc(100%-40px))] -translate-x-1/2 rounded-[12px] border-[1.5px] border-[#E9C9C9] bg-[#FBF1F0] px-[18px] py-[14px] text-center shadow-sm">
              <p className="text-[14px] font-bold text-[#B4453A]">
                저장된 흐름을 불러오지 못했습니다.
              </p>

              <p className="mt-[4px] text-[13px] leading-[20px] text-[#8C5A55]">
                {hydrationError}
              </p>
            </div>
          )}
        </main>

        {/* 인스펙터와 검증 결과 */}
        <aside className="relative z-30 flex min-h-0 w-[406px] shrink-0 flex-col overflow-hidden border-l-[1.5px] border-[#E4E4E7] bg-white">
          <div className="flex h-[78px] shrink-0 items-center border-b-[1.5px] border-[#E4E4E7] pl-[20px] text-[22px] font-bold">
            인스펙터
          </div>

          <div
            ref={inspectorScrollRef}
            className="min-h-0 flex-1 overflow-y-scroll overscroll-contain [overflow-anchor:none] [scrollbar-gutter:stable]"
          >
            {!selectedNode && (
              <div className="flex min-h-[510px] flex-col border-b-[1.5px] border-[#E4E4E7]">
                <div className="flex h-[180px] items-center justify-center border-b-[1.5px] border-[#E4E4E7] px-[30px] text-center">
                  <div>
                    <p className="text-[18px] font-bold text-[#52525B]">
                      선택된 노드가 없습니다.
                    </p>

                    <p className="mt-[8px] text-[14px] leading-[21px] text-[#9A9AA3]">
                      왼쪽 팔레트의 블록을
                      캔버스에 추가한 뒤
                      <br />
                      노드를 선택하세요.
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center px-[30px] text-center text-[14px] text-[#9A9AA3]">
                  노드 설정은 선택 후 표시됩니다.
                </div>
              </div>
            )}

            {selectedNode && (
              <div className="border-b-[1.5px] border-[#E4E4E7]">
                <div className="border-b-[1.5px] border-[#E4E4E7] px-[21px] py-[14px]">
                  <div className="flex items-center">
                    <p
                      className={[
                        'flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[12px] text-[18px] font-bold text-white',
                        stageStyleMap[selectedNode.data.node.stage].dot,
                      ].join(' ')}
                    >
                      {selectedNode.data.node.order}
                    </p>

                    <div className="ml-[14px] min-w-0 flex-1">
                      <p className="truncate text-[19px] font-bold">
                        {selectedNode.data.node.title} 노드
                      </p>

                      <p className="mt-[2px] truncate text-[13px] text-[#9A9AA3]">
                        {selectedNode.data.node.stage}
                        {selectedNode.data.node.slots[0]
                          ? ` · ${selectedNode.data.node.slots[0].label}`
                          : ''}
                      </p>
                    </div>

                    {selectedNode.data.node.stage === 'PROCESS' && (
                      <div className="flex h-[33px] w-[132px] items-center justify-center rounded-[8px] border-[1.5px] border-dashed border-[#E4E4E7] text-[15px] font-bold text-[#52525B]">
                        AI Optional
                      </div>
                    )}
                  </div>

                  <div className="mt-[14px] flex items-center gap-[10px] text-[13px] font-bold text-[#52525B]">
                    <div className="flex h-[29px] min-w-[78px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] bg-[#F0F0F3] px-[9px]">
                      필수 {selectedCompletedRequiredSlots}/
                      {selectedRequiredSlots.length}
                    </div>

                    <div className="flex h-[29px] min-w-[78px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] bg-[#F0F0F3] px-[9px]">
                      슬롯 {selectedNode.data.node.slots.length}
                    </div>
                  </div>

                  <p className="mt-[11px] text-[14px] leading-[20px] text-[#9A9AA3]">
                    이 노드는 컨테이너입니다. 아래
                    컴포넌트(블록)마다 도구·프롬프트 강도·옵션을
                    따로 설정하세요.
                  </p>
                </div>

                <div className="min-h-[330px] px-[18px] pt-[12px]">
                  <div className="flex items-center justify-between font-bold text-[#9A9AA3]">
                    <p className="text-[14px]">
                      컴포넌트
                    </p>

                    <p className="text-[13px]">
                      {selectedNode.data.node.slots.length}개 · 노드에 부착된 블록
                    </p>
                  </div>

                  <div className="mt-[14px] flex flex-col gap-[8px]">
                    {selectedNode.data.node.slots.map((slot) => {
                      const isOpen = openInspectorSlotId === slot.id

                      return (
                        <div
                          key={slot.id}
                          className="rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[14px] py-[13px]"
                        >
                          <div className="flex items-center">
                            <div
                              className={[
                                'h-[21px] w-[21px] shrink-0 rounded-[8px]',
                                stageStyleMap[selectedNode.data.node.stage].dot,
                              ].join(' ')}
                            />

                            <p className="ml-[12px] min-w-0 flex-1 truncate text-[16.5px] font-bold">
                              {slot.label}
                            </p>

                            <span
                              className={[
                                'text-[11.5px] font-bold',
                                slot.required
                                  ? 'text-[#6366F1]'
                                  : 'rounded-[6px] bg-[#F0F0F3] px-[7px] py-[3px] text-[#9A9AA3]',
                              ].join(' ')}
                            >
                              {slot.required ? '필수' : '선택'}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenInspectorSlotId(
                                  isOpen ? null : slot.id,
                                )
                              }
                              className="ml-[22px] mt-[-6px] text-[18px] text-[#9A9AA3]"
                            >
                              {isOpen ? '⌃' : '⌄'}
                            </button>
                          </div>

                          {isOpen && (
                            <div className="mt-[12px] border-t border-[#EEEEF1] pt-[12px]">
                              <StudioBlockInspector
                                nodeId={selectedNode.id}
                                slot={slot}
                                connectionInfo={selectedConnectionInfo}
                                onConfigChange={(
                                  patch,
                                  options,
                                ) => {
                                  studio.updateBlockConfig({
                                    nodeId:
                                      selectedNode.id,
                                    slotId:
                                      slot.id,
                                    patch,
                                    summaryValue:
                                      options?.summaryValue,
                                    state:
                                      options?.state,
                                  })
                                }}
                                onValueChange={(value) => {
                                  studio.updateSlotValue({
                                    nodeId:
                                      selectedNode.id,
                                    slotId:
                                      slot.id,
                                    value,
                                  })
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="my-[14px] border-t-[1.5px] border-[#EEEEF1]" />

                <div className="flex items-center justify-center pb-[14px]">
                  <button
                    type="button"
                    onClick={
                      handleSaveSelectedNodeSettings
                    }
                    className="flex h-[53px] w-[374px] items-center justify-center rounded-[12px] border-[1.5px] border-[#EEEEF1] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
                  >
                    설정 저장
                  </button>
                </div>
              </div>
            )}

            {/* 검증 결과 */}
            <div>
              <div className="flex h-[96px] items-center justify-between border-t-[1.5px] border-[#E4E4E7] px-[21px]">
                <div className="flex items-center">
                  <div
                    className={[
                      'flex h-[64px] w-[64px] items-center justify-center rounded-[12px] border-[1.5px] text-[25px] font-bold',
                      overallValidationStatus === 'pass'
                        ? 'border-[#CFE2D5] bg-[#EEF4EE] text-[#2F7D52]'
                        : overallValidationStatus === 'fail'
                          ? 'border-[#E9C9C9] bg-[#FBF1F0] text-[#B4453A]'
                          : 'border-[#E4E4E7] bg-[#F0F0F3] text-[#9A9AA3]',
                    ].join(' ')}
                  >
                    {validationSummary.passCount}

                    <span className="mt-[10px] text-[14px] text-[#9A9AA3]">
                      /5
                    </span>
                  </div>

                  <div className="ml-[16.5px] flex flex-col">
                    <p className="text-[18px] font-bold">
                      검증 결과
                    </p>

                    <p className="text-[14px] text-[#9A9AA3]">
                      통과 {validationSummary.passCount} · 미흡{' '}
                      {validationSummary.insufficientCount} · 대기{' '}
                      {validationSummary.pendingCount}
                    </p>
                  </div>
                </div>

                <div
                  className={[
                    'flex h-[33px] min-w-[70px] items-center justify-center rounded-[8px] border-[1.5px] px-[9px] text-[14px] font-bold',
                    overallValidationStatus === 'pass'
                      ? 'border-[#CFE2D5] bg-[#EEF4EE] text-[#2F7D52]'
                      : overallValidationStatus === 'fail'
                        ? 'border-[#E9C9C9] bg-[#FBF1F0] text-[#B4453A]'
                        : 'border-[#E4E4E7] bg-[#F0F0F3] text-[#9A9AA3]',
                  ].join(' ')}
                >
                  {validationStatusStyleMap[overallValidationStatus].label}
                </div>
              </div>

              {validationChecks.map((check) => (
                <ValidationRow
                  key={check.id}
                  check={check}
                  open={openValidationId === check.id}
                  onToggle={() =>
                    setOpenValidationId((current) =>
                      current === check.id ? null : check.id,
                    )
                  }
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 하단 작업 바 */}
      <footer className="flex h-[85px] shrink-0 items-center justify-between border-t-[1.5px] border-[#E4E4E7] bg-white px-[27px] text-[20px]">
        <p className="text-[14px] text-[#9A9AA3]">
          자유 제작 · 노드 {studio.nodes.length} ·
          입력→컨텍스트→프로세스→검토→결과
        </p>

        <div className="flex items-center gap-[19px]">
          <button
            type="button"
            onClick={handleValidate}
            className="flex h-[50px] w-[80px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
          >
            검증
          </button>

          <button
            type="button"
            onClick={handleOpenExample}
            className="flex h-[50px] w-[110px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
          >
            예시 결과
          </button>

          <button
            type="button"
            onClick={handleOpenPreview}
            className="flex h-[50px] w-[110px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
          >
            미리보기
          </button>
          <button
            type="button"
            onClick={
              handleStartSave
            }
            className="flex h-[50px] w-[80px] items-center justify-center rounded-[8px] border-[1.5px] border-[#6366F1] bg-[#6366F1] text-[17px] font-bold text-white hover:bg-[#5558DB]"
          >
            저장
          </button>
        </div>
      </footer>
    </div>
  )
}