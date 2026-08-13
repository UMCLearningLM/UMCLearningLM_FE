import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  '/api'

const studioApi =
  axios.create({
    baseURL:
      API_BASE_URL,

    timeout:
      10_000,
  })

function authConfig(
  accessToken?: string,
) {
  return {
    headers:
      accessToken
        ? {
            Authorization:
              `Bearer ${accessToken}`,
          }
        : undefined,
  }
}

/* =========================================================
 * 1. Flow 생성
 * ========================================================= */

export interface CreateFlowRequest {
  mode: string
  tutorialId?: number | null
  originFlowId?: number | null
}

export interface CreateFlowResponse {
  code: string
  message: string

  result: {
    flowId: number
    title: string
    mode: string
    status: string
    createdAt: string
  }

  success: boolean
}

export async function createFlow(
  data: CreateFlowRequest,
  accessToken?: string,
): Promise<CreateFlowResponse> {
  const response =
    await studioApi.post<CreateFlowResponse>(
      '/flows',
      data,
      authConfig(
        accessToken,
      ),
    )

  return response.data
}

/* =========================================================
 * 2. Flow 상세 조회
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

  options?: Record<
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

export interface GetFlowResponse {
  code: string
  message: string
  result: GetFlowResult
  success: boolean
}

export async function getFlow(
  flowId: number,
  accessToken?: string,
): Promise<GetFlowResponse> {
  const response =
    await studioApi.get<GetFlowResponse>(
      `/flows/${flowId}`,
      authConfig(
        accessToken,
      ),
    )

  return response.data
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

export interface GetStudioBlocksResponse {
  code: string
  message: string
  result: GetStudioBlocksResult
  success: boolean
}

export interface GetStudioBlocksParams {
  q?: string
  stage?: string
  tutorialId?: number
}

export async function getStudioBlocks(
  params:
    GetStudioBlocksParams = {},
  accessToken?: string,
): Promise<GetStudioBlocksResponse> {
  const response =
    await studioApi.get<GetStudioBlocksResponse>(
      '/blocks',
      {
        ...authConfig(
          accessToken,
        ),

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

  return response.data
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

export interface FlowUpdateResponse {
  code: string
  message: string

  result: {
    flowId: number
    status: string
    updatedAt: string
  }

  success: boolean
}

export async function saveFlow(
  flowId: number,
  data: FlowUpdateRequest,
  accessToken?: string,
): Promise<FlowUpdateResponse> {
  const response =
    await studioApi.put<FlowUpdateResponse>(
      `/flows/${flowId}`,
      data,
      authConfig(
        accessToken,
      ),
    )

  return response.data
}

/* =========================================================
 * 5. Flow 삭제
 * ========================================================= */

export interface DeleteFlowResponse {
  code: string
  message: string

  result: {
    flowId: number
    deleted: boolean
  }

  success: boolean
}

export async function deleteFlow(
  flowId: number,
  accessToken?: string,
): Promise<DeleteFlowResponse> {
  const response =
    await studioApi.delete<DeleteFlowResponse>(
      `/flows/${flowId}`,
      authConfig(
        accessToken,
      ),
    )

  return response.data
}

/* =========================================================
 * 6. Flow 검증
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

export interface VerifyFlowResponse {
  code: string
  message: string

  result: {
    totalStatus: string

    summary: {
      pass: number
      insufficient: number
      pending: number
    }

    results:
      VerifyFlowResultItem[]
  }

  success: boolean
}

export async function verifyFlow(
  flowId: number,
  data: VerifyFlowRequest,
  accessToken?: string,
): Promise<VerifyFlowResponse> {
  const response =
    await studioApi.post<VerifyFlowResponse>(
      `/flows/${flowId}/verify`,
      data,
      authConfig(
        accessToken,
      ),
    )

  return response.data
}

/* =========================================================
 * 7. 예시 결과 생성
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

export interface PreviewFlowResponse {
  code: string
  message: string

  result: {
    resultText: string
    resultSource: string
    modelName: string
  }

  success: boolean
}

export async function previewFlow(
  flowId: number,
  data: PreviewFlowRequest,
  accessToken?: string,
): Promise<PreviewFlowResponse> {
  const response =
    await studioApi.post<PreviewFlowResponse>(
      `/flows/${flowId}/preview`,
      data,
      authConfig(
        accessToken,
      ),
    )

  return response.data
}