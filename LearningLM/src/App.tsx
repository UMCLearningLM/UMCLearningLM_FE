
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'

function App() {
  if (window.location.pathname === '/block-common-components') {
    return <BlockCommonComponentTestPage />
  }

  return <InputTestPage />
}

export default App

