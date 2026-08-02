import type { StudioStage } from '../types/studioNode'

import type {
  StudioBlockDefinition,
  StudioBlockRequirement,
} from '../types/studioBlock'

/**
 * Studio 단계 표시 순서입니다.
 *
 * 팔레트 분류, 테스트 페이지, 검증 결과 정렬에서
 * 동일한 순서를 사용하기 위한 상수입니다.
 */
export const STUDIO_STAGE_ORDER: readonly StudioStage[] = [
  'INPUT',
  'CONTEXT',
  'PROCESS',
  'REVIEW',
  'OUTPUT',
]

/**
 * Studio 단계별 한글 이름입니다.
 */
export const studioStageLabelMap: Record<
  StudioStage,
  string
> = {
  INPUT: '입력',
  CONTEXT: '컨텍스트',
  PROCESS: '프로세스',
  REVIEW: '검토',
  OUTPUT: '결과',
}

/**
 * Studio 팔레트에서 사용하는 전체 블록 Catalog입니다.
 *
 * 블록 ID는 다음 규칙을 따릅니다.
 *
 * stage-기능명
 *
 * 예:
 * input-text
 * context-role
 * process-summary
 */
export const studioBlockCatalog = [
  /*
   * INPUT
   */
  {
    id: 'input-text',
    stage: 'INPUT',
    order: 1,
    title: '텍스트 입력',
    description: '문서·원문 요청을 입력받습니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'input-required-document',
    stage: 'INPUT',
    order: 2,
    title: '필요한 문서 확인하기',
    description: '어떤 자료가 필요한지 고릅니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'input-required-skill',
    stage: 'INPUT',
    order: 3,
    title: '필요한 스킬 확인하기',
    description: '요약·분류·작성 등 작업 유형을 선택합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'input-file-upload',
    stage: 'INPUT',
    order: 4,
    title: '파일 업로드 받기',
    description: '문서·이미지 파일을 업로드합니다.',
    requirement: 'recommended',
    availability: 'available',
  },

  /*
   * CONTEXT
   */
  {
    id: 'context-project-document',
    stage: 'CONTEXT',
    order: 1,
    title: '프로젝트 문서 불러오기',
    description: '저장된 프로젝트 문서를 참고합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'context-role',
    stage: 'CONTEXT',
    order: 2,
    title: '역할 부여하기',
    description: '기획자·리뷰어 등 AI의 역할을 지정합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'context-constraints',
    stage: 'CONTEXT',
    order: 3,
    title: '제약조건 입력하기',
    description: '분량·톤·금지사항 등의 조건을 설정합니다.',
    requirement: 'recommended',
    availability: 'available',
  },
  {
    id: 'context-glossary',
    stage: 'CONTEXT',
    order: 4,
    title: '용어 사전 제공하기',
    description: '고유 용어와 약어의 정의를 제공합니다.',
    requirement: 'optional',
    availability: 'coming-soon',
  },

  /*
   * PROCESS
   */
  {
    id: 'process-extract-core',
    stage: 'PROCESS',
    order: 1,
    title: '핵심 내용 추출하기',
    description: '입력된 자료에서 중요한 내용을 추출합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'process-summary',
    stage: 'PROCESS',
    order: 2,
    title: '요약 생성',
    description: '내용을 짧게 또는 자세하게 요약합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'process-table',
    stage: 'PROCESS',
    order: 3,
    title: '표로 재구성하기',
    description: '내용을 행과 열로 구성된 표 형식으로 변환합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'process-prompt-compose',
    stage: 'PROCESS',
    order: 4,
    title: '프롬프트 조립하기',
    description: '역할·작업·출력 조건을 하나의 프롬프트로 구성합니다.',
    requirement: 'required',
    availability: 'available',
  },

  /*
   * REVIEW
   */
  {
    id: 'review-quality',
    stage: 'REVIEW',
    order: 1,
    title: '품질 검토',
    description: '출력 형식과 품질 기준을 점검합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'review-condition',
    stage: 'REVIEW',
    order: 2,
    title: '조건 충족 확인하기',
    description: '지정한 조건을 만족했는지 확인합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'review-error-location',
    stage: 'REVIEW',
    order: 3,
    title: '오류 위치 표시하기',
    description: '검증에 실패한 위치와 원인을 표시합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'review-missing',
    stage: 'REVIEW',
    order: 4,
    title: '누락 확인하기',
    description: '출력 결과에서 빠진 항목이 있는지 점검합니다.',
    requirement: 'recommended',
    availability: 'available',
  },

  /*
   * OUTPUT
   */
  {
    id: 'output-text',
    stage: 'OUTPUT',
    order: 1,
    title: '텍스트로 출력하기',
    description: '일반 답변 형태의 텍스트로 출력합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'output-table',
    stage: 'OUTPUT',
    order: 2,
    title: '표로 출력하기',
    description: '결과를 행과 열로 구성된 표 형식으로 출력합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'output-prompt',
    stage: 'OUTPUT',
    order: 3,
    title: '프롬프트로 출력하기',
    description: '다시 사용할 수 있는 프롬프트 형태로 출력합니다.',
    requirement: 'required',
    availability: 'available',
  },
  {
    id: 'output-save-storage',
    stage: 'OUTPUT',
    order: 4,
    title: '내 저장소에 저장하기',
    description: '완성된 결과와 워크플로우를 내 저장소에 저장합니다.',
    requirement: 'required',
    availability: 'available',
  },
] as const satisfies readonly StudioBlockDefinition[]

/**
 * Catalog에서 자동으로 추론한 블록 ID 타입입니다.
 *
 * 오타가 있는 임의 문자열 대신 Catalog에 실제 존재하는 ID만
 * 사용할 수 있도록 만드는 타입입니다.
 */
export type StudioBlockId =
  (typeof studioBlockCatalog)[number]['id']

/**
 * ID를 이용해 블록 정의를 찾습니다.
 */
export function getStudioBlockDefinition(
  blockId: string,
): StudioBlockDefinition | undefined {
  return studioBlockCatalog.find(
    (block) => block.id === blockId,
  )
}

/**
 * 특정 Stage에 속하는 블록만 반환합니다.
 *
 * order 값을 기준으로 정렬된 새 배열을 반환합니다.
 */
export function getStudioBlocksByStage(
  stage: StudioStage,
): StudioBlockDefinition[] {
  return studioBlockCatalog
    .filter((block) => block.stage === stage)
    .slice()
    .sort(
      (firstBlock, secondBlock) =>
        firstBlock.order - secondBlock.order,
    )
}

/**
 * 현재 사용할 수 있는 블록만 반환합니다.
 *
 * availability가 coming-soon인 블록은 제외합니다.
 */
export function getAvailableStudioBlocks(): StudioBlockDefinition[] {
  return studioBlockCatalog.filter(
    (block) =>
      block.availability === 'available',
  )
}

/**
 * 필수 블록만 반환합니다.
 *
 * 이후 필수 블록 검증 로직에서 사용합니다.
 */
export function getRequiredStudioBlocks(): StudioBlockDefinition[] {
  return studioBlockCatalog.filter(
    (block) =>
      block.requirement === 'required' &&
      block.availability === 'available',
  )
}

/**
 * 특정 Stage의 필수 블록만 반환합니다.
 */
export function getRequiredStudioBlocksByStage(
  stage: StudioStage,
): StudioBlockDefinition[] {
  return studioBlockCatalog.filter(
    (block) =>
      block.stage === stage &&
      block.requirement === 'required' &&
      block.availability === 'available',
  )
}

/**
 * 필수도별 블록 목록을 반환합니다.
 */
export function getStudioBlocksByRequirement(
  requirement: StudioBlockRequirement,
): StudioBlockDefinition[] {
  return studioBlockCatalog.filter(
    (block) =>
      block.requirement === requirement,
  )
}

/**
 * 전달받은 문자열이 실제 Catalog에 존재하는 블록 ID인지 확인합니다.
 */
export function isStudioBlockId(
  blockId: string,
): blockId is StudioBlockId {
  return studioBlockCatalog.some(
    (block) => block.id === blockId,
  )
}