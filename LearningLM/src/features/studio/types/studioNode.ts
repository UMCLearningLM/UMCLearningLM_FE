export type StudioStage = 'INPUT' | 'CONTEXT' | 'PROCESS' | 'REVIEW' | 'OUTPUT'

export type StudioNodeState =
  | 'default'
  | 'selected'
  | 'complete'
  | 'warning'
  | 'missing'
  | 'error'
  | 'pending'
  | 'disabled'

export type StudioSlotState =
  | 'default'
  | 'filled'
  | 'empty'
  | 'warning'
  | 'missing'
  | 'error'

export interface StudioNodeSlot {
  id: string
  label: string
  value?: string
  required?: boolean
  state?: StudioSlotState
}

export interface StudioNodeCardData {
  id: string
  order: number
  stage: StudioStage
  title: string
  statusLabel?: string
  state?: StudioNodeState
  slots: StudioNodeSlot[]
}
