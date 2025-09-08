import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await register(username, email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/notes");
    } else {
      alert(data.msg || "Register failed");
    }
  }

  return (
    <>
      <Link
        className="text-blue-600 hover:underline font-medium"
        to="/"
      >Home</Link>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl mb-4">Register</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2"
          />
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
          <button type="submit" className="bg-green-500 text-white p-2">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
