import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@xyflow/react/dist/style.css'
import './index.css'

import App from './App'
import { RV_001 } from './review/RV_001'
import { RV_002 } from './review/RV_002'
import { RV_003 } from './review/RV_003'
import { RV_004 } from './review/RV_004'
import { RV_005 } from './review/RV_005'
import { RV_006 } from './review/RV_006'
import { RV_007 } from './review/RV_007'
import { RV_010 } from './review/RV_010'

createRoot(
  document.getElementById('root')!,
).render(
  <StrictMode>
    <RV_001 />
  </StrictMode>,
)