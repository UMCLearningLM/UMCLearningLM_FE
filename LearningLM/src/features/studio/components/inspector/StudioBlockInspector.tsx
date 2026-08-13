import {
  useState,
  type ComponentType,
} from 'react'

import {
  ExpandableSettingBlockEnvironmentProvider,
} from '../../../Block/components/layouts/ExpandableSettingBlock'

import {
  getStudioBlockDefinition,
  type StudioBlockId,
} from '../../data/studioBlockCatalog'

import type {
  StudioBlockConfig,
  StudioNodeSlot,
  StudioSlotState,
  StudioStage,
} from '../../types/studioNode'

import {
  UserRequestInspector,
} from './input/UserRequestInspector'

import {
  ConstraintInputInspector,
  FileUploadInspector,
  GoalSettingInspector,
  RequiredDocumentInspector,
  RequiredSkillInspector,
  ResultUsageInspector,
  TargetAudienceInspector,
  TopicInputInspector,
} from './input/InputBlockInspectors'

import {
  BackgroundContextInspector,
  DirectContextInputInspector,
  ExclusionContextInspector,
  ReferenceScopeInspector,
  RoleAssignmentInspector,
  UploadedDocumentInspector,
} from './context/ContextBlockInspectors'

import {
  ProjectDocumentInspector,
} from './context/ProjectDocumentInspector'

import {
  ConditionCheckInspector,
  DuplicateRemovalInspector,
  ErrorLocationInspector,
  EvidenceCheckInspector,
  FixGuideInspector,
  FormatCheckInspector,
  MissingCheckInspector,
  PolicyConflictInspector,
  ToneAdjustmentInspector,
} from './review/ReviewBlockInspectors'

import {
  ChecklistOutputInspector,
  CopyableFlowInspector,
  DeveloperHandoffInspector,
  DocumentDraftInspector,
  PresentationSummaryInspector,
  PromptOutputInspector,
  PublicDescriptionInspector,
  SaveStorageInspector,
  StepGuideInspector,
  TableOutputInspector,
  TextOutputInspector,
} from './output/OutputBlockInspectors'

import {
  ExtractCoreInspector,
  SummaryInspector,
} from './process/ProcessCoreInspectors'


export interface StudioInspectorConfigUpdateOptions {
  summaryValue?: string
  state?: StudioSlotState
}

/**
 * 현재 선택된 Stage Node와 연결된 다른 Stage Node의 요약 정보입니다.
 *
 * Stdio_create1.tsx의 selectedConnectionInfo가 만드는 데이터 구조와
 * 동일하게 유지합니다.
 */
export interface StudioInspectorConnectedNode {
  id: string
  title: string
  stage: StudioStage
  slots: StudioNodeSlot[]
}

/**
 * Inspector에서 이전/다음 연결 노드가 필요한 블록을 위해
 * 전달하는 연결 정보입니다.
 *
 * 연결 정보가 필요하지 않은 Inspector도 같은 공통 Props 타입을
 * 사용하므로 optional로 둡니다.
 */
export interface StudioInspectorConnectionInfo {
  incomingNodes: StudioInspectorConnectedNode[]
  outgoingNodes: StudioInspectorConnectedNode[]
}

export interface StudioBlockInspectorComponentProps {
  nodeId: string

  slot: StudioNodeSlot

  connectionInfo?: StudioInspectorConnectionInfo

  onConfigChange: (
    patch: StudioBlockConfig,
    options?: StudioInspectorConfigUpdateOptions,
  ) => void

  onValueChange: (
    value: string,
  ) => void
}

export interface StudioBlockInspectorProps {
  nodeId: string

  slot: StudioNodeSlot

  connectionInfo?: StudioInspectorConnectionInfo

  onConfigChange: (
    patch: StudioBlockConfig,
    options?: StudioInspectorConfigUpdateOptions,
  ) => void

  onValueChange: (
    value: string,
  ) => void
}

type StudioBlockInspectorComponent =
  ComponentType<StudioBlockInspectorComponentProps>

const stageColorMap: Record<
  StudioStage,
  string
> = {
  INPUT:
    'bg-[#4A5E8A]',

  CONTEXT:
    'bg-[#2F8190]',

  PROCESS:
    'bg-[#6366F1]',

  REVIEW:
    'bg-[#B07A2E]',

  OUTPUT:
    'bg-[#3C7A52]',
}

const studioBlockInspectorRegistry:
  Partial<
    Record<
      StudioBlockId,
      StudioBlockInspectorComponent
    >
  > = {
    /*
     * INPUT
     */

    'input-text':
      UserRequestInspector,

    'input-goal':
      GoalSettingInspector,

    'input-topic':
      TopicInputInspector,

    'input-file-upload':
      FileUploadInspector,

    'input-required-document':
      RequiredDocumentInspector,

    'input-required-skill':
      RequiredSkillInspector,

    'input-target-audience':
      TargetAudienceInspector,

    'input-result-usage':
      ResultUsageInspector,

    'input-constraints':
      ConstraintInputInspector,

    /*
     * CONTEXT
     */

    'context-project-document':
      ProjectDocumentInspector,

    'context-uploaded-document':
      UploadedDocumentInspector,

    'context-direct-input':
      DirectContextInputInspector,

    'context-reference-scope':
      ReferenceScopeInspector,

    'context-role':
      RoleAssignmentInspector,

    'context-background':
      BackgroundContextInspector,

    'context-exclusion':
      ExclusionContextInspector,

          /*
     * PROCESS
     */

    'process-extract-core':
      ExtractCoreInspector,

    'process-summary':
      SummaryInspector,
    
      /*
     * REVIEW
     */

    'review-missing':
      MissingCheckInspector,

    'review-quality':
      FormatCheckInspector,

    'review-condition':
      ConditionCheckInspector,

    'review-policy-conflict':
      PolicyConflictInspector,

    'review-evidence':
      EvidenceCheckInspector,

    'review-deduplicate':
      DuplicateRemovalInspector,

    'review-tone':
      ToneAdjustmentInspector,

    'review-error-location':
      ErrorLocationInspector,

    'review-fix-guide':
      FixGuideInspector,

          /*
     * OUTPUT
     */

    'output-text':
      TextOutputInspector,

    'output-table':
      TableOutputInspector,

    'output-checklist':
      ChecklistOutputInspector,

    'output-document-draft':
      DocumentDraftInspector,

    'output-presentation-summary':
      PresentationSummaryInspector,

    'output-developer-handoff':
      DeveloperHandoffInspector,

    'output-prompt':
      PromptOutputInspector,

    'output-step-guide':
      StepGuideInspector,

    'output-save-storage':
      SaveStorageInspector,

    'output-public-description':
      PublicDescriptionInspector,

    'output-copyable-flow':
      CopyableFlowInspector,
  }

export function hasStudioBlockInspector(
  blockId: string,
): boolean {
  const definition =
    getStudioBlockDefinition(
      blockId,
    )

  if (!definition) {
    return false
  }

  return Boolean(
    studioBlockInspectorRegistry[
      definition.id as StudioBlockId
    ],
  )
}

function GenericStudioBlockInspector({
  slot,
}: StudioBlockInspectorComponentProps) {
  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false)

  const definition =
    getStudioBlockDefinition(
      slot.id,
    )

  const stage =
    definition?.stage

  const requirementLabel =
    slot.required
      ? '필수'
      : definition?.requirement ===
          'recommended'
        ? '권장'
        : '선택'

  const hasValue =
    Boolean(
      slot.value?.trim(),
    )

  const hasConfig =
    Boolean(
      slot.config &&
        Object.keys(
          slot.config,
        ).length >
          0,
    )

  return (
    <section className="overflow-hidden rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white">
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (
              current,
            ) =>
              !current,
          )
        }
        className="flex w-full items-center px-[14px] py-[13px] text-left"
        aria-expanded={
          isOpen
        }
      >
        <span
          className={[
            'h-[21px] w-[21px] shrink-0 rounded-[8px]',

            stage
              ? stageColorMap[
                  stage
                ]
              : 'bg-[#9A9AA3]',
          ].join(' ')}
        />

        <span className="ml-[12px] min-w-0 flex-1">
          <span className="block truncate text-[16.5px] font-bold text-[#27272A]">
            {
              slot.label
            }
          </span>

          {definition && (
            <span className="mt-[3px] block truncate text-[12px] font-medium text-[#9A9AA3]">
              {
                definition.description
              }
            </span>
          )}
        </span>

        <span
          className={[
            'ml-[10px] shrink-0 text-[11.5px] font-bold',

            slot.required
              ? 'text-[#6366F1]'
              : definition?.requirement ===
                  'recommended'
                ? 'rounded-[6px] bg-[#EEF4EE] px-[7px] py-[3px] text-[#5FAA81]'
                : 'rounded-[6px] bg-[#F0F0F3] px-[7px] py-[3px] text-[#9A9AA3]',
          ].join(' ')}
        >
          {
            requirementLabel
          }
        </span>

        <span className="ml-[14px] shrink-0 text-[18px] text-[#9A9AA3]">
          {isOpen
            ? '⌃'
            : '⌄'}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-[#EEEEF1] px-[14px] py-[14px]">
          <p className="text-[14px] font-bold text-[#52525B]">
            설정값
          </p>

          <p className="mt-[6px] text-[14px] leading-[20px] text-[#9A9AA3]">
            {hasValue
              ? slot.value
              : hasConfig
                ? '구조화된 설정값이 저장되어 있습니다.'
                : '아직 설정된 값이 없습니다.'}
          </p>

          <p className="mt-[10px] text-[12px] leading-[18px] text-[#B0B0B8]">
            상세 설정 UI는
            Studio Inspector
            이식 단계에서
            적용됩니다.
          </p>
        </div>
      )}
    </section>
  )
}

export function StudioBlockInspector({
  nodeId,
  slot,
  connectionInfo,
  onConfigChange,
  onValueChange,
}: StudioBlockInspectorProps) {
  const definition =
    getStudioBlockDefinition(
      slot.id,
    )

  if (!definition) {
    return (
      <GenericStudioBlockInspector
        nodeId={
          nodeId
        }
        slot={
          slot
        }
        connectionInfo={
          connectionInfo
        }
        onConfigChange={
          onConfigChange
        }
        onValueChange={
          onValueChange
        }
      />
    )
  }

  const InspectorComponent =
    studioBlockInspectorRegistry[
      definition.id as StudioBlockId
    ]

  if (!InspectorComponent) {
    return (
      <GenericStudioBlockInspector
        nodeId={
          nodeId
        }
        slot={
          slot
        }
        connectionInfo={
          connectionInfo
        }
        onConfigChange={
          onConfigChange
        }
        onValueChange={
          onValueChange
        }
      />
    )
  }

  return (
    <ExpandableSettingBlockEnvironmentProvider
      embeddedInStudioInspector
    >
      <InspectorComponent
        nodeId={
          nodeId
        }
        slot={
          slot
        }
        connectionInfo={
          connectionInfo
        }
        onConfigChange={
          onConfigChange
        }
        onValueChange={
          onValueChange
        }
      />
    </ExpandableSettingBlockEnvironmentProvider>
  )
}