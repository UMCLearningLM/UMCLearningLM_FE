import api from './api'

// 카테고리 정보 타입
export interface StorageCategory {
  categoryId: number
  code: string
  name: string
}

// 저장된 튜토리얼 정보
export interface SavedTutorial {
  tutorialId: number
  title: string
  summary: string
  difficulty: string
  categories: StorageCategory[]
  thumbnailUrl: string | null
  status: string
  currentStepOrder: number
  totalSteps: number
  progressRate: number
  flowId: number | null
  createdAt: string
  updatedAt: string
}

export interface StorageCounts {
  saved: number
  own: number
  copied: number
}

// GET /storage/tutorials의 result 구조
export interface SavedTutorialsResponse {
  totalElements: number
  tutorials: SavedTutorial[]
  counts: StorageCounts
}

// 내가 만든 흐름과 복사한 흐름에서 공통으로 사용하는 항목
export interface StorageFlow {
  flowId: number
  title: string
  summary: string | null
  difficulty: string
  categories: StorageCategory[]
  mode: string
  visibility: string
  status: string
  originalFlowId: number | null
  originalAuthorNickname: string | null
  updatedAt: string
}

// GET /storage/flows 응답의 result 구조
export interface StorageFlowsResponse {
  totalElements: number
  flows: StorageFlow[]
  counts: StorageCounts
}

export interface FlowDetailBlock {
  flowBlockId: number
  blockId: number
  name: string
  stage: string
  blockOrder: number

  options?:
    Record<string, unknown>

  promptTemplateId?:
    number | null
}

// GET /flows/{flowId}의 result 구조
export interface FlowDetail {
  flowId: number
  title: string
  summary: string | null
  purpose: string | null
  difficulty: string
  categories: StorageCategory[]
  mode: string
  flowType: string
  visibility: 'PRIVATE' | 'PUBLIC'
  status: 'DRAFT' | 'COMPLETED'
  authorNote: string | null
  exampleInput: string | null
  exampleResult: string | null
  originFlowId: number | null
  blockFlow: FlowDetailBlock[]
  createdAt: string
  updatedAt: string
}

interface FlowUpdateResult {
  flowId: number
  status: 'DRAFT' | 'COMPLETED'
  updatedAt: string
}

interface FlowDeleteResult {
  flowId: number
  deleted: boolean
}

export type StorageFlowType =
  | 'own'
  | 'copied'

interface BaseResponse<T> {
  code: string
  message: string
  result: T
  success: boolean
}

interface ApiErrorResponse {
  code?: string
  message?: string
  success?: boolean
}

function getApiErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const candidate =
      error as {
        response?: {
          data?: ApiErrorResponse
        }
      }

    const message =
      candidate.response
        ?.data
        ?.message

    if (message) {
      return message
    }
  }

  if (
    error instanceof Error
  ) {
    return error.message
  }

  return '저장소 요청 처리 중 오류가 발생했습니다.'
}

/**
 * Storage API는 별도 Axios 인스턴스를 만들지 않고
 * 공용 api.ts 인스턴스를 사용합니다.
 *
 * 공용 인스턴스가 담당하는 기능:
 *
 * 1. localStorage / sessionStorage Access Token 자동 선택
 * 2. Authorization 헤더 자동 추가
 * 3. 401 발생 시 Refresh Token 재발급
 * 4. 재발급 성공 후 원래 요청 자동 재시도
 */

// 저장한 튜토리얼 목록 조회
export async function getSavedTutorials():
  Promise<SavedTutorialsResponse> {
  try {
    const {
      data,
    } =
      await api.get<
        BaseResponse<SavedTutorialsResponse>
      >(
        '/storage/tutorials',
      )

    if (!data.success) {
      throw new Error(
        data.message ||
          '저장한 튜토리얼을 불러오지 못했습니다.',
      )
    }

    return data.result
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
      ),
    )
  }
}

// 내가 만든 흐름 또는 복사한 흐름 목록 조회
export async function getStorageFlows(
  type: StorageFlowType,
): Promise<StorageFlowsResponse> {
  try {
    const {
      data,
    } =
      await api.get<
        BaseResponse<StorageFlowsResponse>
      >(
        '/storage/flows',
        {
          params: {
            type,
          },
        },
      )

    if (!data.success) {
      throw new Error(
        data.message ||
          '저장한 흐름을 불러오지 못했습니다.',
      )
    }

    return data.result
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
      ),
    )
  }
}

// 내가 만든 흐름과 복사한 흐름 모두 flowId로 같은 상세 API를 사용합니다.
export async function getFlowDetail(
  flowId: number,
): Promise<FlowDetail> {
  try {
    const {
      data,
    } =
      await api.get<
        BaseResponse<FlowDetail>
      >(
        `/flows/${flowId}`,
      )

    if (!data.success) {
      throw new Error(
        data.message ||
          '흐름 상세 정보를 불러오지 못했습니다.',
      )
    }

    return data.result
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
      ),
    )
  }
}

// 전체 갱신 API이므로 상세조회 데이터는 유지하고 visibility만 변경합니다.
export async function updateFlowVisibility(
  flowId: number,
  visibility:
    | 'PUBLIC'
    | 'PRIVATE',
): Promise<FlowUpdateResult> {
  try {
    const detail =
      await getFlowDetail(
        flowId,
      )

    const {
      data,
    } =
      await api.put<
        BaseResponse<FlowUpdateResult>
      >(
        `/flows/${flowId}`,
        {
          title:
            detail.title,

          summary:
            detail.summary,

          purpose:
            detail.purpose,

          difficulty:
            detail.difficulty,

          categoryIds:
            detail.categories.map(
              (
                category,
              ) =>
                category.categoryId,
            ),

          visibility,

          status:
            detail.status,

          authorNote:
            detail.authorNote,

          exampleInput:
            detail.exampleInput,

          exampleResult:
            detail.exampleResult,

          blocks:
            detail.blockFlow.map(
              (
                block,
              ) => ({
                blockId:
                  block.blockId,

                blockOrder:
                  block.blockOrder,

                ...(block.options !==
                undefined
                  ? {
                      options:
                        block.options,
                    }
                  : {}),

                ...(block.promptTemplateId !==
                undefined
                  ? {
                      promptTemplateId:
                        block.promptTemplateId,
                    }
                  : {}),
              }),
            ),
        },
      )

    if (!data.success) {
      throw new Error(
        data.message ||
          '공개 상태를 변경하지 못했습니다.',
      )
    }

    return data.result
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
      ),
    )
  }
}

export async function deleteStoredFlow(
  flowId: number,
): Promise<FlowDeleteResult> {
  try {
    const {
      data,
    } =
      await api.delete<
        BaseResponse<FlowDeleteResult>
      >(
        `/flows/${flowId}`,
      )

    if (!data.success) {
      throw new Error(
        data.message ||
          '흐름을 삭제하지 못했습니다.',
      )
    }

    return data.result
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
      ),
    )
  }
}