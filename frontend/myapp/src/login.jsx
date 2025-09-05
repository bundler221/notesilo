//login.jsx
import React from 'react'
import './App.css'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-8">Welcome to NOTESILO</h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Login</h1>
        <h3 className="text-gray-500 mb-6">Please sign in to continue</h3>

        <form className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <a href="#" className="text-sm text-blue-600 hover:underline self-end">
            Forgot Password?
          </a>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{" "}
          {/* <a  className="text-blue-600 hover:underline font-medium">
            Sign up
          </a> */}
          <Link  className="text-blue-600 hover:underline font-medium" to= "/signin">Sign up</Link>
        </p>
      </div>
    </div>
  )
}


export default Login