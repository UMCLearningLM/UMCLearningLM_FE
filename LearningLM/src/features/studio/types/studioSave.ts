import type { Edge } from '@xyflow/react'

import type { StudioFlowNodeInstance } from '../components/node/StudioFlowNode'
import type { StudioWorkflowValidationResult } from './studioValidation'

export type StudioSaveDifficulty =
  | 'BEGINNER'
  | 'BASIC'
  | 'ADVANCED'

export type StudioSaveVisibility =
  | 'PRIVATE'
  | 'PUBLIC'

export type StudioSaveMode =
  | 'guided'
  | 'create'
  | 'copied'
  | 'edit'
  | 'preview'

export interface StudioSaveDraft {
  title: string
  summary: string
  purpose: string

  /**
   * 아직 BE categoryId와 직접 연결하지 않습니다.
   *
   * 이 단계에서는 사용자가 선택한
   * 카테고리 이름을 저장해두고,
   * 다음 API 연동 단계에서 실제 categoryId로 변환합니다.
   */
  categories: string[]

  difficulty: StudioSaveDifficulty

  /**
   * 현재 Flow PUT API에는 tag 필드가 없지만
   * 와이어프레임 상태 보존을 위해 유지합니다.
   */
  tags: string[]

  exampleInput: string
  exampleResult: string
  authorNote: string

  visibility: StudioSaveVisibility
}

export interface StudioSaveNavigationState {
  mode?: StudioSaveMode

  flowId?: number

  tutorialId?: number
  originFlowId?: number
  copiedLibraryItemId?: number

  nodes?: StudioFlowNodeInstance[]
  edges?: Edge[]

  validationResult?:
    | StudioWorkflowValidationResult
    | null

  saveDraft?: StudioSaveDraft
}

export function createDefaultStudioSaveDraft(): StudioSaveDraft {
  return {
    title: '',
    summary: '',
    purpose: '',

    categories: [],

    difficulty: 'BASIC',

    tags: [],

    exampleInput: '',
    exampleResult: '',
    authorNote: '',

    visibility: 'PRIVATE',
  }
}