import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './login.jsx'
import Signin from './signin.jsx'  
import Forgotpassword from './forgotpassword.jsx'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/forgotpassword' element={<Forgotpassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
