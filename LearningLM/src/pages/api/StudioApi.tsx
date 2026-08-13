import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});


// ==============================
// 1. Flow 생성 API
// ==============================

export interface CreateFlowRequest {
  mode: 'CREATE' | 'TUTORIAL' | 'COPY';
  tutorialId?: number | null;
  originFlowId?: number | null;
}

export interface CreateFlowResponse {
  code: string;
  message: string;
  result: {
    flowId: number;
    title: string;
    mode: string;
    status: string;
    createdAt: string;
    accessToken?: string;
  };
  success: boolean;
}

export const createFlow = async (
  data: CreateFlowRequest,
  accessToken?: string,
): Promise<CreateFlowResponse> => {
  const response = await apiClient.post<CreateFlowResponse>(
    '/flows',
    data,
    {
      headers: {
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
    },
  );

  console.log('[API] createFlow response:', response.data);

  return response.data;
};


// ==============================
// 2. Flow 저장 API
// ==============================

export type FlowSavePayload = {
  title: string;
  summary: string;
  purpose: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
  categoryIds: number[];
  visibility: 'PRIVATE' | 'PUBLIC' | string;
  status: 'COMPLETED' | 'DRAFT' | string;
  authorNote: string;
  exampleInput: string;
  exampleResult: string;

  blocks: Array<{
    blockId: number;
    blockOrder: number;
    options: Record<string, any>;
    promptTemplateId: number;
  }>;
};

export const saveFlow = async (
  flowId: number,
  payload: FlowSavePayload,
  accessToken?: string,
) => {
  const response = await apiClient.put(
    `/flows/${flowId}`,
    payload,
    {
      headers: {
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
    },
  );

  console.log('[API] saveFlow response:', response.data);

  return response.data;
};


// ==============================
// 3. Flow 미리보기 / 복사용 데이터 조회
// ==============================

export const FlowPreviewResponse = async (
  flowId: number,
  accessToken?: string,
) => {
  const response = await apiClient.get(
    `/flows/${flowId}/preview`,
    {
      headers: {
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
    },
  );

  console.log('[API] FlowPreviewResponse:', response.data);

  return response.data;
};