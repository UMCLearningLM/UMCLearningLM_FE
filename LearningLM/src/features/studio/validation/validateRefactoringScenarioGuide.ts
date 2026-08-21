import type {
  StudioFlowNodeInstance,
} from '../components/node/StudioFlowNode'

import {
  STUDIO_STAGE_ORDER,
  getStudioBlockDefinition,
} from '../data/studioBlockCatalog'

import {
  REFACTORING_SCENARIO_ANSWER_BLOCK_IDS,
} from '../guided/refactoringScenarioGuide'

import type {
  StudioNodeSlot,
  StudioNodeState,
  StudioStage,
} from '../types/studioNode'

import type {
  StudioValidationIssue,
  StudioWorkflowValidationResult,
} from '../types/studioValidation'

/**
 * 리팩토링 Scenario Guide 전용 Validation입니다.
 *
 * 일반 Studio Validator와 완전히 분리합니다.
 *
 * 규칙:
 *
 * 1. 시나리오 정답 20개는 모두 필수
 * 2. 그 외 Studio 블록은 모두 선택
 * 3. 필수 20개는 캔버스에 존재해야 함
 * 4. 필수 20개는 Inspector 설정도 완료되어야 함
 * 5. 선택 블록은 존재 여부와 Inspector 상태를 검사하지 않음
 *
 * 노드 연결 상태는 기존 Studio 화면의 연결 검증에서
 * 별도로 처리합니다.
 */

interface ScenarioAnswerBlock {
  id: string
  stage: StudioStage
  order: number
  title: string
}

/**
 * Scenario 정답 ID를 실제 Studio Catalog 정보와 결합합니다.
 *
 * 정답 목록에 존재하지 않는 ID가 들어간 경우
 * 개발 단계에서 즉시 발견할 수 있도록 오류를 발생시킵니다.
 */
function createScenarioAnswerBlocks():
  ScenarioAnswerBlock[] {
  return (
    REFACTORING_SCENARIO_ANSWER_BLOCK_IDS.map(
      (blockId) => {
        const definition =
          getStudioBlockDefinition(
            blockId,
          )

        if (!definition) {
          throw new Error(
            `리팩토링 Scenario 정답 블록을 Studio Catalog에서 찾을 수 없습니다: ${blockId}`,
          )
        }

        return {
          id:
            definition.id,

          stage:
            definition.stage,

          order:
            definition.order,

          title:
            definition.title,
        }
      },
    )
  )
}

const SCENARIO_ANSWER_BLOCKS =
  createScenarioAnswerBlocks()

/**
 * 현재 캔버스의 특정 블록 Slot을 찾습니다.
 *
 * 같은 blockId라도 잘못된 Stage에 들어가 있으면
 * 정답 블록으로 인정하지 않습니다.
 */
function findScenarioSlot(
  nodes:
    readonly StudioFlowNodeInstance[],
  answerBlock:
    ScenarioAnswerBlock,
): {
  node:
    StudioFlowNodeInstance
  slot:
    StudioNodeSlot
} | null {
  for (
    const node of
      nodes
  ) {
    if (
      node.data.node.stage !==
      answerBlock.stage
    ) {
      continue
    }

    const slot =
      node.data.node.slots.find(
        (item) =>
          item.id ===
          answerBlock.id,
      )

    if (slot) {
      return {
        node,
        slot,
      }
    }
  }

  return null
}

/**
 * Inspector에 실제 설정이 들어갔는지 판단합니다.
 *
 * 대부분의 Block Inspector는 설정 완료 시
 * slot.state를 filled로 변경합니다.
 *
 * 기존 문자열 Inspector 호환을 위해
 * value가 존재하는 경우도 완료로 인정합니다.
 */
function hasScenarioSlotValue(
  slot:
    StudioNodeSlot,
): boolean {
  if (
    slot.state ===
    'filled'
  ) {
    return true
  }

  return (
    typeof slot.value ===
      'string' &&
    slot.value.trim().length >
      0
  )
}

/**
 * 필수 블록의 Inspector 상태를 검사합니다.
 */
function validateScenarioSlot(
  node:
    StudioFlowNodeInstance,
  slot:
    StudioNodeSlot,
  answerBlock:
    ScenarioAnswerBlock,
): StudioValidationIssue[] {
  if (
    slot.state ===
    'error'
  ) {
    return [
      {
        id:
          `scenario-invalid-required-slot:${node.id}:${slot.id}`,

        type:
          'invalid-required-slot',

        severity:
          'error',

        stage:
          answerBlock.stage,

        nodeId:
          node.id,

        blockId:
          answerBlock.id,

        slotId:
          slot.id,

        message:
          `${answerBlock.title} 필수 블록에 오류가 있습니다.`,
      },
    ]
  }

  if (
    slot.state ===
      'empty' ||
    slot.state ===
      'missing' ||
    !hasScenarioSlotValue(
      slot,
    )
  ) {
    return [
      {
        id:
          `scenario-missing-required-slot-value:${node.id}:${slot.id}`,

        type:
          'missing-required-slot-value',

        severity:
          'error',

        stage:
          answerBlock.stage,

        nodeId:
          node.id,

        blockId:
          answerBlock.id,

        slotId:
          slot.id,

        message:
          `${answerBlock.title} 필수 블록의 설정이 완료되지 않았습니다.`,
      },
    ]
  }

  if (
    slot.state ===
    'warning'
  ) {
    return [
      {
        id:
          `scenario-required-slot-warning:${node.id}:${slot.id}`,

        type:
          'required-slot-warning',

        severity:
          'warning',

        stage:
          answerBlock.stage,

        nodeId:
          node.id,

        blockId:
          answerBlock.id,

        slotId:
          slot.id,

        message:
          `${answerBlock.title} 필수 블록의 설정을 확인해 주세요.`,
      },
    ]
  }

  return []
}

/**
 * Validation Issue를 Studio Stage와
 * 각 Stage 내부 블록 순서대로 정렬합니다.
 */
function sortScenarioIssues(
  issues:
    readonly StudioValidationIssue[],
): StudioValidationIssue[] {
  return (
    issues
      .slice()
      .sort(
        (
          first,
          second,
        ) => {
          const firstStage =
            STUDIO_STAGE_ORDER.indexOf(
              first.stage,
            )

          const secondStage =
            STUDIO_STAGE_ORDER.indexOf(
              second.stage,
            )

          if (
            firstStage !==
            secondStage
          ) {
            return (
              firstStage -
              secondStage
            )
          }

          const firstOrder =
            getStudioBlockDefinition(
              first.blockId ??
                '',
            )?.order ??
            Number.MAX_SAFE_INTEGER

          const secondOrder =
            getStudioBlockDefinition(
              second.blockId ??
                '',
            )?.order ??
            Number.MAX_SAFE_INTEGER

          return (
            firstOrder -
            secondOrder
          )
        },
      )
  )
}

/**
 * 특정 Stage에서 빠진 Scenario 필수 블록이 있는지 확인합니다.
 */
function getStagesWithMissingBlocks(
  issues:
    readonly StudioValidationIssue[],
): Set<StudioStage> {
  return new Set(
    issues
      .filter(
        (issue) =>
          issue.type ===
          'missing-required-block',
      )
      .map(
        (issue) =>
          issue.stage,
      ),
  )
}

/**
 * Node별 최종 Validation 상태를 계산합니다.
 */
function createScenarioNodeStates(
  nodes:
    readonly StudioFlowNodeInstance[],
  issues:
    readonly StudioValidationIssue[],
): Record<
  string,
  StudioNodeState
> {
  const result:
    Record<
      string,
      StudioNodeState
    > = {}

  const missingStages =
    getStagesWithMissingBlocks(
      issues,
    )

  for (
    const node of
      nodes
  ) {
    const nodeIssues =
      issues.filter(
        (issue) =>
          issue.nodeId ===
          node.id,
      )

    const hasInvalid =
      nodeIssues.some(
        (issue) =>
          issue.type ===
          'invalid-required-slot',
      )

    if (hasInvalid) {
      result[
        node.id
      ] = 'error'

      continue
    }

    const hasMissingValue =
      nodeIssues.some(
        (issue) =>
          issue.type ===
          'missing-required-slot-value',
      )

    if (
      hasMissingValue ||
      missingStages.has(
        node.data.node.stage,
      )
    ) {
      result[
        node.id
      ] = 'missing'

      continue
    }

    const hasWarning =
      nodeIssues.some(
        (issue) =>
          issue.severity ===
          'warning',
      )

    if (hasWarning) {
      result[
        node.id
      ] = 'warning'

      continue
    }

    /**
     * 외부 로직에서 명시적으로 지정한
     * pending / disabled 상태는 유지합니다.
     */
    if (
      node.data.node.state ===
        'pending' ||
      node.data.node.state ===
        'disabled'
    ) {
      result[
        node.id
      ] =
        node.data.node.state

      continue
    }

    result[
      node.id
    ] = 'complete'
  }

  return result
}

/**
 * 리팩토링 서브 시나리오 Guide를 검증합니다.
 */
export function validateRefactoringScenarioGuide(
  nodes:
    readonly StudioFlowNodeInstance[],
): StudioWorkflowValidationResult {
  const issues:
    StudioValidationIssue[] =
    []

  const missingRequiredBlockIds:
    string[] =
    []

  /**
   * 정답 20개만 검사합니다.
   *
   * Catalog의 기존 required / recommended / optional 값은
   * 이 함수에서 사용하지 않습니다.
   */
  for (
    const answerBlock of
      SCENARIO_ANSWER_BLOCKS
  ) {
    const found =
      findScenarioSlot(
        nodes,
        answerBlock,
      )

    if (!found) {
      missingRequiredBlockIds.push(
        answerBlock.id,
      )

      issues.push({
        id:
          `scenario-missing-required-block:${answerBlock.id}`,

        type:
          'missing-required-block',

        severity:
          'error',

        stage:
          answerBlock.stage,

        blockId:
          answerBlock.id,

        message:
          `${answerBlock.title} 필수 블록이 추가되지 않았습니다.`,
      })

      continue
    }

    issues.push(
      ...validateScenarioSlot(
        found.node,
        found.slot,
        answerBlock,
      ),
    )
  }

  const sortedIssues =
    sortScenarioIssues(
      issues,
    )

  const errorCount =
    sortedIssues.filter(
      (issue) =>
        issue.severity ===
        'error',
    ).length

  const warningCount =
    sortedIssues.filter(
      (issue) =>
        issue.severity ===
        'warning',
    ).length

  return {
    valid:
      errorCount ===
      0,

    issues:
      sortedIssues,

    errorCount,

    warningCount,

    nodeStates:
      createScenarioNodeStates(
        nodes,
        sortedIssues,
      ),

    missingRequiredBlockIds,

    /**
     * 이 Scenario Guide에는 권장 블록이라는 개념이 없습니다.
     *
     * 정답 20개 = 필수
     * 나머지 = 선택
     */
    missingRecommendedBlockIds:
      [],
  }
}