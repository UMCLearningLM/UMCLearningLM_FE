import { ArrowRight } from 'lucide-react'
import type { StudioStage } from '../../types/studioNode'
import { studioStageMeta } from './studioNodeStyles'

interface StudioNodeFooterProps {
  stage: StudioStage
  disabled?: boolean
  label?: string
}

export function StudioNodeFooter({
  stage,
  disabled = false,
  label = '다음 단계로 전달',
}: StudioNodeFooterProps) {
  const stageMeta = studioStageMeta[stage]

  return (
    <div
      className={[
        'flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-sm font-black',
        disabled ? 'text-slate-300' : stageMeta.footerClassName,
      ].join(' ')}
    >
      <span>{label}</span>
      <ArrowRight size={16} strokeWidth={3} />
    </div>
  )
}
