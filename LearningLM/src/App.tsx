import { Routes, Route } from "react-router-dom"
import { HomePage } from './pages/home/HomePage'
import { PwFind } from './pages/PwFind'


function App() {
  return (
    <Routes>
      <Route path='/' element={<PwFind />} />
      <Route path='/home' element={<HomePage />} />
    </Routes>
  )
}

export default App
