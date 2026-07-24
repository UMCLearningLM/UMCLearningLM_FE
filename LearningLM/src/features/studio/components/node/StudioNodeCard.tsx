import type { HTMLAttributes } from 'react'
import type { StudioNodeCardData } from '../../types/studioNode'
import { StudioNodeConnectionHandle } from './StudioNodeConnectionHandle'
import { StudioNodeFooter } from './StudioNodeFooter'
import { StudioNodeHeader } from './StudioNodeHeader'
import { StudioNodeSlotRow } from './StudioNodeSlotRow'
import { getNodeStateClassName } from './studioNodeStyles'

interface StudioNodeCardProps extends HTMLAttributes<HTMLDivElement> {
  node: StudioNodeCardData
  selected?: boolean
  showTargetHandle?: boolean
  showSourceHandle?: boolean
  footerLabel?: string
}

export function StudioNodeCard({
  node,
  selected = false,
  showTargetHandle = true,
  showSourceHandle = true,
  footerLabel,
  className = '',
  onClick,
  ...props
}: StudioNodeCardProps) {
  const nodeState = node.state ?? 'default'
  const isDisabled = nodeState === 'disabled' || nodeState === 'pending'

  return (
    <article
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick(event as unknown as React.MouseEvent<HTMLDivElement>)
        }
      }}
      className={[
        'relative w-[340px] rounded-2xl border p-5 transition',
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : '',
        getNodeStateClassName(nodeState, selected),
        className,
      ].join(' ')}
      {...props}
    >
      {showTargetHandle && (
        <StudioNodeConnectionHandle
          stage={node.stage}
          position="left"
          disabled={isDisabled}
        />
      )}

      {showSourceHandle && (
        <StudioNodeConnectionHandle
          stage={node.stage}
          position="right"
          disabled={isDisabled}
        />
      )}

      <div className="space-y-5">
        <StudioNodeHeader node={node} selected={selected} />

        <div className="space-y-2">
          {node.slots.map((slot) => (
            <StudioNodeSlotRow key={slot.id} slot={slot} stage={node.stage} />
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
