export type TutorialLevel = '입문' | '기초' | '응용'

export type TutorialCategory =
  | '커뮤니티'
  | '자료조사'
  | '튜토리얼'
  | '문서요약'
  | '요약'
  | '글쓰기'
  | '결과물 검토'
  | 'AI 툴 활용'
  | '반복 작업 정리'

export interface TutorialUseCase {
  label: string
  description: string
}

export interface TutorialFlowStep {
  id: string
  label: string
  color: 'blue' | 'teal' | 'green'
}

export interface TutorialBlock {
  id: string
  title: string
  type: string
  description: string
  why: string
  color: 'blue' | 'teal' | 'green'
}

export interface Tutorial {
  id: number
  title: string
  description: string
  level: TutorialLevel
  categories: TutorialCategory[]
  blockCount: number
  estimatedMinutes: number
  useCases: TutorialUseCase[]
  requiredConcepts: string[]
  flowSteps: TutorialFlowStep[]
  blocks: TutorialBlock[]
  exampleInput: string
  exampleResult: string[]
  resultSource: 'AI' | 'Template'
}

export const tutorialLevels: TutorialLevel[] = ['입문', '기초', '응용']

export const tutorialCategories: TutorialCategory[] = [
  '커뮤니티',
  '자료조사',
  '튜토리얼',
  '문서요약',
  '요약',
  '글쓰기',
  '결과물 검토',
  'AI 툴 활용',
  '반복 작업 정리',
]

const baseTutorials: Tutorial[] = [
  {
    id: 1,

    title:
      'AI로 자료조사 흐름 만들기',

    description:
      '조사 주제 설정부터 핵심 추출, 근거 확인, 결과 출력까지 5단계 흐름을 직접 만들어봅니다.',

    level:
      '입문',

    categories: [
      '자료조사',
      '요약',
    ],

    blockCount:
      5,

    estimatedMinutes:
      15,

    useCases: [
      {
        label:
          '업무',

        description:
          '시장·제품·정책 등 필요한 주제를 조사하고 핵심 정보를 정리하고 싶을 때.',
      },
      {
        label:
          '학습',

        description:
          '과제나 발표를 위해 자료의 핵심과 근거를 단계적으로 정리하고 싶을 때.',
      },
    ],

    requiredConcepts: [
      '블록 배치',
      '노드 연결',
      'Inspector 설정',
    ],

    flowSteps: [
      {
        id:
          'input',

        label:
          '주제 입력',

        color:
          'blue',
      },
      {
        id:
          'context',

        label:
          '참고 자료',

        color:
          'teal',
      },
      {
        id:
          'process',

        label:
          '핵심 추출',

        color:
          'green',
      },
      {
        id:
          'review',

        label:
          '근거 확인',

        color:
          'teal',
      },
      {
        id:
          'output',

        label:
          '결과 출력',

        color:
          'green',
      },
    ],

    blocks: [
      {
        id:
          'input-topic',

        title:
          '주제 입력하기',

        type:
          'INPUT',

        description:
          '조사할 주제와 핵심 키워드를 입력합니다.',

        why:
          '조사의 범위와 방향을 먼저 정하기 위해 필요합니다.',

        color:
          'blue',
      },
      {
        id:
          'context-direct-input',

        title:
          '직접 입력 내용 사용하기',

        type:
          'CONTEXT',

        description:
          '조사에 참고할 배경 정보나 알고 있는 사실을 추가합니다.',

        why:
          'AI가 조사 내용을 해석할 때 사용할 기준 정보를 제공합니다.',

        color:
          'teal',
      },
      {
        id:
          'process-extract-core',

        title:
          '핵심 내용 추출하기',

        type:
          'PROCESS',

        description:
          '자료에서 사실과 키워드 등 필요한 핵심 정보를 추출합니다.',

        why:
          '많은 정보 가운데 실제로 필요한 내용만 남기기 위해 사용합니다.',

        color:
          'green',
      },
      {
        id:
          'review-evidence',

        title:
          '근거 확인하기',

        type:
          'REVIEW',

        description:
          '정리된 사실과 수치에 확인 가능한 근거가 있는지 점검합니다.',

        why:
          '자료조사 결과의 신뢰도를 높이기 위해 필요합니다.',

        color:
          'teal',
      },
      {
        id:
          'output-text',

        title:
          '텍스트로 출력하기',

        type:
          'OUTPUT',

        description:
          '검토를 마친 조사 결과를 읽기 쉬운 텍스트로 출력합니다.',

        why:
          '완성된 조사 내용을 실제로 활용할 수 있는 결과물로 만듭니다.',

        color:
          'green',
      },
    ],

    exampleInput:
      '국내 생성형 AI 서비스 시장 동향을 조사하고 핵심 내용을 정리해줘',

    exampleResult: [
      '생성형 AI 서비스는 문서 작성, 검색, 개발 지원, 고객 응대 등 다양한 업무 영역으로 확장되고 있습니다.',
      '서비스를 비교할 때는 모델 성능뿐 아니라 출처 확인, 데이터 보안, 업무 도구 연동 여부가 중요한 기준이 됩니다.',
      '조사 결과를 활용할 때는 사실과 추정 내용을 구분하고 핵심 주장에 대한 근거를 함께 확인하는 과정이 필요합니다.',
    ],

    resultSource:
      'Template',
  },
  {
    id: 2,
    title: '회의록 자동 요약 워크플로우',
    description: '긴 회의록을 핵심 항목으로 정리하는 흐름.',
    level: '기초',
    categories: ['문서요약'],
    blockCount: 5,
    estimatedMinutes: 20,
    useCases: [
      {
        label: '업무',
        description: '긴 회의 내용을 결정사항, 액션 아이템, 이슈로 빠르게 정리할 때.',
      },
      {
        label: '공유',
        description: '회의에 참석하지 않은 팀원에게 핵심만 전달해야 할 때.',
      },
    ],
    requiredConcepts: ['회의록 구조', '액션 아이템 추출', '결정사항 분리'],
    flowSteps: [
      { id: 'input', label: '회의록 입력', color: 'blue' },
      { id: 'extract', label: '핵심 추출', color: 'green' },
      { id: 'action', label: '할 일 분리', color: 'teal' },
      { id: 'output', label: '요약 출력', color: 'green' },
    ],
    blocks: [
      {
        id: 'input',
        title: '회의록 입력',
        type: '입력',
        description: '요약할 회의록을 붙여넣습니다',
        why: '분석할 원문이 필요해요',
        color: 'blue',
      },
      {
        id: 'extract',
        title: '핵심 추출',
        type: '정리',
        description: '주요 논의 내용을 뽑습니다',
        why: '긴 내용을 줄이기 위해 필요해요',
        color: 'green',
      },
      {
        id: 'action',
        title: '할 일 분리',
        type: '정리',
        description: '담당자와 마감일을 분리합니다',
        why: '실행 가능한 형태로 바꾸기 위해 필요해요',
        color: 'teal',
      },
      {
        id: 'output',
        title: '요약 출력',
        type: '출력',
        description: '정리된 회의 요약을 보여줍니다',
        why: '공유 가능한 결과물이 필요해요',
        color: 'green',
      },
    ],
    exampleInput: '아래 회의록을 결정사항과 할 일 중심으로 요약해줘',
    exampleResult: [
      '결정사항: 다음 스프린트에서는 튜토리얼 상세 페이지를 우선 구현합니다.',
      '액션 아이템: FE는 화면 초안을 작성하고, BE는 verify 응답 스키마를 정리합니다.',
      '이슈: 저장 전 미리보기 API 구조를 추가로 합의해야 합니다.',
    ],
    resultSource: 'Template',
  },
  {
    id: 3,
    title: '블로그 초안 작성 흐름',
    description: '주제 입력부터 초안 생성·검토까지',
    level: '기초',
    categories: ['글쓰기'],
    blockCount: 6,
    estimatedMinutes: 25,
    useCases: [
      {
        label: '콘텐츠',
        description: '초안 작성 전 글의 구조와 문단 흐름을 먼저 잡고 싶을 때.',
      },
      {
        label: '마케팅',
        description: '제품이나 기능 소개 글의 초안을 빠르게 만들고 싶을 때.',
      },
    ],
    requiredConcepts: ['독자 설정', '글 구조 설계', '톤앤매너 조정'],
    flowSteps: [
      { id: 'topic', label: '주제 입력', color: 'blue' },
      { id: 'outline', label: '목차 구성', color: 'teal' },
      { id: 'draft', label: '초안 생성', color: 'green' },
      { id: 'review', label: '검토', color: 'teal' },
    ],
    blocks: [
      {
        id: 'topic',
        title: '주제 입력',
        type: '입력',
        description: '작성할 글의 주제를 입력합니다',
        why: '글의 방향을 정하기 위해 필요해요',
        color: 'blue',
      },
      {
        id: 'outline',
        title: '목차 구성',
        type: '정리',
        description: '글의 목차를 만듭니다',
        why: '내용 흐름을 잡기 위해 필요해요',
        color: 'teal',
      },
      {
        id: 'draft',
        title: '초안 생성',
        type: '생성',
        description: '목차에 맞춰 초안을 작성합니다',
        why: '작성 시간을 줄이기 위해 필요해요',
        color: 'green',
      },
      {
        id: 'review',
        title: '문장 검토',
        type: '검토',
        description: '문장과 흐름을 다듬습니다',
        why: '읽기 좋은 결과를 만들기 위해 필요해요',
        color: 'teal',
      },
    ],
    exampleInput: '초급자를 위한 AI 활용법 블로그 글 초안을 작성해줘',
    exampleResult: [
      'AI를 잘 활용하려면 먼저 원하는 결과물을 분명히 정의해야 합니다.',
      '작업은 입력, 처리, 검토, 출력 단계로 나누어 생각할 수 있습니다.',
      'LearningLM은 이 흐름을 블록으로 쌓아보며 익히는 학습 방식을 제공합니다.',
    ],
    resultSource: 'Template',
  },
  {
    id: 4,
    title: '반복 업무 체크리스트 자동화',
    description: '주간 반복 작업을 정리해 추적',
    level: '기초',
    categories: ['반복 작업 정리'],
    blockCount: 5,
    estimatedMinutes: 25,
    useCases: [
      {
        label: '업무',
        description: '매주 반복되는 업무를 빠뜨리지 않도록 체크리스트로 만들 때.',
      },
      {
        label: '관리',
        description: '팀 공통 루틴을 정리하고 진행 상황을 점검할 때.',
      },
    ],
    requiredConcepts: ['반복 주기', '완료 기준', '우선순위'],
    flowSteps: [
      { id: 'routine', label: '루틴 입력', color: 'blue' },
      { id: 'split', label: '작업 분리', color: 'teal' },
      { id: 'check', label: '체크리스트', color: 'green' },
      { id: 'track', label: '추적 출력', color: 'teal' },
    ],
    blocks: [
      {
        id: 'routine',
        title: '루틴 입력',
        type: '입력',
        description: '반복 업무 내용을 입력합니다',
        why: '자동화할 업무 범위를 정하기 위해 필요해요',
        color: 'blue',
      },
      {
        id: 'split',
        title: '작업 분리',
        type: '정리',
        description: '업무를 작은 단위로 나눕니다',
        why: '실행 가능한 체크 항목이 필요해요',
        color: 'teal',
      },
      {
        id: 'check',
        title: '체크리스트 생성',
        type: '생성',
        description: '반복 가능한 체크리스트를 만듭니다',
        why: '누락을 줄이기 위해 필요해요',
        color: 'green',
      },
      {
        id: 'track',
        title: '추적 출력',
        type: '출력',
        description: '진행 상태를 확인할 수 있게 표시합니다',
        why: '반복 업무의 흐름을 보기 위해 필요해요',
        color: 'teal',
      },
    ],
    exampleInput: '매주 월요일 해야 하는 운영 업무를 체크리스트로 정리해줘',
    exampleResult: [
      '공지 확인 및 미처리 문의 분류',
      '지난주 진행 상황 점검 및 담당자별 후속 작업 확인',
      '이번 주 주요 일정과 마감 업무를 체크리스트로 정리',
    ],
    resultSource: 'Template',
  },
  {
    id: 5,
    title: '결과물 검토 루브릭 만들기',
    description: '산출물 품질을 기준에 따라 점검',
    level: '기초',
    categories: ['결과물 검토'],
    blockCount: 4,
    estimatedMinutes: 18,
    useCases: [
      {
        label: '검토',
        description: '보고서, 발표자료, 기획안의 품질 기준을 미리 정하고 싶을 때.',
      },
      {
        label: '학습',
        description: '과제 결과물을 스스로 점검할 수 있는 기준표가 필요할 때.',
      },
    ],
    requiredConcepts: ['평가 기준', '가중치', '피드백 형식'],
    flowSteps: [
      { id: 'target', label: '대상 입력', color: 'blue' },
      { id: 'criteria', label: '기준 생성', color: 'green' },
      { id: 'rubric', label: '루브릭 구성', color: 'teal' },
      { id: 'feedback', label: '검토 출력', color: 'green' },
    ],
    blocks: [
      {
        id: 'target',
        title: '검토 대상 입력',
        type: '입력',
        description: '검토할 결과물 종류를 입력합니다',
        why: '평가 기준을 맞추기 위해 필요해요',
        color: 'blue',
      },
      {
        id: 'criteria',
        title: '평가 기준 생성',
        type: '생성',
        description: '핵심 평가 기준을 만듭니다',
        why: '검토의 기준점이 필요해요',
        color: 'green',
      },
      {
        id: 'rubric',
        title: '루브릭 구성',
        type: '정리',
        description: '기준을 표 형태로 정리합니다',
        why: '일관된 평가를 위해 필요해요',
        color: 'teal',
      },
      {
        id: 'feedback',
        title: '피드백 출력',
        type: '출력',
        description: '검토 결과와 개선점을 보여줍니다',
        why: '수정 방향을 확인하기 위해 필요해요',
        color: 'green',
      },
    ],
    exampleInput: '기획안 검토용 루브릭을 만들어줘',
    exampleResult: [
      '문제 정의: 해결하려는 문제가 명확한가',
      '사용자 흐름: 사용자가 목표까지 도달하는 과정이 자연스러운가',
      '실현 가능성: 현재 일정과 리소스로 구현 가능한가',
    ],
    resultSource: 'Template',
  },
  {
    id: 6,
    title: 'AI 툴 비교 정리표',
    description: '여러 AI 도구의 특징을 표로 비교',
    level: '기초',
    categories: ['AI 툴 활용'],
    blockCount: 4,
    estimatedMinutes: 14,
    useCases: [
      {
        label: '조사',
        description: '여러 AI 도구의 기능과 장단점을 한눈에 비교하고 싶을 때.',
      },
      {
        label: '선정',
        description: '작업 목적에 맞는 AI 도구를 고르기 위한 기준이 필요할 때.',
      },
    ],
    requiredConcepts: ['비교 항목', '장단점', '사용 목적'],
    flowSteps: [
      { id: 'tools', label: '도구 입력', color: 'blue' },
      { id: 'criteria', label: '비교 기준', color: 'teal' },
      { id: 'table', label: '표 정리', color: 'green' },
      { id: 'recommend', label: '추천 출력', color: 'teal' },
    ],
    blocks: [
      {
        id: 'tools',
        title: '도구 입력',
        type: '입력',
        description: '비교할 AI 도구를 입력합니다',
        why: '비교 대상을 정하기 위해 필요해요',
        color: 'blue',
      },
      {
        id: 'criteria',
        title: '비교 기준 설정',
        type: '정리',
        description: '기능, 비용, 난이도 등 기준을 정합니다',
        why: '공정한 비교를 위해 필요해요',
        color: 'teal',
      },
      {
        id: 'table',
        title: '표 정리',
        type: '정리',
        description: '도구별 특징을 표로 정리합니다',
        why: '한눈에 비교하기 위해 필요해요',
        color: 'green',
      },
      {
        id: 'recommend',
        title: '추천 출력',
        type: '출력',
        description: '목적별 추천 결과를 보여줍니다',
        why: '선택을 돕기 위해 필요해요',
        color: 'teal',
      },
    ],
    exampleInput: '문서 요약에 쓸 AI 도구 3개를 비교해줘',
    exampleResult: [
      '도구 A: 긴 문서 요약에 강하지만 세부 설정이 복잡합니다.',
      '도구 B: 사용이 쉽고 빠르지만 고급 비교 기능은 제한적입니다.',
      '도구 C: 팀 협업 기능이 좋아 조직 단위 사용에 적합합니다.',
    ],
    resultSource: 'Template',
  },
]

const mockPageSuffixes = ['실습', '응용', '확장']

export const tutorials: Tutorial[] = [
  ...baseTutorials,
  ...mockPageSuffixes.flatMap((suffix, suffixIndex) =>
    baseTutorials.map((tutorial, tutorialIndex) => ({
      ...tutorial,
      id: baseTutorials.length * (suffixIndex + 1) + tutorialIndex + 1,
      title: `${tutorial.title} ${suffix}`,
      description: `${tutorial.description} ${suffix} 버전입니다.`,
    })),
  ),
]

export function getTutorialById(id: number) {
  return tutorials.find((tutorial) => tutorial.id === id)
}
