import api from '../../api/api'

/**
 * Studio API도 LearningLM 공용 Axios 인스턴스를 사용합니다.
 *
 * 공용 api.ts에서 다음 기능을 일괄 처리합니다.
 *
 * 1. VITE_API_BASE_URL 적용
 * 2. localStorage / sessionStorage Access Token 선택
 * 3. Authorization 헤더 자동 추가
 * 4. 401 시 Refresh Token 재발급
 * 5. 재발급 후 실패했던 요청 자동 재시도
 *
 * 기존 호출부와의 호환성을 위해 함수의 accessToken 인자는
 * 당분간 유지하지만 실제 인증은 공용 interceptor가 담당합니다.
 */

/* =========================================================
 * 공통
 * ========================================================= */

export interface StudioApiBaseResponse<T> {
  code: string
  message: string
  result: T
  success: boolean
}

/* =========================================================
 * 1. Flow 생성
 * POST /flows
 * ========================================================= */

export interface CreateFlowRequest {
  mode: string
  tutorialId?: number | null
  originFlowId?: number | null
}

export interface CreateFlowResult {
  flowId: number
  title: string
  mode: string
  status: string
  createdAt: string
}

export type CreateFlowResponse =
  StudioApiBaseResponse<
    CreateFlowResult
  >

export async function createFlow(
  data: CreateFlowRequest,

  /**
   * P0 이전 호출부 호환용입니다.
   * 실제 Authorization 처리는 api.ts interceptor가 담당합니다.
   */
  _accessToken?: string,
): Promise<CreateFlowResponse> {
  const {
    data:
      responseData,
  } =
    await api.post<CreateFlowResponse>(
      '/flows',
      data,
    )

  return responseData
}

/* =========================================================
 * 2. Flow 상세 조회
 * GET /flows/{flowId}
 * ========================================================= */

export interface FlowCategory {
  categoryId: number
  code: string
  name: string
}

export interface FlowBlock {
  flowBlockId: number
  blockId: number
  name: string
  stage: string
  blockOrder: number

  options?:
    Record<
      string,
      unknown
    > | null

  promptTemplateId?:
    number | null
}

export interface GetFlowResult {
  flowId: number
  title: string

  summary:
    string | null

  purpose:
    string | null

  difficulty:
    string | null

  categories:
    FlowCategory[]

  mode: string
  flowType: string
  visibility: string
  status: string

  authorNote:
    string | null

  exampleInput:
    string | null

  exampleResult:
    string | null

  originFlowId:
    number | null

  blockFlow:
    FlowBlock[]

  createdAt: string
  updatedAt: string
}

export type GetFlowResponse =
  StudioApiBaseResponse<
    GetFlowResult
  >

export async function getFlow(
  flowId: number,
  _accessToken?: string,
): Promise<GetFlowResponse> {
  const {
    data:
      responseData,
  } =
    await api.get<GetFlowResponse>(
      `/flows/${flowId}`,
    )

  return responseData
}

/* =========================================================
 * 3. 블록 팔레트 조회
 * GET /blocks
 * ========================================================= */

export interface StudioApiBlock {
  blockId: number
  name: string
  description: string
  status: string
  required: boolean
}

export interface StudioApiBlockStage {
  stage: string
  label: string

  blocks:
    StudioApiBlock[]
}

export interface GetStudioBlocksResult {
  mode: string

  tutorialId:
    number | null

  stages:
    StudioApiBlockStage[]
}

export type GetStudioBlocksResponse =
  StudioApiBaseResponse<
    GetStudioBlocksResult
  >

export interface GetStudioBlocksParams {
  q?: string
  stage?: string
  tutorialId?: number
}

export async function getStudioBlocks(
  params:
    GetStudioBlocksParams = {},
  _accessToken?: string,
): Promise<GetStudioBlocksResponse> {
  const {
    data:
      responseData,
  } =
    await api.get<GetStudioBlocksResponse>(
      '/blocks',
      {
        params: {
          ...(params.q
            ? {
                q:
                  params.q,
              }
            : {}),

          ...(params.stage
            ? {
                stage:
                  params.stage,
              }
            : {}),

          ...(params.tutorialId
            ? {
                tutorialId:
                  params.tutorialId,
              }
            : {}),
        },
      },
    )

  return responseData
}

/* =========================================================
 * 4. Flow 저장
 * PUT /flows/{flowId}
 * ========================================================= */

export interface FlowUpdateBlock {
  blockId: number
  blockOrder: number

  options:
    Record<
      string,
      unknown
    >

  promptTemplateId:
    number | null
}

export interface FlowUpdateRequest {
  title: string

  summary:
    string | null

  purpose:
    string | null

  difficulty:
    string | null

  categoryIds:
    number[]

  visibility:
    string

  status:
    string

  authorNote:
    string | null

  exampleInput:
    string | null

  exampleResult:
    string | null

  blocks:
    FlowUpdateBlock[]
}

export interface FlowUpdateResult {
  flowId: number
  status: string
  updatedAt: string
}

export type FlowUpdateResponse =
  StudioApiBaseResponse<
    FlowUpdateResult
  >

export async function saveFlow(
  flowId: number,
  data: FlowUpdateRequest,
  _accessToken?: string,
): Promise<FlowUpdateResponse> {
  const {
    data:
      responseData,
  } =
    await api.put<FlowUpdateResponse>(
      `/flows/${flowId}`,
      data,
    )

  return responseData
}

/* =========================================================
 * 5. Flow 삭제
 * DELETE /flows/{flowId}
 * ========================================================= */

export interface DeleteFlowResult {
  flowId: number
  deleted: boolean
}

export type DeleteFlowResponse =
  StudioApiBaseResponse<
    DeleteFlowResult
  >

export async function deleteFlow(
  flowId: number,
  _accessToken?: string,
): Promise<DeleteFlowResponse> {
  const {
    data:
      responseData,
  } =
    await api.delete<DeleteFlowResponse>(
      `/flows/${flowId}`,
    )

  return responseData
}

/* =========================================================
 * 6. Flow 검증
 * POST /flows/{flowId}/verify
 * ========================================================= */

export interface VerifyFlowBlock {
  blockId: number
  blockOrder: number

  input:
    Record<
      string,
      unknown
    >

  options:
    Record<
      string,
      unknown
    >

  resolvedContext:
    Record<
      string,
      unknown
    >
}

export interface VerifyFlowRequest {
  blocks:
    VerifyFlowBlock[]
}

export interface VerifyFlowResultItem {
  ruleId: number
  name: string
  status: string
  criteria: string
  checkedResult: string
  guide: string
  targetStage: string
}

export interface VerifyFlowResult {
  totalStatus: string

  summary: {
    pass: number
    insufficient: number
    pending: number
  }

  results:
    VerifyFlowResultItem[]
}

export type VerifyFlowResponse =
  StudioApiBaseResponse<
    VerifyFlowResult
  >

export async function verifyFlow(
  flowId: number,
  data: VerifyFlowRequest,
  _accessToken?: string,
): Promise<VerifyFlowResponse> {
  const {
    data:
      responseData,
  } =
    await api.post<VerifyFlowResponse>(
      `/flows/${flowId}/verify`,
      data,
    )

  return responseData
}

/* =========================================================
 * 7. 예시 결과 생성
 * POST /flows/{flowId}/preview
 * ========================================================= */

export interface PreviewFlowBlock {
  blockId: number
  blockOrder: number

  input:
    Record<
      string,
      unknown
    >

  options:
    Record<
      string,
      unknown
    >

  resolvedContext:
    Record<
      string,
      unknown
    >
}

export interface PreviewFlowRequest {
  blocks:
    PreviewFlowBlock[]
}

export interface PreviewFlowResult {
  resultText: string
  resultSource: string
  modelName: string
}

export type PreviewFlowResponse =
  StudioApiBaseResponse<
    PreviewFlowResult
  >

export async function previewFlow(
  flowId: number,
  data: PreviewFlowRequest,
  _accessToken?: string,
): Promise<PreviewFlowResponse> {
  const {
    data:
      responseData,
  } =
    await api.post<PreviewFlowResponse>(
      `/flows/${flowId}/preview`,
      data,
    )

  return responseData
}

/* =========================================================
 * 8. Flow 파일 업로드
 * POST /flows/{flowId}/files
 * ========================================================= */

export type UploadedFlowFileStatus =
  | 'READY'
  | 'PARSE_FAILED'

export interface UploadedFlowFileResult {
  fileId: number
  fileName: string
  fileType: string
  fileSize: number
  status: UploadedFlowFileStatus
}

export type UploadFlowFileResponse =
  StudioApiBaseResponse<
    UploadedFlowFileResult
  >

export async function uploadFlowFile(
  flowId: number,
  file: File,
  _accessToken?: string,
): Promise<UploadFlowFileResponse> {
  const formData =
    new FormData()

  formData.append(
    'file',
    file,
    file.name,
  )

  const {
    data:
      responseData,
  } =
    await api.post<UploadFlowFileResponse>(
      `/flows/${flowId}/files`,
      formData,
      {
        /*
         * 파일 업로드는 기존 JSON 요청보다 오래 걸릴 수 있어
         * 공용 10초 timeout 대신 60초를 사용합니다.
         *
         * Content-Type은 직접 지정하지 않습니다.
         * Axios가 FormData boundary를 자동으로 붙입니다.
         */
        timeout:
          60_000,
      },
    )

  return responseData
}