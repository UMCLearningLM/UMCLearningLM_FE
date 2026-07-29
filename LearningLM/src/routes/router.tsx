import { Navigate, createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/home/HomePage'
import { OfficialTutorialPage } from '../pages/tutorial/OfficialTutorialPage'
import { TutorialDetailPage } from '../pages/tutorial/TutorialDetailPage'

import MyStoragePage from '../pages/storage/MyStoragePage'
import { PublicLibraryPage } from '../pages/library/PublicLibraryPage'
import LibraryDetailPage from '../pages/library/LibraryDetailPage'
import WorkflowDetailPage from '../pages/storage/WorkflowDetailPage'
import { StudioNodeCardTestPage } from '../pages/dev/StudioNodeCardTestPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
    element: <MyStoragePage />
  },
  {
    path: '/public-library',
    element: <PublicLibraryPage />
  },
  {
    path: '/public-library/:libraryId',
    element: <LibraryDetailPage />
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
    element: <Navigate to="/" replace />,
  },

])
