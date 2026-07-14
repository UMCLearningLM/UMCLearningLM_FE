import { Navigate, createBrowserRouter } from 'react-router-dom'
import { OfficialTutorialPage } from '../pages/tutorial/OfficialTutorialPage'
import { TutorialDetailPage } from '../pages/tutorial/TutorialDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/official-tutorials" replace />,
  },
  {
    path: '/official-tutorials',
    element: <OfficialTutorialPage />,
  },
  {
    path: '/official-tutorials/:tutorialId',
    element: <TutorialDetailPage />,
  },
])
