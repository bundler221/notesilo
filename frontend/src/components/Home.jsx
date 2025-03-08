import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, googleLogin } from "../utils/auth";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import MDEditor from "@uiw/react-md-editor";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [editorContent, setEditorContent] = useState("# Welcome to NoteSilo Free Editor\n\nStart writing your markdown here...\n\n## Features\n\n- **Bold text**\n- *Italic text*\n- `Code snippets`\n- [Links](https://example.com)\n\n### Lists\n\n1. First item\n2. Second item\n3. Third item\n\n- Bullet point 1\n- Bullet point 2\n\n> Blockquotes are supported too!\n\n```javascript\n// Code blocks work perfectly\nconsole.log('Hello, NoteSilo!');\n```\n\nTry editing this text to see the live preview!");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErrors({});

    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = await login(email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      if (data.msg?.toLowerCase().includes("invalid")) {
        setErrors({ general: "Invalid email or password" });
      } else if (data.msg?.toLowerCase().includes("not found")) {
        setErrors({ general: "User does not exist" });
      } else {
        setErrors({ general: data.msg || "Login failed" });
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Top Section with Login */}
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
        {/* Left Section */}
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
            and organize your notes anytime, anywhere...
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => {
                const element = document.getElementById('free-editor');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
            >
              Try Now
            </button>
            <Link
              to="/register"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-center"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Login
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div>
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
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {errors.general && (
                <p className="text-red-500 text-sm text-center">
                  {errors.general}
                </p>
              )}

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

            {/* Divider + Google */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 md:py-3 rounded-lg transition"
              onClick={googleLogin}
            >
              <FcGoogle className="text-lg md:text-xl" />
              Sign in with Google
            </button>

            {/* Link to Register */}
            <div className="flex justify-center mt-6 md:mt-8 text-sm md:text-base">
              <p>
                New user?{" "}
                <Link
                  to="/register"
                  className="text-gray-800 hover:underline hover:text-gray-900 font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Free Editor Feature Section */}
      <div id="free-editor" className="w-full bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Our Free Editor
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the power of NoteSilo with our free, no-signup-required editor. 
              Write, format, and export your notes instantly.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write your notes in Markdown - Live Preview Enabled
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={editorContent}
                  onChange={(val) => setEditorContent(val || "")}
                  height={400}
                  preview="live"
                  hideToolbar={false}
                  visibleDragBar={false}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-between items-center mt-6">
              <div className="flex gap-3">
                <button 
                  onClick={() => navigator.clipboard.writeText(editorContent)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  📋 Copy to Clipboard
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([editorContent], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'notesilo-notes.md';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  � Download as MD
                </button>
                <button 
                  onClick={() => setEditorContent("")}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  🗑️ Clear Editor
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready for more? Sign up for free!
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Sign In
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • Unlimited notes • Cloud sync • Access anywhere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}