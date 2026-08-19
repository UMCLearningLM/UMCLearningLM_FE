import {
  Navigate,
  createBrowserRouter,
} from 'react-router-dom'

import {
  ProtectedRoute,
} from './ProtectedRoute'

import {
  HomePage,
} from '../pages/home/HomePage'
import {
  PublicLibraryPage,
} from '../pages/library/PublicLibraryPage'
import LibraryDetailPage from '../pages/library/LibraryDetailPage'
import MyStoragePage from '../pages/storage/MyStoragePage'
import WorkflowDetailPage from '../pages/storage/WorkflowDetailPage'

import {
  Stdio_create1,
} from '../pages/Stdio_create1'
import {
  Studio_create_review1,
} from '../pages/Studio_create_review1'
import {
  Studio_create_review_details1,
} from '../pages/Studio_create_review_details1'
import {
  Studio_create_review_publish1,
} from '../pages/Studio_create_review_publish1'
import {
  Studio1,
} from '../pages/Studio1'

import {
  OfficialTutorialPage,
} from '../pages/tutorial/OfficialTutorialPage'
import {
  TutorialDetailPage,
} from '../pages/tutorial/TutorialDetailPage'

import {
  StudioNodeCardTestPage,
} from '../pages/dev/StudioNodeCardTestPage'
import {
  ProcessTestPage,
} from '../pages/dev/ProcessTestPage'

import {
  Login,
} from '../pages/Login'
import {
  Register,
} from '../pages/Register'
import {
  PwFind,
} from '../pages/PwFind'

import GoogleLoginLoading from '../pages/auth/GoogleLogin'
import GoogleLoginSuccess from '../pages/auth/GoogleLoginSuccess'
import GoogleLoginError from '../pages/auth/GoogleLoginError'
import { SessionCheck } from '../pages/auth/SessionCheck'
import { MyProfile } from '../pages/auth/MyProfile'

import {
  LegalPage,
} from '../pages/legal/LegalPage'

export const router =
  createBrowserRouter([
    /**
     * 공개 페이지
     */
    {
      path:
        '/',
      element:
        <HomePage />,
    },

    {
      path:
        '/home',
      element: (
        <Navigate
          to="/"
          replace
        />
      ),
    },

    /**
     * 인증
     */
    {
      path:
        '/login',
      element:
        <Login />,
    },

    {
      path:
        '/register',
      element:
        <Register />,
    },

    {
      path:
        '/signup',
      element: (
        <Navigate
          to="/register"
          replace
        />
      ),
    },

    {
      path:
        '/pw-find',
      element:
        <PwFind />,
    },

    {
      path:
        '/password-find',
      element: (
        <Navigate
          to="/pw-find"
          replace
        />
      ),
    },

    /**
     * 약관 / 개인정보
     *
     * 로그인하지 않아도 조회할 수 있어야 합니다.
     */
    {
      path:
        '/terms',
      element: (
        <LegalPage
          type="terms"
        />
      ),
    },

    {
      path:
        '/privacy',
      element: (
        <LegalPage
          type="privacy"
        />
      ),
    },

    /**
     * Google OAuth
     */
    {
      path:
        '/auth/google/loading',
      element:
        <GoogleLoginLoading />,
    },

    {
      path:
        '/auth/google/success',
      element:
        <GoogleLoginSuccess />,
    },

    {
      path:
        '/auth/google/error',
      element:
        <GoogleLoginError />,
    },

    /**
     * 공식 튜토리얼
     *
     * 로그인하지 않아도 조회 가능
     */
    {
      path:
        '/official-tutorials',
      element:
        <OfficialTutorialPage />,
    },

    {
      path:
        '/official-tutorials/:tutorialId',
      element:
        <TutorialDetailPage />,
    },

    /**
     * 마이 프로필
     *
     * 로그인 필요
     */
    {
      path:
        '/myProfile',
      element: (
        <ProtectedRoute>
          <MyProfile />
        </ProtectedRoute>
      ),
    },

    /**
     * Studio
     *
     * 로그인 필요
     */
    {
      path:
        '/studio',
      element: (
        <ProtectedRoute>
          <Studio1 />
        </ProtectedRoute>
      ),
    },

    {
      path:
        '/studio/create',
      element: (
        <ProtectedRoute>
          <Stdio_create1 />
        </ProtectedRoute>
      ),
    },

    {
      path:
        '/studio/:flowId/edit',
      element: (
        <ProtectedRoute>
          <Stdio_create1 />
        </ProtectedRoute>
      ),
    },

    {
      path:
        '/studio/save/review',
      element: (
        <ProtectedRoute>
          <Studio_create_review1 />
        </ProtectedRoute>
      ),
    },

    {
      path:
        '/studio/save/details',
      element: (
        <ProtectedRoute>
          <Studio_create_review_details1 />
        </ProtectedRoute>
      ),
    },

    {
      path:
        '/studio/save/publish',
      element: (
        <ProtectedRoute>
          <Studio_create_review_publish1 />
        </ProtectedRoute>
      ),
    },

    /**
     * Workflow Preview
     */
    {
      path:
        '/workflows/:flowId/preview',
      element: (
        <ProtectedRoute>
          <Studio_create_review1 />
        </ProtectedRoute>
      ),
    },

    /**
     * 내 저장소
     */
    {
      path:
        '/my-storage',
      element: (
        <ProtectedRoute>
          <MyStoragePage />
        </ProtectedRoute>
      ),
    },

    {
      path:
        '/my-storage/workflows/:flowId',
      element: (
        <ProtectedRoute>
          <WorkflowDetailPage />
        </ProtectedRoute>
      ),
    },

    {
      path:
        '/my-storage/workflows/:flowId/preview',
      element: (
        <ProtectedRoute>
          <Studio_create_review1 />
        </ProtectedRoute>
      ),
    },

    /**
     * 공개 라이브러리
     */
    {
      path:
        '/public-library',
      element:
        <PublicLibraryPage />,
    },

    {
      path:
        '/public-library/:libraryId',
      element:
        <LibraryDetailPage />,
    },

    /**
     * 개발 테스트 페이지
     */
    {
      path:
        '/studionodecardtestpage',
      element:
        <StudioNodeCardTestPage />,
    },

    {
      path:
        '/process-test',
      element:
        <ProcessTestPage />,
    },

    /**
     * 존재하지 않는 경로
     */
    {
      path:
        '*',
      element: (
        <Navigate
          to="/"
          replace
        />
      ),
    },
  ])