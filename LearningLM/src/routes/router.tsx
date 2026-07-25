import { Navigate, createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/home/HomePage'
import { OfficialTutorialPage } from '../pages/tutorial/OfficialTutorialPage'
import { TutorialDetailPage } from '../pages/tutorial/TutorialDetailPage'

import MyStoragePage from '../pages/storage/MyStoragePage'
import { PublicLibraryPage } from '../pages/library/PublicLibraryPage'
import LibraryDetailPage from '../pages/library/LibraryDetailPage'
import WorkflowDetailPage from '../pages/storage/WorkflowDetailPage'

import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { PwFind } from '../pages/PwFind'

import GoogleLoginPage from '../pages/auth/Login'
import GoogleLoginLoadingPage from '../pages/auth/GoogleLogin'
import GoogleLoginSuccessPage from '../pages/auth/GoogleLoginSuccess'
import GoogleLoginErrorPage from '../pages/auth/GoogleLoginError'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/home',
    element: <Navigate to="/" replace />,
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

  /*
   * 이메일 로그인
   */
  {
    path: '/login',
    element: <Login />,
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
   * Google 로그인
   */
  {
    path: '/login/google',
    element: <GoogleLoginPage />,
  },
  {
    path: '/auth/google/loading',
    element: <GoogleLoginLoadingPage />,
  },
  {
    path: '/auth/google/success',
    element: <GoogleLoginSuccessPage />,
  },
  {
    path: '/auth/google/error',
    element: <GoogleLoginErrorPage />,
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])