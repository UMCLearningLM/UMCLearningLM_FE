import type {
  StudioNodeSlot,
  StudioStage,
} from '../../types/studioNode'
import {
  slotStateClassMap,
  studioStageMeta,
} from './studioNodeStyles'

interface StudioNodeSlotRowProps {
  slot: StudioNodeSlot
  stage: StudioStage
}

export function StudioNodeSlotRow({ slot, stage }: StudioNodeSlotRowProps) {
  const stageMeta = studioStageMeta[stage]
  const slotState = slot.state ?? 'default'

  return (
    <div
      className={[
        'flex h-10 items-center justify-between gap-3 rounded-lg border px-3',
        slotStateClassMap[slotState],
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={[
            'h-2.5 w-2.5 shrink-0 rounded-[3px]',
            stageMeta.slotMarkClassName,
          ].join(' ')}
          aria-hidden="true"
        />

        <span className="truncate text-sm font-black text-slate-800">
          {slot.label}
        </span>
      </div>

      <span className="shrink-0 text-xs font-bold text-slate-400">
        {slot.value ?? (slot.required ? '필수' : '선택')}
      </span>
    </div>
  )
}
