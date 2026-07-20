import type { StudioNodeCardData } from '../../types/studioNode'
import { StatusBadge } from '../../../../components/ui'
import {
  nodeStatusVariantMap,
  studioStageMeta,
} from './studioNodeStyles'

interface StudioNodeHeaderProps {
  node: StudioNodeCardData
  selected?: boolean
}

export function StudioNodeHeader({
  node,
  selected = false,
}: StudioNodeHeaderProps) {
  const stageMeta = studioStageMeta[node.stage]
  const nodeState = selected ? 'selected' : node.state ?? 'default'
  const statusVariant = nodeStatusVariantMap[nodeState]
  const statusLabel = node.statusLabel

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black',
            stageMeta.nodeNumberClassName,
          ].join(' ')}
        >
          {node.order}
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-slate-950">
            {node.title}
          </h3>
          <p className="mt-0.5 text-xs font-black text-slate-300">
            {stageMeta.code}
          </p>
        </div>
      </div>

      {statusLabel && (
        <StatusBadge variant={statusVariant}>{statusLabel}</StatusBadge>
      )}
    </div>
  )
}
