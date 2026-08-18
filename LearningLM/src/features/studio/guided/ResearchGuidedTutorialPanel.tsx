import type {
  Edge,
} from '@xyflow/react'

import {
  Check,
  Circle,
  Sparkles,
} from 'lucide-react'

import type {
  StudioFlowNodeInstance,
} from '../components/node/StudioFlowNode'

import type {
  StudioStage,
} from '../types/studioNode'

/**
 * 제출용 메인 공식 튜토리얼에서 사용하는 블록입니다.
 *
 * Guided mode에서는 이 블록들만 Palette에 노출합니다.
 */
export const RESEARCH_GUIDED_TUTORIAL_BLOCK_IDS:
  readonly string[] = [
    'input-topic',
    'context-direct-input',
    'process-extract-core',
    'review-evidence',
    'output-text',
  ]

interface ResearchGuideStep {
  stage: StudioStage
  blockId: string
  title: string
  instruction: string
  inspectorHint: string
}

const researchGuideSteps:
  readonly ResearchGuideStep[] = [
    {
      stage: 'INPUT',
      blockId:
        'input-topic',
      title:
        '조사 주제 정하기',
      instruction:
        '왼쪽 INPUT 영역의 ‘주제 입력하기’ 블록을 캔버스로 끌어오세요.',
      inspectorHint:
        '노드를 선택한 뒤 Inspector에서 조사할 주제를 입력하세요.',
    },
    {
      stage: 'CONTEXT',
      blockId:
        'context-direct-input',
      title:
        '참고 자료 추가하기',
      instruction:
        '‘직접 입력 내용 사용하기’ 블록을 추가하고 INPUT 노드와 연결하세요.',
      inspectorHint:
        'Inspector에 조사에 참고할 배경 내용이나 알고 있는 사실을 입력하세요.',
    },
    {
      stage: 'PROCESS',
      blockId:
        'process-extract-core',
      title:
        '핵심 내용 추출하기',
      instruction:
        '‘핵심 내용 추출하기’ 블록을 추가하고 CONTEXT 노드와 연결하세요.',
      inspectorHint:
        'Inspector의 추출 대상에서 사실, 키워드 등 하나 이상을 선택하세요.',
    },
    {
      stage: 'REVIEW',
      blockId:
        'review-evidence',
      title:
        '근거 확인하기',
      instruction:
        '‘근거 확인하기’ 블록을 추가하고 PROCESS 노드와 연결하세요.',
      inspectorHint:
        'Inspector에서 확인할 근거나 검사 옵션을 한 번 설정하세요.',
    },
    {
      stage: 'OUTPUT',
      blockId:
        'output-text',
      title:
        '조사 결과 출력하기',
      instruction:
        '‘텍스트로 출력하기’ 블록을 추가하고 REVIEW 노드와 연결하세요.',
      inspectorHint:
        'Inspector에서 결과의 텍스트 구조와 분량을 설정하세요.',
    },
  ]

const stageLabelMap:
  Record<
    StudioStage,
    string
  > = {
    INPUT:
      '입력',
    CONTEXT:
      '컨텍스트',
    PROCESS:
      '프로세스',
    REVIEW:
      '검토',
    OUTPUT:
      '결과',
  }

function hasSlotValue(
  slot:
    StudioFlowNodeInstance[
      'data'
    ]['node']['slots'][number],
): boolean {
  if (
    slot.state ===
    'filled'
  ) {
    return true
  }

  return (
    typeof slot.value ===
      'string' &&
    slot.value.trim().length >
      0
  )
}

function findNodeWithBlock(
  nodes:
    readonly StudioFlowNodeInstance[],
  blockId: string,
) {
  return nodes.find(
    (
      node,
    ) =>
      node.data.node.slots.some(
        (
          slot,
        ) =>
          slot.id ===
          blockId,
      ),
  )
}

function getBlockConfigured(
  node:
    StudioFlowNodeInstance |
    undefined,
  blockId: string,
): boolean {
  if (!node) {
    return false
  }

  const slot =
    node.data.node.slots.find(
      (
        item,
      ) =>
        item.id ===
        blockId,
    )

  return Boolean(
    slot &&
      hasSlotValue(
        slot,
      ),
  )
}

function hasConnection(
  edges:
    readonly Edge[],
  sourceNodeId:
    string |
    undefined,
  targetNodeId:
    string |
    undefined,
): boolean {
  if (
    !sourceNodeId ||
    !targetNodeId
  ) {
    return false
  }

  return edges.some(
    (
      edge,
    ) =>
      edge.source ===
        sourceNodeId &&
      edge.target ===
        targetNodeId,
  )
}

interface ResearchGuidedTutorialPanelProps {
  nodes:
    readonly StudioFlowNodeInstance[]

  edges:
    readonly Edge[]
}

interface GuideStatusRowProps {
  completed: boolean
  children: string
}

function GuideStatusRow({
  completed,
  children,
}: GuideStatusRowProps) {
  return (
    <div className="flex items-center gap-[8px]">
      {completed ? (
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white">
          <Check
            size={12}
            strokeWidth={3}
          />
        </span>
      ) : (
        <Circle
          size={18}
          className="shrink-0 text-[#C7C7CF]"
        />
      )}

      <span
        className={[
          'text-[13px] leading-[19px]',
          completed
            ? 'font-bold text-[#52525B]'
            : 'text-[#9A9AA3]',
        ].join(
          ' ',
        )}
      >
        {children}
      </span>
    </div>
  )
}

export function ResearchGuidedTutorialPanel({
  nodes,
  edges,
}: ResearchGuidedTutorialPanelProps) {
  const stepStatuses =
    researchGuideSteps.map(
      (
        step,
        index,
      ) => {
        const node =
          findNodeWithBlock(
            nodes,
            step.blockId,
          )

        const placed =
          Boolean(
            node,
          )

        const configured =
          getBlockConfigured(
            node,
            step.blockId,
          )

        const previousNode =
          index >
          0
            ? findNodeWithBlock(
                nodes,
                researchGuideSteps[
                  index -
                    1
                ].blockId,
              )
            : undefined

        const connected =
          index ===
          0
            ? true
            : hasConnection(
                edges,
                previousNode?.id,
                node?.id,
              )

        return {
          step,
          node,
          placed,
          configured,
          connected,

          complete:
            placed &&
            configured &&
            connected,
        }
      },
    )

  const incompleteIndex =
    stepStatuses.findIndex(
      (
        status,
      ) =>
        !status.complete,
    )

  const allComplete =
    incompleteIndex ===
    -1

  const currentIndex =
    allComplete
      ? researchGuideSteps.length -
        1
      : incompleteIndex

  const currentStatus =
    stepStatuses[
      currentIndex
    ]

  const completedCount =
    stepStatuses.filter(
      (
        status,
      ) =>
        status.complete,
    ).length

  if (
    allComplete
  ) {
    return (
      <section className="absolute left-[20px] top-[20px] z-30 w-[420px] rounded-[16px] border-[1.5px] border-[#CFCFFF] bg-white px-[22px] py-[20px] shadow-[0_8px_28px_rgba(39,39,42,0.12)]">
        <div className="flex items-start gap-[13px]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[#EAEBFF] text-[#6366F1]">
            <Sparkles
              size={21}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-[#6366F1]">
              공식 튜토리얼 · 5/5
            </p>

            <h2 className="mt-[3px] text-[19px] font-bold text-[#27272A]">
              자료조사 흐름 완성
            </h2>
          </div>
        </div>

        <p className="mt-[15px] text-[14px] leading-[22px] text-[#52525B]">
          입력부터 결과까지
          다섯 단계가 모두
          설정되고 연결되었습니다.
        </p>

        <div className="mt-[14px] rounded-[10px] bg-[#F5F5FF] px-[14px] py-[12px] text-[13px] leading-[20px] text-[#6366F1]">
          아래의 예시 결과 또는
          미리보기에서 완성된
          흐름을 확인할 수 있습니다.
        </div>
      </section>
    )
  }

  return (
    <section className="absolute left-[20px] top-[20px] z-30 w-[420px] rounded-[16px] border-[1.5px] border-[#E4E4E7] bg-white px-[22px] py-[20px] shadow-[0_8px_28px_rgba(39,39,42,0.12)]">
      <div className="flex items-start justify-between gap-[16px]">
        <div>
          <p className="text-[13px] font-bold text-[#6366F1]">
            AI로 자료조사 흐름 만들기
          </p>

          <h2 className="mt-[4px] text-[19px] font-bold text-[#27272A]">
            {currentIndex +
              1}
            단계 ·{' '}
            {
              currentStatus
                .step
                .title
            }
          </h2>
        </div>

        <span className="shrink-0 rounded-[8px] bg-[#EAEBFF] px-[10px] py-[6px] text-[12px] font-bold text-[#6366F1]">
          {stageLabelMap[
            currentStatus
              .step
              .stage
          ]}
        </span>
      </div>

      <div className="mt-[15px] flex gap-[6px]">
        {stepStatuses.map(
          (
            status,
            index,
          ) => (
            <div
              key={
                status.step
                  .blockId
              }
              className={[
                'h-[5px] flex-1 rounded-full',
                status.complete
                  ? 'bg-[#6366F1]'
                  : index ===
                      currentIndex
                    ? 'bg-[#BFC0FF]'
                    : 'bg-[#E4E4E7]',
              ].join(
                ' ',
              )}
            />
          ),
        )}
      </div>

      <div className="mt-[17px] rounded-[10px] bg-[#F7F7F9] px-[14px] py-[13px]">
        <p className="text-[14px] font-bold leading-[21px] text-[#3F3F46]">
          {
            currentStatus
              .step
              .instruction
          }
        </p>

        <p className="mt-[7px] text-[13px] leading-[20px] text-[#777780]">
          {
            currentStatus
              .step
              .inspectorHint
          }
        </p>
      </div>

      <div className="mt-[16px] space-y-[9px]">
        <GuideStatusRow
          completed={
            currentStatus
              .placed
          }
        >
          블록을 캔버스에 추가
        </GuideStatusRow>

        <GuideStatusRow
          completed={
            currentStatus
              .configured
          }
        >
          Inspector 설정 완료
        </GuideStatusRow>

        {currentIndex >
          0 && (
          <GuideStatusRow
            completed={
              currentStatus
                .connected
            }
          >
            이전 단계 노드와 연결
          </GuideStatusRow>
        )}
      </div>

      <div className="mt-[17px] flex items-center justify-between border-t border-[#EEEEF1] pt-[13px]">
        <span className="text-[12px] text-[#9A9AA3]">
          조건을 완료하면
          다음 단계로 자동 진행됩니다.
        </span>

        <span className="text-[12px] font-bold text-[#6366F1]">
          {completedCount}
          /5 완료
        </span>
      </div>
    </section>
  )
}