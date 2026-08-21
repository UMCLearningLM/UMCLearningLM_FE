import {
  useCallback,
  useEffect,
  useMemo,
} from 'react'

import {
  studioBlockCatalog,
} from '../data/studioBlockCatalog'

import {
  useStudioEditor,
  type UseStudioEditorOptions,
} from '../hooks/useStudioEditor'

import {
  createRefactoringScenarioInitialEdges,
  createRefactoringScenarioInitialNodes,
  getRefactoringScenarioRequirement,
  isRefactoringScenarioAnswerBlock,
} from './refactoringScenarioGuide'

import {
  validateRefactoringScenarioGuide,
} from '../validation/validateRefactoringScenarioGuide'

export interface UseScenarioAwareStudioEditorOptions
  extends UseStudioEditorOptions {
  /**
   * 코드 리팩토링 서브 시나리오 Guide인지 여부입니다.
   *
   * false면 기존 useStudioEditor 동작을 그대로 사용합니다.
   */
  refactoringScenarioEnabled:
    boolean
}

/**
 * 기존 Studio Editor 위에
 * 리팩토링 서브 시나리오 전용 동작만 얹는 Adapter입니다.
 *
 * 중요한 원칙:
 *
 * - studioBlockCatalog 수정 안 함
 * - 기존 Studio Validator 수정 안 함
 * - 기존 Research Guided Tutorial 수정 안 함
 *
 * Scenario가 아닐 경우 기존 useStudioEditor와
 * 동일하게 동작합니다.
 */
export function useScenarioAwareStudioEditor({
  refactoringScenarioEnabled,
  initialNodes = [],
  initialEdges = [],
  ...options
}: UseScenarioAwareStudioEditorOptions) {
  /**
   * Scenario 최초 진입이고
   * 복원할 기존 노드가 없는 경우에만
   * 8개 preset 블록을 생성합니다.
   */
  const resolvedInitialNodes =
    useMemo(
      () => {
        if (
          refactoringScenarioEnabled &&
          initialNodes.length ===
            0
        ) {
          return (
            createRefactoringScenarioInitialNodes()
          )
        }

        return initialNodes
      },
      [
        initialNodes,
        refactoringScenarioEnabled,
      ],
    )

  const resolvedInitialEdges =
    useMemo(
      () => {
        if (
          refactoringScenarioEnabled &&
          initialNodes.length ===
            0
        ) {
          return (
            createRefactoringScenarioInitialEdges()
          )
        }

        return initialEdges
      },
      [
        initialEdges,
        initialNodes.length,
        refactoringScenarioEnabled,
      ],
    )

  /**
   * 실제 Canvas 편집 기능은 기존 Hook을 그대로 사용합니다.
   */
  const studio =
    useStudioEditor({
      ...options,

      initialNodes:
        resolvedInitialNodes,

      initialEdges:
        resolvedInitialEdges,
    })

  /**
   * Scenario 전용 Palette Catalog입니다.
   *
   * 원본 studioBlockCatalog를 mutate하지 않고
   * 화면에서 사용할 복사본만 생성합니다.
   *
   * 정답 20개:
   * required
   *
   * 그 외:
   * optional
   *
   * 따라서 Scenario에서는
   * recommended 라벨이 존재하지 않습니다.
   */
  const paletteCatalog =
    useMemo(
      () => {
        if (
          !refactoringScenarioEnabled
        ) {
          return studioBlockCatalog
        }

        return studioBlockCatalog.map(
          (block) => ({
            ...block,

            requirement:
              getRefactoringScenarioRequirement(
                block.id,
              ),
          }),
        )
      },
      [
        refactoringScenarioEnabled,
      ],
    )

  /**
   * 기존 createStudioNode / Drop 기능은
   * 원본 Catalog의 required 값을 Slot에 넣습니다.
   *
   * Scenario에서는 그 값 역시 화면 한정 규칙에 맞춰야 하므로
   * 현재 Canvas Slot의 required flag만 동기화합니다.
   *
   * 정답 20개 → true
   * 나머지 → false
   *
   * Catalog 원본에는 아무 영향이 없습니다.
   */
  useEffect(
    () => {
      if (
        !refactoringScenarioEnabled
      ) {
        return
      }

      studio.setNodes(
        (
          currentNodes,
        ) => {
          let changed =
            false

          const nextNodes =
            currentNodes.map(
              (node) => {
                let nodeChanged =
                  false

                const nextSlots =
                  node.data.node.slots.map(
                    (slot) => {
                      const required =
                        isRefactoringScenarioAnswerBlock(
                          slot.id,
                        )

                      if (
                        slot.required ===
                        required
                      ) {
                        return slot
                      }

                      changed =
                        true

                      nodeChanged =
                        true

                      return {
                        ...slot,

                        required,
                      }
                    },
                  )

                if (
                  !nodeChanged
                ) {
                  return node
                }

                return {
                  ...node,

                  data: {
                    ...node.data,

                    node: {
                      ...node.data.node,

                      slots:
                        nextSlots,
                    },
                  },
                }
              },
            )

          return changed
            ? nextNodes
            : currentNodes
        },
      )
    },
    [
      refactoringScenarioEnabled,
      studio.nodes,
      studio.setNodes,
    ],
  )

  /**
   * GUIDED Flow를 생성하면 서버에는 아직 blockFlow가 없을 수 있습니다.
   *
   * 이때 기존 Stdio_create1 hydration이 빈 배열을 setNodes([])로
   * 전달하면 Scenario preset까지 사라질 수 있습니다.
   *
   * Scenario에서 이미 초기 노드가 존재하고,
   * 외부에서 직접 빈 배열을 넣으려는 경우에만 이를 무시합니다.
   *
   * 함수형 setNodes는 정상적으로 통과하므로
   * 블록 추가/삭제/Inspector 수정에는 영향을 주지 않습니다.
   */
  const setNodes:
    typeof studio.setNodes =
    useCallback(
      (
        nextNodes,
      ) => {
        if (
          refactoringScenarioEnabled &&
          Array.isArray(
            nextNodes,
          ) &&
          nextNodes.length ===
            0 &&
          studio.nodes.length >
            0
        ) {
          return
        }

        studio.setNodes(
          nextNodes,
        )
      },
      [
        refactoringScenarioEnabled,
        studio.nodes.length,
        studio.setNodes,
      ],
    )

  /**
   * 검증 버튼과 저장 직전 검증에서 사용하는 함수입니다.
   *
   * 일반 Studio:
   * 기존 validateWorkflow
   *
   * Scenario:
   * validateRefactoringScenarioGuide
   */
  const validateWorkflow =
    useCallback(
      () => {
        if (
          !refactoringScenarioEnabled
        ) {
          return (
            studio.validateWorkflow()
          )
        }

        const result =
          validateRefactoringScenarioGuide(
            studio.nodes,
          )

        /**
         * 기존 Validator와 동일하게
         * 검증 결과를 Canvas Node 상태에 반영합니다.
         */
        studio.setNodes(
          (
            currentNodes,
          ) =>
            currentNodes.map(
              (node) => ({
                ...node,

                data: {
                  ...node.data,

                  node: {
                    ...node.data.node,

                    state:
                      result.nodeStates[
                        node.id
                      ] ??
                      'default',
                  },
                },
              }),
            ),
        )

        return result
      },
      [
        refactoringScenarioEnabled,
        studio.nodes,
        studio.setNodes,
        studio.validateWorkflow,
      ],
    )

  return {
    ...studio,

    /**
     * Scenario의 빈 서버 Flow가
     * 초기 preset을 지우지 않도록 감싼 setter입니다.
     */
    setNodes,

    /**
     * Scenario 여부에 따라 자동 분기되는 Validator입니다.
     */
    validateWorkflow,

    /**
     * Palette 렌더링 전용 Catalog입니다.
     */
    paletteCatalog,
  }
}