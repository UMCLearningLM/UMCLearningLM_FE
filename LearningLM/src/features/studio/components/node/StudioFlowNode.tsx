import type {
  Node,
  NodeProps,
  NodeTypes,
} from '@xyflow/react'

import type {
  StudioNodeCardData,
} from '../../types/studioNode'

import {
  StudioNodeCard,
} from './StudioNodeCard'

/**
 * React Flow에 등록할 LearningLM Studio 노드 타입입니다.
 */
export const STUDIO_FLOW_NODE_TYPE =
  'studioNode' as const

/**
 * React Flow 노드의 data에 저장되는 값입니다.
 */
export type StudioFlowNodeData = {
  node: StudioNodeCardData

  footerLabel?: string

  showTargetHandle?: boolean

  showSourceHandle?: boolean

  /**
   * 왼쪽 target Handle ID입니다.
   */
  targetHandleId?: string

  /**
   * 오른쪽 source Handle ID입니다.
   */
  sourceHandleId?: string

  /**
   * 외부 조건에 따라 이 노드의 연결을 차단할 수 있습니다.
   */
  handlesConnectable?: boolean
}

/**
 * LearningLM Studio에서 사용하는 React Flow 노드 타입입니다.
 */
export type StudioFlowNodeInstance = Node<
  StudioFlowNodeData,
  typeof STUDIO_FLOW_NODE_TYPE
>

/**
 * 기존 StudioNodeCard를 React Flow Custom Node로 변환합니다.
 */
export function StudioFlowNode({
  data,
  selected,
  dragging,
}: NodeProps<StudioFlowNodeInstance>) {
  const {
    node,
    footerLabel,
    showTargetHandle,
    showSourceHandle,
    targetHandleId,
    sourceHandleId,
    handlesConnectable = true,
  } = data

  /**
   * 기본 연결점 표시 규칙입니다.
   *
   * INPUT:
   * 들어오는 연결점 없음
   *
   * OUTPUT:
   * 나가는 연결점 없음
   *
   * 나머지 단계:
   * 좌우 연결점 모두 표시
   */
  const shouldShowTargetHandle =
    showTargetHandle ??
    node.stage !== 'INPUT'

  const shouldShowSourceHandle =
    showSourceHandle ??
    node.stage !== 'OUTPUT'

  return (
    <StudioNodeCard
      node={node}
      selected={selected}
      footerLabel={footerLabel}
      showTargetHandle={
        shouldShowTargetHandle
      }
      showSourceHandle={
        shouldShowSourceHandle
      }
      interactiveHandles
      targetHandleId={targetHandleId}
      sourceHandleId={sourceHandleId}
      handlesConnectable={
        handlesConnectable
      }
      data-flow-node-id={node.id}
      data-flow-node-stage={
        node.stage
      }
      aria-label={`${node.title} 노드`}
      className={[
        'cursor-grab',
        dragging
          ? 'cursor-grabbing opacity-90 shadow-lg'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

/**
 * React Flow의 nodeTypes 속성에 전달할 노드 타입 목록입니다.
 */
export const studioNodeTypes = {
  [STUDIO_FLOW_NODE_TYPE]:
    StudioFlowNode,
} satisfies NodeTypes