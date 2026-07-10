import { Routes, Route } from "react-router-dom"
import { HomePage } from './pages/home/HomePage'
import { Login } from './pages/Login'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<HomePage />} />
    </Routes>
  )
}

export default App
