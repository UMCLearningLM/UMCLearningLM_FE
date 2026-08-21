import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from 'react'

import {
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type IsValidConnection,
} from '@xyflow/react'

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import {
  REFACTORING_SCENARIO_TUTORIAL_ID,
} from '../features/tutorial/data/tutorials'

import {
  Trash2,
} from 'lucide-react'

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
  ResearchGuidedTutorialPanel,
} from '../features/studio/guided/ResearchGuidedTutorialPanel'

import {
  RESEARCH_GUIDED_STEPS,
  createResearchGuidedInitialEdges,
  createResearchGuidedInitialNodes,
  useResearchGuidedTutorial,
} from '../features/studio/guided/researchGuidedTutorial'

import {
  STUDIO_STAGE_ORDER,
  getStudioBlockDefinition,
  studioStageLabelMap,
} from '../features/studio/data/studioBlockCatalog'

import {
  useScenarioAwareStudioEditor,
} from '../features/studio/guided/useScenarioAwareStudioEditor'

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

function getGuidedSavedSettingsStorageKey(
  tutorialId:
    number | undefined,
  flowId:
    number | undefined,
): string {
  return [
    'learninglm',
    'guided-research-saved-settings',
    tutorialId ??
    'tutorial',
    flowId ??
    'flow',
  ].join(':')
}

function getInitialGuidedSavedStepIndices(
  tutorialId:
    number | undefined,
  flowId:
    number | undefined,
): Set<number> {
  if (
    typeof window ===
    'undefined'
  ) {
    return new Set()
  }

  try {
    const stored =
      sessionStorage.getItem(
        getGuidedSavedSettingsStorageKey(
          tutorialId,
          flowId,
        ),
      )

    if (!stored) {
      return new Set()
    }

    const parsed =
      JSON.parse(
        stored,
      )

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return new Set()
    }

    return new Set(
      parsed.filter(
        (
          value,
        ): value is number =>
          Number.isInteger(
            value,
          ) &&
          value >=
          0 &&
          value <
          RESEARCH_GUIDED_STEPS.length,
      ),
    )
  } catch {
    return new Set()
  }
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
  const available =
    block.availability === 'available' &&
    hasStudioBlockInspector(
      block.id,
    )

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

  const tutorialId =
    parseFlowId(
      searchParams.get(
        'tutorialId',
      ),
    ) ??
    parseFlowId(
      locationState?.tutorialId,
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

  /*
   * 기존 Research Guided Tutorial과
   * 리팩토링 서브 시나리오 Guide는 모두 mode=guided를 사용합니다.
   *
   * 리팩토링 서브 시나리오는 guide query parameter로만 구분합니다.
   * 기존 자료조사 튜토리얼 URL에는 guide가 없으므로
   * 기존 튜토리얼 동작은 그대로 유지됩니다.
   */
  const isRefactoringScenarioGuide =
    mode ===
      'guided' &&
    (
      searchParams.get(
        'guide',
      ) ===
        'refactoring-scenario' ||
      tutorialId ===
        REFACTORING_SCENARIO_TUTORIAL_ID
    )

  const isResearchGuidedTutorial =
    mode ===
      'guided' &&
    !isRefactoringScenarioGuide

  const [searchText, setSearchText] = useState('')

  const inspectorScrollRef =
    useRef<HTMLDivElement | null>(null)

  /*
   * Inspector 내부 컨트롤, 특히 native radio input이 focus될 때
   * 브라우저가 overflow 컨테이너를 강제로 스크롤하는 현상을 막기 위해
   * pointer down 시점의 scrollTop을 잠깐 보관합니다.
   */
  const inspectorPointerScrollRef =
    useRef<{
      scrollTop: number
      capturedAt: number
    } | null>(null)

  const inspectorRestoreFrameRef =
    useRef<number | null>(
      null,
    )

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
   * 기존 Research Guided Tutorial 최초 진입은
   * 5개 Stage Node에 기존 preset을 배치합니다.
   *
   * 리팩토링 Scenario에서는 여기서 아무 것도 만들지 않고,
   * useScenarioAwareStudioEditor가 별도의 8개 빈 preset을 생성합니다.
   *
   * Preview 등에서 돌아와 location.state에 작업 상태가 있다면
   * 두 모드 모두 기존 편집 상태를 그대로 사용합니다.
   */
  const guidedInitialNodes =
    useMemo(
      () =>
        isResearchGuidedTutorial &&
          !locationState?.nodes?.length
          ? createResearchGuidedInitialNodes()
          : [],
      [
        isResearchGuidedTutorial,
        locationState?.nodes,
      ],
    )

  const guidedInitialEdges =
    useMemo(
      () =>
        isResearchGuidedTutorial &&
          !locationState?.edges?.length
          ? createResearchGuidedInitialEdges()
          : [],
      [
        isResearchGuidedTutorial,
        locationState?.edges,
      ],
    )

  /*
   * 일반 Studio와 기존 Research Tutorial의 편집 기능은
   * 기존 useStudioEditor 동작을 그대로 사용합니다.
   *
   * 리팩토링 Scenario에서만 Adapter가 다음 기능을 추가합니다.
   *
   * - 최초 8개 빈 블록 배치
   * - 정답 20개 Slot을 required로 표시
   * - 나머지 블록을 optional로 표시
   * - Scenario 전용 Validator 사용
   * - Scenario 전용 Palette requirement 제공
   */
  const studio =
    useScenarioAwareStudioEditor({
      refactoringScenarioEnabled:
        isRefactoringScenarioGuide,

      initialNodes:
        locationState?.nodes?.length
          ? locationState.nodes
          : guidedInitialNodes,

      initialEdges:
        locationState?.edges?.length
          ? locationState.edges
          : guidedInitialEdges,
    })

  const selectedNode =
    studio.nodes.find(
      (node) =>
        node.selected,
    ) ?? null

  /*
   * Guided Tutorial의 현재 단계는 Studio 페이지에서 단일하게 관리합니다.
   *
   * Panel, Palette, Node 잠금, 연결 가능 여부가 모두 같은 currentStepIndex를
   * 바라보게 해 단계가 서로 어긋나는 문제를 막습니다.
   */
  const guidedTutorial =
    useResearchGuidedTutorial({
      enabled:
        isResearchGuidedTutorial,

      tutorialId,

      flowId,

      nodes:
        studio.nodes,

      edges:
        studio.edges,
    })

  const [
    savedGuidedStepIndices,
    setSavedGuidedStepIndices,
  ] =
    useState<Set<number>>(
      () =>
        getInitialGuidedSavedStepIndices(
          tutorialId,
          flowId,
        ),
    )

  const setGuidedStepSettingsSaved =
    (
      stepIndex: number,
      saved: boolean,
    ) => {
      setSavedGuidedStepIndices(
        (
          previous,
        ) => {
          const next =
            new Set(
              previous,
            )

          if (saved) {
            next.add(
              stepIndex,
            )
          } else {
            next.delete(
              stepIndex,
            )
          }

          if (
            typeof window !==
            'undefined'
          ) {
            sessionStorage.setItem(
              getGuidedSavedSettingsStorageKey(
                tutorialId,
                flowId,
              ),
              JSON.stringify(
                [
                  ...next,
                ],
              ),
            )
          }

          return next
        },
      )
    }

  const currentGuidedSettingsSaved =
    isResearchGuidedTutorial &&
    savedGuidedStepIndices.has(
      guidedTutorial.currentStepIndex,
    )

  const canGoNextAfterSettingsSave =
    guidedTutorial.canGoNext &&
    currentGuidedSettingsSaved

  const canCompleteAfterSettingsSave =
    guidedTutorial.isTutorialComplete &&
    currentGuidedSettingsSaved

  const currentGuidedStep =
    isResearchGuidedTutorial
      ? guidedTutorial.currentStep
      : undefined

  const currentGuidedStage =
    currentGuidedStep?.stage

  const currentGuidedTargetBlockId =
    currentGuidedStep?.targetBlockId

  /*
   * Guided에서는 현재 단계 Node만 직접 편집할 수 있습니다.
   *
   * 바로 이전 단계 Node는 현재 단계와 연결해야 하므로 Handle만 활성화하고,
   * 그보다 이전 단계와 미래 단계는 편집/연결을 모두 잠급니다.
   */
  const guidedFlowNodes =
    useMemo(
      () => {
        if (
          !isResearchGuidedTutorial ||
          !currentGuidedStage
        ) {
          return studio.nodes
        }

        const currentStageIndex =
          RESEARCH_GUIDED_STEPS.findIndex(
            (step) =>
              step.stage ===
              currentGuidedStage,
          )

        return studio.nodes.map(
          (node) => {
            const nodeStageIndex =
              RESEARCH_GUIDED_STEPS.findIndex(
                (step) =>
                  step.stage ===
                  node.data.node.stage,
              )

            const isCurrentStage =
              nodeStageIndex ===
              currentStageIndex

            const isImmediatelyPreviousStage =
              nodeStageIndex ===
              currentStageIndex -
              1

            const isFutureStage =
              nodeStageIndex >
              currentStageIndex

            const handlesConnectable =
              isCurrentStage ||
              isImmediatelyPreviousStage

            return {
              ...node,

              draggable:
                isCurrentStage,

              selectable:
                isCurrentStage,

              selected:
                isCurrentStage
                  ? node.selected
                  : false,

              connectable:
                handlesConnectable,

              data: {
                ...node.data,

                handlesConnectable,
              },

              style: {
                ...(node.style ?? {}),

                opacity:
                  isFutureStage
                    ? 0.42
                    : isCurrentStage
                      ? 1
                      : 0.72,
              },
            }
          },
        )
      },
      [
        currentGuidedStage,
        isResearchGuidedTutorial,
        studio.nodes,
      ],
    )

  const findGuidedStageNode =
    (
      stepIndex: number,
    ) => {
      const stage =
        RESEARCH_GUIDED_STEPS[
          stepIndex
        ]?.stage

      if (!stage) {
        return undefined
      }

      return studio.nodes.find(
        (node) =>
          node.data.node.stage ===
          stage,
      )
    }

  const focusGuidedStep =
    (
      stepIndex: number,
    ) => {
      const node =
        findGuidedStageNode(
          stepIndex,
        )

      if (!node) {
        return
      }

      studio.selectNode(
        node.id,
      )

      const instance =
        studio.reactFlowInstance

      if (!instance) {
        return
      }

      const centerX =
        node.position.x +
        180

      const centerY =
        node.position.y +
        120

      void instance.setCenter(
        centerX,
        centerY,
        {
          zoom:
            1,

          duration:
            300,
        },
      )
    }

  const handleGuidedPrevious =
    () => {
      if (
        !guidedTutorial.canGoPrevious
      ) {
        return
      }

      const nextIndex =
        guidedTutorial.currentStepIndex -
        1

      guidedTutorial.goPrevious()

      window.requestAnimationFrame(
        () =>
          focusGuidedStep(
            nextIndex,
          ),
      )
    }

  const handleGuidedNext =
    () => {
      if (
        !canGoNextAfterSettingsSave
      ) {
        return
      }

      const nextIndex =
        guidedTutorial.currentStepIndex +
        1

      guidedTutorial.goNext()

      window.requestAnimationFrame(
        () =>
          focusGuidedStep(
            nextIndex,
          ),
      )
    }

  const handleGuidedComplete =
    () => {
      if (
        !canCompleteAfterSettingsSave
      ) {
        return
      }

      window.alert(
        '튜토리얼을 완료했습니다.',
      )

      navigate(
        tutorialId
          ? `/official-tutorials/${tutorialId}`
          : '/official-tutorials',
      )
    }

  /*
   * Guided 연결은 현재 단계와 바로 이전 단계 사이에서만 허용합니다.
   */
  const isGuidedConnectionAllowed:
    IsValidConnection<Edge> =
    (connection) => {
      if (
        !isResearchGuidedTutorial
      ) {
        return studio.isValidConnection(
          connection,
        )
      }

      const currentIndex =
        guidedTutorial.currentStepIndex

      if (
        currentIndex <=
        0
      ) {
        return false
      }

      const previousStage =
        RESEARCH_GUIDED_STEPS[
          currentIndex -
          1
        ]?.stage

      const currentStage =
        RESEARCH_GUIDED_STEPS[
          currentIndex
        ]?.stage

      const sourceNode =
        studio.nodes.find(
          (node) =>
            node.id ===
            connection.source,
        )

      const targetNode =
        studio.nodes.find(
          (node) =>
            node.id ===
            connection.target,
        )

      if (
        sourceNode?.data.node.stage !==
        previousStage ||
        targetNode?.data.node.stage !==
        currentStage
      ) {
        return false
      }

      return studio.isValidConnection(
        connection,
      )
    }

  /*
   * 현재 단계가 바뀌면 해당 Stage Node를 자동 선택합니다.
   * 첫 진입 시에도 저장된 Guided 단계에 맞는 Node가 활성화됩니다.
   */
  useEffect(
    () => {
      if (
        !isResearchGuidedTutorial
      ) {
        return
      }

      const node =
        findGuidedStageNode(
          guidedTutorial.currentStepIndex,
        )

      if (
        !node ||
        node.selected
      ) {
        return
      }

      studio.selectNode(
        node.id,
      )
    },
    [
      guidedTutorial.currentStepIndex,
      isResearchGuidedTutorial,
    ],
  )

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
        !isResearchGuidedTutorial &&
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
      isResearchGuidedTutorial,
      locationState?.nodes,
      mode,
      routeFlowId,
    ],
  )

  const filteredBlocks =
    useMemo(() => {
      const keyword =
        searchText
          .trim()
          .toLowerCase()

      /*
       * 일반 Studio / 기존 Research Tutorial:
       * 기존 Catalog requirement를 그대로 사용합니다.
       *
       * 리팩토링 Scenario:
       * Adapter가 정답 20개를 required,
       * 나머지를 optional로 복제한 Palette Catalog를 제공합니다.
       */
      const usableBlocks =
        studio.paletteCatalog.filter(
          (
            block,
          ) => {
            const hasInspector =
              block.availability ===
              'available' &&
              hasStudioBlockInspector(
                block.id,
              )

            if (
              !hasInspector
            ) {
              return false
            }

            /*
             * 기존 Research Guided Tutorial에서만
             * 현재 단계의 목표 블록 하나를 Palette에 노출합니다.
             *
             * 리팩토링 Scenario는 퍼즐형 Guide이므로
             * 사용 가능한 전체 Palette를 노출합니다.
             */
            if (
              isResearchGuidedTutorial
            ) {
              return (
                Boolean(
                  currentGuidedTargetBlockId,
                ) &&
                block.id ===
                currentGuidedTargetBlockId
              )
            }

            return true
          },
        )

      if (!keyword) {
        return usableBlocks
      }

      return usableBlocks.filter(
        (
          block,
        ) =>
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
    }, [
      currentGuidedTargetBlockId,
      isResearchGuidedTutorial,
      searchText,
      studio.paletteCatalog,
    ])

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
    const stageCheckDefinitions:
      ReadonlyArray<{
        id: number
        stage: StudioStage
        title: string
      }> =
      isRefactoringScenarioGuide
        ? [
            {
              id: 1,
              stage: 'INPUT',
              title: '입력 노드 필수 블록',
            },
            {
              id: 2,
              stage: 'CONTEXT',
              title: '컨텍스트 노드 필수 블록',
            },
            {
              id: 3,
              stage: 'PROCESS',
              title: '프로세스 노드 필수 블록',
            },
            {
              id: 4,
              stage: 'REVIEW',
              title: '검토 노드 필수 블록',
            },
            {
              id: 5,
              stage: 'OUTPUT',
              title: '결과 노드 필수 블록',
            },
          ]
        : [
            {
              id: 1,
              stage: 'INPUT',
              title: '입력 노드 CORE 블록',
            },
            {
              id: 2,
              stage: 'PROCESS',
              title: '프로세스 노드 CORE 블록',
            },
            {
              id: 3,
              stage: 'OUTPUT',
              title: '결과 노드 CORE 블록',
            },
          ]

    const slotCheckId =
      stageCheckDefinitions.length +
      1

    const saveCheckId =
      stageCheckDefinitions.length +
      2

    if (!validationResult) {
      return [
        ...stageCheckDefinitions.map(
          (definition) => ({
            id: definition.id,
            title: definition.title,
            status:
              'pending' as const,
            criterion:
              isRefactoringScenarioGuide
                ? '이번 시나리오에서 필수로 지정된 블록이 모두 포함되어야 합니다.'
                : `${studioStageLabelMap[definition.stage]} 단계의 필수 블록이 모두 포함되어야 합니다.`,
            result:
              '아직 검증을 실행하지 않았습니다.',
          }),
        ),
        {
          id: slotCheckId,
          title:
            isRefactoringScenarioGuide
              ? '시나리오 필수 블록 설정'
              : '필수 슬롯 채움',
          status: 'pending',
          criterion:
            isRefactoringScenarioGuide
              ? '시나리오 필수 20개 블록의 Inspector 설정이 모두 완료되어야 합니다.'
              : '각 노드의 required slot 설정이 모두 완료되어야 합니다.',
          result:
            '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: saveCheckId,
          title: '저장 조건',
          status: 'pending',
          criterion:
            isRefactoringScenarioGuide
              ? '시나리오 필수 블록과 Inspector 설정 검증을 통과해야 합니다.'
              : '필수 블록과 필수 슬롯 검증을 통과해야 합니다.',
          result:
            '검증을 실행하면 저장 가능 여부가 표시됩니다.',
        },
      ]
    }

    const missingRequiredByStage =
      (stage: StudioStage) =>
        validationResult.issues.filter(
          (issue) =>
            issue.stage === stage &&
            issue.type ===
              'missing-required-block',
        )

    const slotIssues =
      validationResult.issues.filter(
        (issue) =>
          issue.type ===
            'missing-required-slot-value' ||
          issue.type ===
            'invalid-required-slot' ||
          issue.type ===
            'required-slot-warning',
      )

    const slotErrorIssues =
      slotIssues.filter(
        (issue) =>
          issue.severity ===
          'error',
      )

    const buildStageResult =
      (
        issues:
          StudioValidationIssue[],
      ) =>
        issues.length ===
        0
          ? '필수 블록이 모두 포함되어 있습니다.'
          : `누락: ${getIssueBlockTitles(issues)}`

    return [
      ...stageCheckDefinitions.map(
        (definition) => {
          const issues =
            missingRequiredByStage(
              definition.stage,
            )

          return {
            id:
              definition.id,
            title:
              definition.title,
            status:
              issues.length === 0
                ? ('pass' as const)
                : ('fail' as const),
            criterion:
              isRefactoringScenarioGuide
                ? '이번 시나리오에서 필수로 지정된 블록이 모두 포함되어야 합니다.'
                : `${studioStageLabelMap[definition.stage]} 단계의 필수 블록이 모두 포함되어야 합니다.`,
            result:
              buildStageResult(
                issues,
              ),
          }
        },
      ),
      {
        id: slotCheckId,
        title:
          isRefactoringScenarioGuide
            ? '시나리오 필수 블록 설정'
            : '필수 슬롯 채움',
        status:
          slotIssues.length === 0
            ? 'pass'
            : slotErrorIssues.length > 0
              ? 'fail'
              : 'warning',
        criterion:
          isRefactoringScenarioGuide
            ? '시나리오 필수 20개 블록의 Inspector 설정이 모두 완료되어야 합니다.'
            : '각 노드의 required slot 설정이 모두 완료되어야 합니다.',
        result:
          slotIssues.length === 0
            ? '필수 블록 설정이 모두 완료되었습니다.'
            : slotIssues
                .map(
                  (issue) =>
                    issue.message,
                )
                .join(' '),
      },
      {
        id: saveCheckId,
        title: '저장 조건',
        status:
          validationResult.valid
            ? 'pass'
            : 'pending',
        criterion:
          isRefactoringScenarioGuide
            ? '시나리오 필수 블록과 Inspector 설정 검증을 통과해야 합니다.'
            : '필수 블록과 필수 슬롯 검증을 통과해야 합니다.',
        result:
          validationResult.valid
            ? '저장 조건을 충족했습니다.'
            : `오류 ${validationResult.errorCount}개가 남아 있어 저장할 수 없습니다.${
                slotErrorIssues.length > 0
                  ? ' 필수 블록 설정을 확인하세요.'
                  : ''
              }`,
      },
    ]
  }, [
    isRefactoringScenarioGuide,
    validationResult,
  ])

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

  /*
   * Radio/checkbox 등 Inspector 컨트롤이 focus를 가져간 뒤
   * React state 업데이트로 DOM이 다시 그려져도 사용자가 보고 있던
   * Inspector 위치를 유지합니다.
   *
   * 마우스/터치 조작은 pointer down 시점의 위치를 복원하고,
   * 키보드 조작처럼 pointer 정보가 없으면 현재 위치를 기준으로 합니다.
   */
  const restoreInspectorScrollAfterUpdate =
    () => {
      const container =
        inspectorScrollRef.current

      if (!container) {
        return
      }

      const captured =
        inspectorPointerScrollRef.current

      const capturedIsFresh =
        Boolean(captured) &&
        performance.now() -
        (
          captured?.capturedAt ??
          0
        ) <
        1000

      const scrollTop =
        capturedIsFresh &&
          captured
          ? captured.scrollTop
          : container.scrollTop

      inspectorPointerScrollRef.current =
        null

      if (
        inspectorRestoreFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          inspectorRestoreFrameRef.current,
        )
      }

      inspectorRestoreFrameRef.current =
        window.requestAnimationFrame(
          () => {
            container.scrollTop =
              scrollTop

            inspectorRestoreFrameRef.current =
              window.requestAnimationFrame(
                () => {
                  container.scrollTop =
                    scrollTop

                  inspectorRestoreFrameRef.current =
                    null
                },
              )
          },
        )
    }

  const handleDeleteSelectedNode =
    () => {
      if (
        !selectedNode ||
        isResearchGuidedTutorial
      ) {
        return
      }

      const shouldDelete =
        window.confirm(
          [
            `'${selectedNode.data.node.title}' 노드를 삭제할까요?`,
            '',
            '노드에 연결된 선도 함께 삭제됩니다.',
          ].join(
            '\n',
          ),
        )

      if (!shouldDelete) {
        return
      }

      setOpenInspectorSlotId(
        null,
      )

      studio.deleteSelectedElements()
    }

  const handleDeleteNodeBlock =
    (slot: StudioNodeSlot) => {
      if (
        !selectedNode ||
        isResearchGuidedTutorial
      ) {
        return
      }

      const isLastBlock =
        selectedNode.data.node.slots.length ===
        1

      const shouldDelete =
        window.confirm(
          isLastBlock
            ? [
              `'${slot.label}' 블록을 삭제할까요?`,
              '',
              '이 노드의 마지막 블록이므로 노드와 연결선도 함께 삭제됩니다.',
            ].join('\n')
            : `'${slot.label}' 블록을 이 노드에서 삭제할까요?`,
        )

      if (!shouldDelete) {
        return
      }

      if (isLastBlock) {
        setOpenInspectorSlotId(
          null,
        )

        studio.deleteSelectedElements()
        return
      }

      studio.setNodes(
        (currentNodes) =>
          currentNodes.map(
            (node) =>
              node.id ===
                selectedNode.id
                ? {
                  ...node,

                  data: {
                    ...node.data,

                    node: {
                      ...node.data.node,

                      slots:
                        node.data.node.slots.filter(
                          (currentSlot) =>
                            currentSlot.id !==
                            slot.id,
                        ),
                    },
                  },
                }
                : node,
          ),
      )

      if (
        openInspectorSlotId ===
        slot.id
      ) {
        setOpenInspectorSlotId(
          null,
        )
      }

      setValidationResult(
        null,
      )
    }

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

    if (
      isResearchGuidedTutorial
    ) {
      const currentGuidedNode =
        findGuidedStageNode(
          guidedTutorial.currentStepIndex,
        )

      if (
        currentGuidedNode?.id ===
        selectedNode.id &&
        !guidedTutorial.currentStatus
          ?.configured
      ) {
        window.alert(
          '현재 단계의 대상 블록 설정을 완료한 뒤 설정 저장을 눌러주세요.',
        )

        return
      }

      if (
        currentGuidedNode?.id ===
        selectedNode.id
      ) {
        setGuidedStepSettingsSaved(
          guidedTutorial.currentStepIndex,
          true,
        )
      }
    }

    /*
    * 각 Block Inspector의 onChange에서
    * config/value/state는 이미 Studio state에 저장된 상태입니다.
    *
    * 필수 설정 확인과 Guided 설정 저장 처리가 끝났으므로
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
        tutorialId,

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
      `/flows/${flowId}/preview?view=example`,
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
       if (result.valid) {
        alert('검증에 성공했습니다.')
      }
        if (!result.valid) {
          alert(
          `검증에 실패했습니다. 오류 ${result.errorCount}건이 있습니다.`,
          )
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

            <p className="mt-[22px] text-[13px] font-bold text-[#777780]">
              계속 둘러볼 화면을 선택해 주세요.
            </p>

            <div className="mt-[12px] grid grid-cols-1 gap-[9px]">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/',
                  )
                }
                className="flex h-[46px] w-full items-center justify-center rounded-[10px] bg-[#6366F1] text-[15px] font-bold text-white hover:bg-[#5558DB]"
              >
                홈
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/official-tutorials',
                  )
                }
                className="flex h-[46px] w-full items-center justify-center rounded-[10px] border border-[#D8D9F7] bg-white text-[15px] font-bold text-[#6366F1] hover:bg-[#F7F7FF]"
              >
                공식 튜토리얼
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/public-library',
                  )
                }
                className="flex h-[46px] w-full items-center justify-center rounded-[10px] border border-[#E4E4E7] bg-white text-[15px] font-bold text-[#52525B] hover:bg-[#F7F7F9]"
              >
                공개 라이브러리
              </button>
            </div>
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
            nodes={
              guidedFlowNodes
            }
            edges={studio.edges}
            nodeTypes={studioNodeTypes}
            onNodesChange={studio.onNodesChange}
            onEdgesChange={studio.onEdgesChange}
            onEdgeDoubleClick={(_event, edge) => {
              studio.disconnectEdge(
                edge.id,
              )
            }}
            onConnect={(connection) => {
              if (
                !isGuidedConnectionAllowed(
                  connection,
                )
              ) {
                return
              }

              studio.onConnect(
                connection,
              )
            }}
            isValidConnection={
              isGuidedConnectionAllowed
            }
            onInit={studio.onInit}
            onDragOver={studio.onDragOver}
            onDrop={studio.onDrop}
            onNodeClick={(_event, node) => {
              if (
                isResearchGuidedTutorial &&
                node.data.node.stage !==
                currentGuidedStage
              ) {
                return
              }

              studio.selectNode(
                node.id,
              )
            }}
            onPaneClick={() => {
              if (
                isResearchGuidedTutorial
              ) {
                return
              }

              studio.clearSelection()
            }}
            zoomOnScroll
            zoomOnPinch
            zoomOnDoubleClick={false}
            panOnScroll={false}
            panOnDrag
            nodesDraggable
            nodesConnectable
            elementsSelectable
            deleteKeyCode={
              isResearchGuidedTutorial
                ? null
                : ['Backspace', 'Delete']
            }
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
          >
            <Controls
              position="bottom-right"
              showInteractive={false}
              style={{
                bottom:
                  isResearchGuidedTutorial
                    ? 94
                    : 16,
                right: 16,
              }}
            />
          </ReactFlow>
          {isResearchGuidedTutorial &&
            guidedTutorial.currentStatus && (
              <ResearchGuidedTutorialPanel
                currentStepIndex={
                  guidedTutorial.currentStepIndex
                }
                currentStatus={
                  guidedTutorial.currentStatus
                }
                stepStatuses={
                  guidedTutorial.stepStatuses
                }
                canGoPrevious={
                  guidedTutorial.canGoPrevious
                }
                settingsSaved={
                  currentGuidedSettingsSaved
                }
                canGoNext={
                  canGoNextAfterSettingsSave
                }
                isLastStep={
                  guidedTutorial.isLastStep
                }
                isTutorialComplete={
                  canCompleteAfterSettingsSave
                }
                onPrevious={
                  handleGuidedPrevious
                }
                onNext={
                  handleGuidedNext
                }
                onComplete={
                  handleGuidedComplete
                }
              />
            )}
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
            onPointerDownCapture={(event) => {
              inspectorPointerScrollRef.current = {
                scrollTop:
                  event.currentTarget.scrollTop,

                capturedAt:
                  performance.now(),
              }
            }}
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

                            {!isResearchGuidedTutorial && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteNodeBlock(
                                    slot,
                                  )
                                }
                                aria-label={`${slot.label} 블록 삭제`}
                                title="블록 삭제"
                                className="ml-[12px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-[#B4453A] transition hover:bg-[#FBF1F0]"
                              >
                                <Trash2
                                  size={16}
                                  strokeWidth={2}
                                />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setOpenInspectorSlotId(
                                  isOpen ? null : slot.id,
                                )
                              }
                              aria-label={`${slot.label} 설정 ${isOpen ? '접기' : '펼치기'}`}
                              className="ml-[8px] mt-[-2px] flex h-[30px] w-[30px] shrink-0 items-center justify-center text-[18px] text-[#9A9AA3]"
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

                                  if (
                                    isResearchGuidedTutorial &&
                                    selectedNode.data.node.stage ===
                                    currentGuidedStage
                                  ) {
                                    setGuidedStepSettingsSaved(
                                      guidedTutorial.currentStepIndex,
                                      false,
                                    )
                                  }

                                  restoreInspectorScrollAfterUpdate()
                                }}
                                onValueChange={(value) => {
                                  studio.updateSlotValue({
                                    nodeId:
                                      selectedNode.id,
                                    slotId:
                                      slot.id,
                                    value,
                                  })

                                  if (
                                    isResearchGuidedTutorial &&
                                    selectedNode.data.node.stage ===
                                    currentGuidedStage
                                  ) {
                                    setGuidedStepSettingsSaved(
                                      guidedTutorial.currentStepIndex,
                                      false,
                                    )
                                  }

                                  restoreInspectorScrollAfterUpdate()
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

                <div className="flex items-center justify-center gap-[10px] pb-[14px]">
                  {!isResearchGuidedTutorial && (
                    <button
                      type="button"
                      onClick={
                        handleDeleteSelectedNode
                      }
                      className="flex h-[53px] w-[112px] items-center justify-center rounded-[12px] border-[1.5px] border-[#E9C9C9] bg-white text-[15px] font-bold text-[#B4453A] transition hover:bg-[#FBF1F0]"
                    >
                      노드 삭제
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={
                      handleSaveSelectedNodeSettings
                    }
                    className={[
                      'flex h-[53px] items-center justify-center rounded-[12px] border-[1.5px] border-[#EEEEF1] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white',
                      isResearchGuidedTutorial
                        ? 'w-[374px]'
                        : 'w-[252px]',
                    ].join(' ')}
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
                      /{validationChecks.length}
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
          {isResearchGuidedTutorial
            ? '가이드 모드 · AI로 자료조사 흐름 만들기'
            : isRefactoringScenarioGuide
              ? '가이드 모드 · 코드 리팩토링 서브 시나리오'
              : '자유 제작'}{' '}
          · 노드 {studio.nodes.length} ·
          입력→컨텍스트→프로세스→검토→결과
        </p>

        <div className="flex items-center gap-[19px]">
          {!isResearchGuidedTutorial && (
            <button
              type="button"
              onClick={
                handleValidate
              }
              className="flex h-[50px] w-[80px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
            >
              검증
            </button>
          )}

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
          {!isResearchGuidedTutorial && (
            <button
              type="button"
              onClick={
                handleStartSave
              }
              className="flex h-[50px] w-[80px] items-center justify-center rounded-[8px] border-[1.5px] border-[#6366F1] bg-[#6366F1] text-[17px] font-bold text-white hover:bg-[#5558DB]"
            >
              저장
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
