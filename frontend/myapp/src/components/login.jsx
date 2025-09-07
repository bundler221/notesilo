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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
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
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>

      <button
        onClick={googleLogin}
        className="bg-red-500 text-white p-2 mt-4"
      >
        Sign in with Google
      </button>
    </div>
  );
}
