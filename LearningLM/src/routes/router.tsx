import {
  Navigate,
  createBrowserRouter,
} from 'react-router-dom'

import { HomePage } from '../pages/home/HomePage'
import { PublicLibraryPage } from '../pages/library/PublicLibraryPage'
import LibraryDetailPage from '../pages/library/LibraryDetailPage'
import MyStoragePage from '../pages/storage/MyStoragePage'
import WorkflowDetailPage from '../pages/storage/WorkflowDetailPage'
import { Studio_create_review1 } from '../pages/Studio_create_review1'
import { Stdio_create1 } from '../pages/Stdio_create1'
import { OfficialTutorialPage } from '../pages/tutorial/OfficialTutorialPage'
import { TutorialDetailPage } from '../pages/tutorial/TutorialDetailPage'
import { StudioNodeCardTestPage } from '../pages/dev/StudioNodeCardTestPage'
import { ProcessTestPage } from '../pages/dev/ProcessTestPage'
import LoginPage from '../pages/auth/Login'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/official-tutorials',
    element: <OfficialTutorialPage />,
  },
  {
    path: '/official-tutorials/:tutorialId',
    element: <TutorialDetailPage />,
  },
  {
    path: '/studio',
    element: (
      <Navigate
        to="/studio/create"
        replace
      />
    ),
  },
  {
    path: '/studio/create',
    element: <Stdio_create1 />,
  },
  {
    path: '/my-storage',
    element: (
      <ProtectedRoute>
        <MyStoragePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/public-library',
    element: <PublicLibraryPage />,
  },
  {
    path: '/public-library/:libraryId',
    element: <LibraryDetailPage />,
  },
  {
    path: '/my-storage/workflows/:workflowId',
    element: (
      <ProtectedRoute>
        <WorkflowDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    // 내가 만든 흐름 카드의 미리보기(저장 전 검토) 화면입니다.
    path: '/my-storage/workflows/:workflowId/preview',
    element: (
      <ProtectedRoute>
        <Studio_create_review1 />
      </ProtectedRoute>
    ),
  },
  {
    path: '/studionodecardtestpage',
    element: <StudioNodeCardTestPage />,
  },
  {
    path: '/process-test',
    element: <ProcessTestPage />,
  },
  {
    path: '*',
    element: (
      <Navigate
        to="/"
        replace
      />
    ),
  },
])
