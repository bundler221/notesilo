import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register, googleLogin } from "../utils/auth";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false); // 👈 toggle state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const data = await login(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/notes");
    } else {
      alert(data.msg || "Login failed");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const data = await register(username, email, password);
    if(password !== confirmPassword){
      setPassword("");
      setConfirmPassword("");
      alert("Password and Confirm Password not match")
      return;
    }
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/notes");
    } else {
      alert(data.msg || "Register failed");
    } 


  }


  return (
    <div className="flex min-h-screen bg-gradient-to-r from-white-100 via-sky-500 to-pink-700">
      {/* Left side - Intro */}
      <div className="w-1/2 flex flex-col justify-center p-12 text-gray-800">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-yellow-600">NoteSilo</span>
        </h1>
        <h3 className="text-2xl mb-6 font-semibold">
          Your personal, secure, and smart note-taking companion
        </h3>
        <p className="text-lg leading-relaxed">
          NoteSilo is a modern note-taking web app that lets you create, edit,
          and organize your notes anytime, anywhere. With secure authentication
          (Email/Password & Google login), your notes stay private while being
          easily accessible.
        </p>
      </div>

      {/* Right side - Auth Card */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isRegister ? "Register" : "Login"}
          </h2>

          {/* Login Form */}
          {!isRegister && (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              {/* Email */}
              <div className="flex items-center border rounded-lg px-3">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 outline-none"
                />
              </div>

              {/* Password */}
              <div className="flex items-center border rounded-lg px-3">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 outline-none"
                />
              </div>

              <div className="text-blue-600 hover:underline flex justify-end">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Login
              </button>
            </form>
          )}

          {/* Register Form */}
          {isRegister && (
            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              {/* Username */}
              <div className="flex items-center border rounded-lg px-3">
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex items-center border rounded-lg px-3">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 outline-none"
                />
              </div>

              {/* Password */}
              <div className="flex items-center border rounded-lg px-3">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex items-center border rounded-lg px-3">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 outline-none"
                />
              </div>


              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Register
              </button>
            </form>
          )}

          {/* Divider */}
          {!isRegister && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
                onClick={googleLogin}
              >
                <FcGoogle className="text-xl bg-white rounded-full" />
                Sign in with Google
              </button>
            </>
          )}

          {/* Toggle between Login & Register */}
          <div className="flex justify-center mt-8">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-blue-600 hover:underline hover:text-blue-700"
                >
                  Login
                </button>
              </p>
            ) : (
              <p>
                New User?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-blue-600 hover:underline hover:text-blue-700"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
