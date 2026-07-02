# 📘 LearningLM Frontend

> **AI를 단순 질문/답변 도구에서 실제 작업 흐름을 설계하는 도구로 확장하는 학습 플랫폼**

LearningLM은 초급 사용자가 생성형 AI를 단순히 “질문하면 답변을 받는 챗봇”으로만 사용하는 단계에서 벗어나, 실제 작업 목적에 맞는 AI 활용 흐름을 이해하고 직접 조합해 볼 수 있도록 돕는 학습 플랫폼입니다.

LearningLM은 실제 AI 자동화 실행 도구가 아니라, 사용자가 AI 활용 방식을 학습하고, 튜토리얼을 따라가며, 자신만의 워크플로우를 구성해 보는 프론트엔드 중심의 학습 서비스입니다.

<br/>

## 💡 Service Vision: "From Prompting to Workflow"

LearningLM은 AI 사용 경험이 부족한 초급 사용자가 프롬프트 입력에만 머무르지 않고, 목적에 맞는 AI 활용 흐름을 단계적으로 이해하도록 돕는 것을 목표로 합니다.

- **AI 활용 흐름 학습:** 단순 질문/답변을 넘어 작업 목적에 맞는 AI 사용 단계를 학습합니다.
- **튜토리얼 기반 이해:** 공식 튜토리얼을 통해 AI 활용 사례와 구성 방식을 익힙니다.
- **워크플로우 조합 경험:** Studio에서 직접 블록과 단계를 구성하며 AI 활용 구조를 체험합니다.
- **저장과 공유:** 완성한 워크플로우를 저장하고, 다른 사용자의 예시를 탐색할 수 있습니다.

<br/>

## 🛠️ Service Structure

LearningLM은 사용자가 AI 활용법을 배우고, 직접 구성하고, 저장하거나 공유하는 흐름을 중심으로 설계됩니다.

### 1. Home

- 서비스의 핵심 가치와 주요 기능을 소개합니다.
- 사용자가 튜토리얼, Studio, Public Library 등 주요 기능으로 진입할 수 있도록 안내합니다.

### 2. Official Tutorials

- 초급 사용자를 위한 공식 AI 활용 튜토리얼 목록을 제공합니다.
- 튜토리얼을 통해 AI를 활용하는 흐름과 각 단계의 의미를 학습합니다.

### 3. Tutorial Detail / Tutorial Start

- 선택한 튜토리얼의 목적, 구성 단계, 예상 결과를 확인합니다.
- 사용자는 안내에 따라 단계별로 AI 활용 흐름을 따라갈 수 있습니다.

### 4. Studio

- 사용자가 직접 AI 활용 워크플로우를 구성하는 핵심 작업 공간입니다.
- Guided Studio와 Create Studio로 구분하여, 초급자와 자유 제작 사용자를 모두 지원합니다.

### 5. Preview / Validation

- 사용자가 구성한 워크플로우의 흐름을 미리 확인합니다.
- 구성 단계가 논리적으로 이어지는지 검토하고, 예시 결과를 확인할 수 있습니다.

### 6. My Storage

- 사용자가 저장한 워크플로우를 관리합니다.
- 이전에 만든 흐름을 다시 확인하거나 수정할 수 있습니다.

### 7. Public Library

- 다른 사용자가 공유한 워크플로우를 탐색합니다.
- 다양한 AI 활용 사례를 참고하여 자신의 작업에 응용할 수 있습니다.

### 8. Auth

- 로그인과 회원가입 기능을 제공합니다.
- 저장, 공유, 개인 워크플로우 관리 기능과 연결됩니다.

<br/>

## ✨ Implementation Highlights

LearningLM 프론트엔드는 사용자가 AI 활용 흐름을 자연스럽게 이해할 수 있도록 화면 흐름, 상태 관리, 단계별 인터랙션에 집중합니다.

- **Learning Flow 중심 설계:** 튜토리얼 탐색부터 Studio 제작, Preview, 저장까지 이어지는 학습 흐름을 제공합니다.
- **State-Driven UI:** 사용자가 선택한 튜토리얼, 블록, 워크플로우 단계에 따라 화면 상태가 동적으로 변경됩니다.
- **Workflow Preview:** 사용자가 구성한 AI 활용 흐름을 미리 확인하고 검토할 수 있도록 설계합니다.
- **Reusable Components:** 버튼, 카드, 모달, 입력 폼 등 반복되는 UI를 공용 컴포넌트로 분리합니다.
- **Feature-based Architecture:** 기능 단위로 폴더를 분리하여 유지보수성과 협업 효율을 높입니다.

---

## 📔 LearningLM의 프론트엔드 저장소입니다.

React, TypeScript, Vite를 기반으로 하며, 유지보수성을 위해 기능 단위(Feature-based) 아키텍처를 따릅니다.

<br/>

## 🛠 Tech Stack

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Core** | React, TypeScript | UI 라이브러리 및 정적 타입 언어 |
| **Build** | Vite | 빌드 도구 및 개발 서버 |
| **State** | TanStack Query, Zustand | 서버 상태와 클라이언트 상태 관리 분리 |
| **Network** | Axios | HTTP 비동기 통신 |
| **Style** | Tailwind CSS | 유틸리티 기반 스타일링 |
| **Routing** | React Router DOM | SPA 라우팅 |
| **Icons** | lucide-react | 아이콘 라이브러리 |
| **Package Manager** | npm | 패키지 매니저 |
| **Quality** | ESLint, Prettier | 코드 품질 및 포맷팅 |
| **Deploy** | Vercel | 프론트엔드 배포 플랫폼 |

<br/>

## Getting Started

이 프로젝트는 Node.js v20 LTS 이상 환경을 권장합니다.

```bash
node -v
```

### 1. 프로젝트 클론

```bash
git clone https://github.com/UMCLearningLM/UMCLearningLM_FE.git
cd UMCLearningLM_FE
```

### 2. 패키지 설치

```bash
npm install
```

팀원들과 동일한 패키지 버전을 설치해야 하는 경우 아래 명령어를 사용할 수 있습니다.

```bash
npm ci
```

### 3. 환경 변수 설정

루트 디렉토리에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```txt
http://localhost:5173
```

### 5. 프로덕션 빌드 확인

```bash
npm run build
npm run preview
```

<br/>

## 📂 Project Structure

LearningLM은 기능 중심 아키텍처를 기반으로 합니다.  
화면, 컴포넌트, 훅, API 로직을 기능 단위로 모아 관리합니다.

```text
src/
├── assets/                  # 이미지, 아이콘, 폰트 등 정적 리소스
│
├── components/              # 전역 공용 UI 컴포넌트
│   ├── layout/              # Header, Footer, Sidebar, AppLayout
│   └── ui/                  # Button, Input, Modal, Card 등 원자 컴포넌트
│
├── api/                     # 기능별 API 요청 함수 및 타입
│   ├── auth/                # 로그인, 회원가입 API
│   ├── tutorial/            # 튜토리얼 관련 API
│   ├── workflow/            # 워크플로우 생성/저장/조회 API
│   └── library/             # Public Library 관련 API
│
├── features/                # 핵심 도메인별 기능 모음
│   ├── auth/                # 로그인, 회원가입
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── home/                # 홈 화면
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── tutorial/            # 공식 튜토리얼
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── studio/              # 워크플로우 제작 Studio
│   │   ├── components/
│   │   │   ├── blocks/      # 워크플로우 블록 UI
│   │   │   ├── editor/      # Studio 편집 영역
│   │   │   └── preview/     # Preview 관련 UI
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── storage/             # My Storage
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── library/             # Public Library
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── user/                # 사용자 정보, 마이페이지성 기능
│       ├── components/
│       ├── hooks/
│       └── utils/
│
├── pages/                   # 라우트 페이지, features 조립
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── home/
│   │   └── HomePage.tsx
│   ├── tutorial/
│   │   ├── TutorialListPage.tsx
│   │   ├── TutorialDetailPage.tsx
│   │   └── TutorialStartPage.tsx
│   ├── studio/
│   │   ├── StudioPage.tsx
│   │   ├── GuidedStudioPage.tsx
│   │   └── CreateStudioPage.tsx
│   ├── storage/
│   │   ├── MyStoragePage.tsx
│   │   └── WorkflowDetailPage.tsx
│   └── library/
│       ├── PublicLibraryPage.tsx
│       └── LibraryDetailPage.tsx
│
├── routes/                  # 라우터 설정
│   └── router.tsx
│
├── services/                # Axios 인스턴스, API 공통 설정
│   └── axiosInstance.ts
│
├── store/                   # Zustand 전역 상태
│   ├── authStore.ts
│   └── workflowStore.ts
│
├── types/                   # 전역 타입 정의
│   ├── auth.ts
│   ├── tutorial.ts
│   └── workflow.ts
│
├── utils/                   # 공용 유틸 함수
│
├── App.tsx
├── main.tsx
└── index.css
```

### 개발 원칙

1. **Colocation:** 특정 기능에서만 쓰이는 컴포넌트는 `features/기능명/components` 안에 둡니다.
2. **Barrel Exports:** `index.ts`를 활용하여 import 경로를 깔끔하게 유지합니다.
3. **Absolute Import:** `../../` 대신 `@/features/user` 와 같이 절대 경로(`@`)를 사용합니다.
4. **Feature First:** 페이지는 조립만 담당하고, 실제 UI와 로직은 `features` 내부에서 관리합니다.

<br/>

## 🧭 Screen List & Flow

### 주요 화면 목록

| 구분 | 화면 | 설명 |
| :--- | :--- | :--- |
| Home | Home | 서비스 소개 및 주요 기능 진입 |
| Tutorial | Official Tutorials | 공식 튜토리얼 목록 |
| Tutorial | Tutorial Detail | 튜토리얼 상세 정보 |
| Tutorial | Tutorial Start | 튜토리얼 단계별 진행 |
| Studio | Studio | 워크플로우 제작 메인 화면 |
| Studio | Guided Studio | 안내 기반 워크플로우 제작 |
| Studio | Create Studio | 자유 제작 워크플로우 편집 |
| Studio | Preview | 제작한 흐름 미리보기 |
| Storage | My Storage | 내가 저장한 워크플로우 목록 |
| Storage | Workflow Detail | 저장된 워크플로우 상세 |
| Library | Public Library | 공개 워크플로우 탐색 |
| Library | Library Detail | 공개 워크플로우 상세 |
| Auth | Login | 로그인 |
| Auth | Signup | 회원가입 |

### 기본 사용자 흐름

```text
Home
 ├── Official Tutorials
 │    └── Tutorial Detail
 │         └── Tutorial Start
 │              └── Studio / Guided Studio
 │                   └── Preview
 │                        └── My Storage
 │
 ├── Create Studio
 │    └── Preview
 │         └── My Storage
 │
 └── Public Library
      └── Library Detail
           └── Studio
```

<br/>

## 🌿 Branch Strategy

### 기본 브랜치

- `main`: 배포 가능한 안정 버전
- `dev`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치

### 브랜치 명명 규칙

```txt
타입/기능명_작성자
```

| 타입 | 설명 | 예시 |
| :--- | :--- | :--- |
| feat | 새로운 기능 추가 | feat/login_seongmin |
| fix | 버그 수정 | fix/studio-preview_seongmin |
| design | 스타일 및 UI 수정 | design/home-layout_seongmin |
| refactor | 코드 구조 개선 | refactor/workflow-store_seongmin |
| docs | 문서 수정 | docs/readme_seongmin |

<br/>

## Commit Convention

커밋 메시지는 Conventional Commits 규칙을 따릅니다.

```txt
feat: 로그인 페이지 구현
fix: Studio Preview 렌더링 오류 수정
design: Home CTA 버튼 스타일 수정
refactor: workflow store 구조 분리
docs: README 작성
```

<br/>

## Code Quality

PR을 올리기 전 아래 명령어를 실행하여 타입 오류와 린트 오류를 확인합니다.

```bash
npm run type-check
npm run lint
```

한 번에 실행할 수도 있습니다.

```bash
npm run type-check && npm run lint
```

<br/>

## Deployment

LearningLM 프론트엔드는 Vercel을 통해 배포합니다.

- `main` 브랜치 기준으로 프로덕션 배포를 진행합니다.
- Pull Request 또는 개발 브랜치는 필요에 따라 Preview Deployment를 사용할 수 있습니다.

<br/>

## Troubleshooting

### Q. `npm install` 시 에러가 발생해요.

Node.js 버전을 확인하세요.

```bash
node -v
```

Node.js v20 이상 사용을 권장합니다.

### Q. `@/` import 경로가 인식되지 않아요.

VS Code에서 TypeScript 서버를 재시작합니다.

```txt
Ctrl + Shift + P → TypeScript: Restart TS server
```

### Q. 개발 서버가 실행되지 않아요.

패키지 설치 여부와 `.env` 파일이 존재하는지 확인하세요.

```bash
npm install
npm run dev
```

---

## 문의

문의사항은 팀 Discord 또는 Notion에 공유된 프론트엔드 채널을 이용해 주세요.
