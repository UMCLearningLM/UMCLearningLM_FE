import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@xyflow/react/dist/style.css'
import './index.css'

import App from './App'
import { CTX_001 } from './pages/context_prototype/CTX_001'
import { CTX_002 } from './pages/context_prototype/CTX_002'

createRoot(
  document.getElementById('root')!,
).render(
  <StrictMode>
    <CTX_002 />
  </StrictMode>,
)