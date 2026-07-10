import { Routes, Route } from "react-router-dom"
import { HomePage } from './pages/home/HomePage'
import { Register } from './pages/Register'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path='/home' element={<HomePage />} />
    </Routes>
  )
}

export default App
