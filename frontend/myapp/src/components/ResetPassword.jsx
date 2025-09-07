import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirm) {
      return setMessage("Passwords do not match");
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();
    setMessage(data.msg);

    if (data.msg.includes("success")) {
      setTimeout(() => navigate("/"), 2000);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
        <h3 className="text-gray-500 mb-6">
          Enter your new password below
        </h3>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="text-sm text-blue-600 mt-4 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
