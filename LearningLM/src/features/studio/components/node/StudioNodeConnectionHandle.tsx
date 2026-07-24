import type { StudioStage } from '../../types/studioNode'
import { studioStageMeta } from './studioNodeStyles'

interface StudioNodeConnectionHandleProps {
  stage: StudioStage
  position: 'left' | 'right'
  disabled?: boolean
  className?: string
}

export function StudioNodeConnectionHandle({
  stage,
  position,
  disabled = false,
  className = '',
}: StudioNodeConnectionHandleProps) {
  const stageMeta = studioStageMeta[stage]

  return (
    <span
      className={[
        'absolute top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full border-[3px]',
        position === 'left' ? '-left-3' : '-right-3',
        disabled ? 'border-slate-300 bg-white' : stageMeta.handleClassName,
        className,
      ].join(' ')}
      aria-hidden="true"
    />
  )
}
