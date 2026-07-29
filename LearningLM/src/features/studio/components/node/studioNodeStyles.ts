import type {
  StudioNodeState,
  StudioSlotState,
  StudioStage,
} from '../../types/studioNode'

export const studioStageMeta: Record<
  StudioStage,
  {
    label: string
    code: string
    nodeNumberClassName: string
    stageTextClassName: string
    slotMarkClassName: string
    footerClassName: string
    handleClassName: string
  }
> = {
  INPUT: {
    label: '입력',
    code: 'INPUT',
    nodeNumberClassName: 'bg-slate-600 text-white',
    stageTextClassName: 'text-slate-500',
    slotMarkClassName: 'bg-slate-500',
    footerClassName: 'text-slate-600',
    handleClassName: 'border-slate-500 bg-white',
  },
  CONTEXT: {
    label: '컨텍스트',
    code: 'CONTEXT',
    nodeNumberClassName: 'bg-cyan-700 text-white',
    stageTextClassName: 'text-cyan-700',
    slotMarkClassName: 'bg-cyan-700',
    footerClassName: 'text-cyan-700',
    handleClassName: 'border-cyan-700 bg-white',
  },
  PROCESS: {
    label: '프로세스',
    code: 'PROCESS',
    nodeNumberClassName: 'bg-indigo-500 text-white',
    stageTextClassName: 'text-indigo-500',
    slotMarkClassName: 'bg-indigo-500',
    footerClassName: 'text-indigo-500',
    handleClassName: 'border-indigo-500 bg-white',
  },
  REVIEW: {
    label: '검토',
    code: 'REVIEW',
    nodeNumberClassName: 'bg-amber-600 text-white',
    stageTextClassName: 'text-amber-700',
    slotMarkClassName: 'bg-amber-600',
    footerClassName: 'text-amber-700',
    handleClassName: 'border-amber-600 bg-white',
  },
  OUTPUT: {
    label: '결과',
    code: 'OUTPUT',
    nodeNumberClassName: 'bg-emerald-700 text-white',
    stageTextClassName: 'text-emerald-700',
    slotMarkClassName: 'bg-emerald-700',
    footerClassName: 'text-emerald-700',
    handleClassName: 'border-emerald-700 bg-white',
  },
}

export const nodeStateClassMap: Record<StudioNodeState, string> = {
  default: 'border-slate-200 bg-white shadow-sm',
  selected: 'border-indigo-400 bg-white shadow-md ring-2 ring-indigo-100',
  complete: 'border-slate-200 bg-white shadow-sm',
  warning: 'border-amber-300 bg-white shadow-sm ring-1 ring-amber-100',
  missing: 'border-amber-300 bg-white shadow-sm ring-1 ring-amber-100',
  error: 'border-rose-400 bg-white shadow-sm ring-1 ring-rose-100',
  pending: 'border-dashed border-slate-300 bg-white/70 shadow-sm',
  disabled: 'border-dashed border-slate-300 bg-white/50 opacity-60 shadow-none',
}

export const nodeStatusVariantMap: Record<
  StudioNodeState,
  'success' | 'warning' | 'danger' | 'missing' | 'pending' | 'info' | 'muted'
> = {
  default: 'info',
  selected: 'info',
  complete: 'success',
  warning: 'warning',
  missing: 'missing',
  error: 'danger',
  pending: 'pending',
  disabled: 'muted',
}

export const slotStateClassMap: Record<StudioSlotState, string> = {
  default: 'border-slate-200 bg-white text-slate-700',
  filled: 'border-slate-200 bg-white text-slate-700',
  empty: 'border-slate-200 bg-white text-slate-400',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  missing: 'border-amber-200 bg-amber-50 text-amber-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
}

export function getNodeStateClassName(
  state: StudioNodeState = 'default',
  selected = false,
) {
  if (selected) {
    return nodeStateClassMap.selected
  }

  return nodeStateClassMap[state]
}
