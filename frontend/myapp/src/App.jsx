import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './login.jsx'
import Signin from './signin.jsx'  // create this later

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signin' element={<Signin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
