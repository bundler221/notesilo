import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await login(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/notes");
    } else {
      alert(data.msg || "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-700 via-sky-200 to-white">
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
      easily accessible. You can manage your account, update your profile, 
      and even delete your data whenever you want.
    </p>
  </div>

  {/* Right side - Login */}
  <div className="w-1/2 flex items-center justify-center">
    <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        
        >
          Login
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <button
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"

        onClick={googleLogin}
      >
        Sign in with Google
      </button>
    </div>
  </div>
</div>

  );
}
