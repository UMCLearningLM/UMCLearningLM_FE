import {
  Navigate,
  createBrowserRouter,
} from 'react-router-dom'

import { HomePage } from '../pages/home/HomePage'
import { PublicLibraryPage } from '../pages/library/PublicLibraryPage'
import LibraryDetailPage from '../pages/library/LibraryDetailPage'
import MyStoragePage from '../pages/storage/MyStoragePage'
import WorkflowDetailPage from '../pages/storage/WorkflowDetailPage'
import { Stdio_create1 } from '../pages/Stdio_create1'
import { OfficialTutorialPage } from '../pages/tutorial/OfficialTutorialPage'
import { TutorialDetailPage } from '../pages/tutorial/TutorialDetailPage'
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