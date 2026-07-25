import { InputTestPage } from './pages/dev/InputTestPage'
import { BlockCommonComponentTestPage } from './pages/dev/BlockCommonComponentTestPage'

function App() {
  if (window.location.pathname === '/block-common-components') {
    return <BlockCommonComponentTestPage />
  }

  return <InputTestPage />
}

export default App
