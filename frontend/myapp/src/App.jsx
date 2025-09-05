import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1>Welcome to NOTESILO</h1>
     <div>
        <h1>Login</h1>
        <h3>Please Sign in to continue</h3>
        <form>
          <input placeholder='Email Adress'></input>
          <input placeholder='Password'></input>
          <a href='#'>Forgot Password?</a>
          <button type='submit'>Submit</button>
        </form>
        <p>Don't have an account?<span><a href='#'>Sign up</a></span></p>

     </div>
    </>
  )
}

export default App
