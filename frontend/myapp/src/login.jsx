// login.jsx
import React from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import HeroText from './HeroText'

const Login = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/istockphoto-2195984749-640_adpp_is.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Hero Text on Top */}
      <HeroText />

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg z-10">
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

          <Link
            className="text-sm text-blue-600 hover:underline self-end"
            to={"/Forgotpassword"}
          >
            forgot password?
          </Link>

          <button
            type="submit"
            className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 transition shadow-3lg"
          >
            Submit
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            className="text-blue-600 hover:underline font-medium"
            to="/signin"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
