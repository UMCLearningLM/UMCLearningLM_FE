import {
  Navigate,
  createBrowserRouter,
  useLocation,
} from 'react-router-dom'

import { HomePage } from '../pages/home/HomePage'
import { PublicLibraryPage } from '../pages/library/PublicLibraryPage'
import LibraryDetailPage from '../pages/library/LibraryDetailPage'
import MyStoragePage from '../pages/storage/MyStoragePage'
import WorkflowDetailPage from '../pages/storage/WorkflowDetailPage'
import { Stdio_create1 } from '../pages/Stdio_create1'
import { Studio_create_review1 } from '../pages/Studio_create_review1'
import { Studio_create_review_details1 } from '../pages/Studio_create_review_details1'
import { Studio_create_review_publish1 } from '../pages/Studio_create_review_publish1'
import { OfficialTutorialPage } from '../pages/tutorial/OfficialTutorialPage'
import { TutorialDetailPage } from '../pages/tutorial/TutorialDetailPage'
import { StudioNodeCardTestPage } from '../pages/dev/StudioNodeCardTestPage'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { PwFind } from '../pages/PwFind'
import GoogleLoginLoading from '../pages/auth/GoogleLogin'
import GoogleLoginSuccess from '../pages/auth/GoogleLoginSuccess'
import GoogleLoginError from '../pages/auth/GoogleLoginError'

/**
 * /studio로 들어온 query string과 location.state를 잃지 않고
 * 실제 편집 화면인 /studio/create로 넘깁니다.
 *
 * 공개 라이브러리 복사, 튜토리얼 시작 등에서 전달한 state가
 * 단순 <Navigate /> 리다이렉트 과정에서 사라지는 문제를 막습니다.
 */
function StudioRedirect() {
  const location = useLocation()

  return (
    <Navigate
      to={{
        pathname: '/studio/create',
        search: location.search,
      }}
      state={location.state}
      replace
    />
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/home',
    element: (
      <Navigate
        to="/"
        replace
      />
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/signup',
    element: (
      <Navigate
        to="/register"
        replace
      />
    ),
  },
  {
    path: '/pw-find',
    element: <PwFind />,
  },
  {
    path: '/password-find',
    element: (
      <Navigate
        to="/pw-find"
        replace
      />
    ),
  },
  {
    path: '/auth/google/loading',
    element: <GoogleLoginLoading />,
  },
  {
    path: '/auth/google/success',
    element: <GoogleLoginSuccess />,
  },
  {
    path: '/auth/google/error',
    element: <GoogleLoginError />,
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
    element: <StudioRedirect />,
  },
  {
    path: '/studio/create',
    element: <Stdio_create1 />,
  },
  {
    path: '/studio/:workflowId/edit',
    element: <Stdio_create1 />,
  },
  {
    path: '/studio/save/review',
    element: <Studio_create_review1 />,
  },
  {
    path: '/studio/save/details',
    element: <Studio_create_review_details1 />,
  },
  {
    path: '/studio/save/publish',
    element: <Studio_create_review_publish1 />,
  },
  {
    path: '/workflows/:workflowId/preview',
    element: <Studio_create_review1 />,
  },
  {
    path: '/my-storage',
    element: <MyStoragePage />,
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
    element: <WorkflowDetailPage />,
  },
  {
    path: '/studionodecardtestpage',
    element: <StudioNodeCardTestPage />,
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
