import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register, googleLogin } from "../utils/auth";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
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
      navigate("/dashboard");
    } else {
      alert(data.msg || "Login failed");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      alert("Password and Confirm Password do not match");
      return;
    }

    const data = await register(username, email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert(data.msg || "Register failed");
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      {/* ---------- Left desktop block (md and up) ---------- */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center p-12 text-gray-800">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent inline-block">
            NoteSilo
          </span>
        </h1>
        <h3 className="text-xl md:text-2xl mb-6 font-semibold text-gray-700">
          Your personal, secure, and smart note-taking companion
        </h3>
        <p className="text-base md:text-lg leading-relaxed max-w-lg text-gray-600">
          NoteSilo is a modern note-taking web app that lets you create, edit,
          and organize your notes anytime, anywhere. With secure authentication
          (Email/Password & Google login), your notes stay private while being
          easily accessible...
        </p>
      </div>

      {/* ---------- Intro top for small screens only ---------- */}
      <div className="w-full md:hidden flex flex-col justify-center p-6 text-gray-800 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="text-gray-900">NoteSilo</span>
        </h1>
        <h3 className="text-lg mb-4 font-semibold text-gray-700">
          Your personal, secure, and smart note-taking companion
        </h3>
      </div>

      {/* ---------- Auth Card ---------- */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            {isRegister ? "Register" : "Login"}
          </h2>

          {/* Login Form */}
          {!isRegister && (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div className="flex items-center border rounded-lg px-3">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 outline-none text-sm md:text-base"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 outline-none text-sm md:text-base"
                />
              </div>

              <div className="text-gray-600 hover:underline flex justify-end text-sm md:text-base">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 md:py-3 rounded-lg transition"
              >
                Login
              </button>
            </form>
          )}

          {/* Register Form */}
          {isRegister && (
            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <div className="flex items-center border rounded-lg px-3">
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 outline-none text-sm md:text-base"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 outline-none text-sm md:text-base"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 outline-none text-sm md:text-base"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 outline-none text-sm md:text-base"
                />
              </div>

              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 md:py-3 rounded-lg transition"
              >
                Register
              </button>
            </form>
          )}

          {/* Divider + Google */}
          {!isRegister && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 md:py-3 rounded-lg transition"
                onClick={googleLogin}
              >
                <FcGoogle className="text-lg md:text-xl" />
                Sign in with Google
              </button>
            </>
          )}

          {/* Toggle */}
          <div className="flex justify-center mt-6 md:mt-8 text-sm md:text-base">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-gray-800 hover:underline hover:text-gray-900 font-medium"
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
                  className="text-gray-800 hover:underline hover:text-gray-900 font-medium"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Description for small screens only ---------- */}
      <div className="w-full md:hidden p-6 text-gray-800 text-center">
        <p className="font-sans text-base leading-relaxed max-w-lg mx-auto text-gray-600">
          NoteSilo is a modern note-taking web app that lets you create, edit,
          and organize your notes anytime, anywhere. With secure authentication
          (Email/Password & Google login), your notes stay private while being
          easily accessible...
        </p>
      </div>
    </div>
  );
}
