import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@xyflow/react/dist/style.css'
import './index.css'

import App from './App'
import { CTX_001 } from './pages/context_prototype/CTX_001'
import { CTX_002 } from './pages/context_prototype/CTX_002'
import { CTX_003 } from './pages/context_prototype/CTX_003'
import { CTX_004 } from './pages/context_prototype/CTX_004'
import { CTX_005 } from './pages/context_prototype/CTX_005'
import { CTX_006 } from './pages/context_prototype/CTX_006'
import { CTX_009 } from './pages/context_prototype/CTX_009'

createRoot(
  document.getElementById('root')!,
).render(
  <StrictMode>
    <CTX_009 />
  </StrictMode>,
)