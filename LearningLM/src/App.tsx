import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import MyStoragePage from './pages/storage/MyStoragePage'
import { PublicLibraryPage } from './pages/library/PublicLibraryPage'
import LibraryDetailPage from './pages/library/LibraryDetailPage'
import WorkflowDetailPage from './pages/storage/WorkflowDetailPage'
import { StudioNodeCardTestPage } from './pages/dev/StudioNodeCardTestPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/my-storage"
          element={<MyStoragePage />}
        />

        <Route
          path="/public-library"
          element={<PublicLibraryPage />}
        />

        <Route
          path="/public-library/:libraryId"
          element={<LibraryDetailPage />}
        />
        <Route
          path="/my-storage/workflows/:workflowId"
          element={<WorkflowDetailPage />}
        />
        <Route
          path="/studionodecardtestpage"
          element={<StudioNodeCardTestPage />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App