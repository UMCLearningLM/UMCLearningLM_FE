import type {
  HTMLAttributes,
} from 'react'

import type {
  StudioNodeCardData,
} from '../../types/studioNode'

import {
  StudioNodeConnectionHandle,
} from './StudioNodeConnectionHandle'

import {
  StudioNodeFooter,
} from './StudioNodeFooter'

import {
  StudioNodeHeader,
} from './StudioNodeHeader'

import {
  StudioNodeSlotRow,
} from './StudioNodeSlotRow'

import {
  getNodeStateClassName,
} from './studioNodeStyles'

interface StudioNodeCardProps
  extends HTMLAttributes<HTMLDivElement> {
  node: StudioNodeCardData
  selected?: boolean
  showTargetHandle?: boolean
  showSourceHandle?: boolean
  footerLabel?: string

  /**
   * 실제 React Flow Handle을 사용할지 결정합니다.
   *
   * 일반 카드와 테스트 페이지에서는 false를 유지하고,
   * StudioFlowNode에서만 true를 전달합니다.
   */
  interactiveHandles?: boolean

  /**
   * 왼쪽 target Handle ID입니다.
   */
  targetHandleId?: string

  /**
   * 오른쪽 source Handle ID입니다.
   */
  sourceHandleId?: string

  /**
   * 해당 노드의 Handle 연결 가능 여부입니다.
   */
  handlesConnectable?: boolean
}

export function StudioNodeCard({
  node,
  selected = false,
  showTargetHandle = true,
  showSourceHandle = true,
  footerLabel,
  interactiveHandles = false,
  targetHandleId,
  sourceHandleId,
  handlesConnectable = true,
  className = '',
  onClick,
  ...props
}: StudioNodeCardProps) {
  const nodeState =
    node.state ?? 'default'

  const isDisabled =
    nodeState === 'disabled' ||
    nodeState === 'pending'

  const canConnect =
    handlesConnectable &&
    !isDisabled

  return (
    <article
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) {
          return
        }

        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault()

          onClick(
            event as unknown as React.MouseEvent<HTMLDivElement>,
          )
        }
      }}
      className={[
        'relative w-[340px] rounded-2xl border p-5 transition',
        onClick
          ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
          : '',
        getNodeStateClassName(
          nodeState,
          selected,
        ),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {showTargetHandle && (
        <StudioNodeConnectionHandle
          stage={node.stage}
          position="left"
          disabled={isDisabled}
          interactive={
            interactiveHandles
          }
          handleId={targetHandleId}
          isConnectable={canConnect}
        />
      )}

      {showSourceHandle && (
        <StudioNodeConnectionHandle
          stage={node.stage}
          position="right"
          disabled={isDisabled}
          interactive={
            interactiveHandles
          }
          handleId={sourceHandleId}
          isConnectable={canConnect}
        />
      )}

      <div className="space-y-5">
        <StudioNodeHeader
          node={node}
          selected={selected}
        />

        <div className="space-y-2">
          {node.slots.map((slot) => (
            <StudioNodeSlotRow
              key={slot.id}
              slot={slot}
              stage={node.stage}
            />
          ))}
        </div>

        <StudioNodeFooter
          stage={node.stage}
          disabled={isDisabled}
          label={footerLabel}
        />
      </div>
    </article>
  )
}