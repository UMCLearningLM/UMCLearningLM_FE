import { Navigate, createBrowserRouter } from 'react-router-dom'

import { HomePage } from '../pages/home/HomePage'

import { OfficialTutorialPage } from '../pages/tutorial/OfficialTutorialPage'
import { TutorialDetailPage } from '../pages/tutorial/TutorialDetailPage'

import MyStoragePage from '../pages/storage/MyStoragePage'
import WorkflowDetailPage from '../pages/storage/WorkflowDetailPage'

import { PublicLibraryPage } from '../pages/library/PublicLibraryPage'
import LibraryDetailPage from '../pages/library/LibraryDetailPage'

import LoginPage from '../pages/auth/Login'
import GoogleLogin from '../pages/auth/GoogleLogin'
import GoogleLoginSuccess from '../pages/auth/GoogleLoginSuccess'
import GoogleLoginError from '../pages/auth/GoogleLoginError'

import { Login as EmailLoginPage } from '../pages/Login'
import { Register } from '../pages/Register'
import { PwFind } from '../pages/PwFind'

import { Stdio_create1 } from '../pages/Stdio_create1'

import { CommonComponentTestPage } from '../pages/dev/CommonComponentTestPage'
import { StudioNodeCardTestPage } from '../pages/dev/StudioNodeCardTestPage'

export const router = createBrowserRouter([
  /*
   * 홈
   */
  {
    path: '/',
    element: <HomePage />,
  },

  /*
   * 기존 코드에서 /home으로 이동하는 경우를 위한 호환 경로
   */
  {
    path: '/home',
    element: <Navigate to="/" replace />,
  },

  /*
   * 공식 튜토리얼
   */
  {
    path: '/official-tutorials',
    element: <OfficialTutorialPage />,
  },
  {
    path: '/official-tutorials/:tutorialId',
    element: <TutorialDetailPage />,
  },

  /*
   * Studio
   *
   * 현재 별도의 생성·편집 페이지가 없으므로
   * Stdio_create1을 공통 Studio 화면으로 사용합니다.
   */
  {
    path: '/studio',
    element: <Stdio_create1 />,
  },
  {
    path: '/studio/:workflowId/edit',
    element: <Stdio_create1 />,
  },

  /*
   * 내 저장소
   */
  {
    path: '/my-storage',
    element: <MyStoragePage />,
  },
  {
    path: '/my-storage/workflows/:workflowId',
    element: <WorkflowDetailPage />,
  },

  /*
   * Preview 전용 페이지가 완성되기 전까지
   * WorkflowDetailPage를 임시 Preview 화면으로 사용합니다.
   */
  {
    path: '/workflows/:workflowId/preview',
    element: <WorkflowDetailPage />,
  },

  /*
   * 공개 라이브러리
   */
  {
    path: '/public-library',
    element: <PublicLibraryPage />,
  },
  {
    path: '/public-library/:libraryId',
    element: <LibraryDetailPage />,
  },

  /*
   * 인증
   *
   * /login은 현재 Google OAuth 로그인 화면을 사용합니다.
   * 기존 이메일 로그인 시안은 /login/email에서 확인할 수 있습니다.
   */
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/login/email',
    element: <EmailLoginPage />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/pw-find',
    element: <PwFind />,
  },

  /*
   * Google OAuth 상태 화면
   *
   * 백엔드 Redirect URI와 최종 경로가 확정되면
   * 아래 경로를 백엔드 설정과 동일하게 맞춰야 합니다.
   */
  {
    path: '/auth/google/loading',
    element: <GoogleLogin />,
  },
  {
    path: '/auth/google/success',
    element: <GoogleLoginSuccess />,
  },
  {
    path: '/auth/google/error',
    element: <GoogleLoginError />,
  },

  /*
   * 개발용 테스트 페이지
   */
  {
    path: '/dev/components',
    element: <CommonComponentTestPage />,
  },
  {
    path: '/dev/studio-nodes',
    element: <StudioNodeCardTestPage />,
  },

  /*
   * 등록되지 않은 주소
   */
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])