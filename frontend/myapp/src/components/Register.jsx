import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/auth";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    let newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters, include 1 uppercase and 1 number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await register(username, email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("firstLogin", "true");
        navigate("/dashboard");
      } else {
        if (data.msg?.toLowerCase().includes("already exists")) {
          setErrors({ general: "User already exists" });
        } else {
          setErrors({ general: data.msg || "Registration failed" });
        }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setErrors({ general: "Server error, please try again later" });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Create Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
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
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

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

          <div>
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}

          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 md:py-3 rounded-lg transition"
          >
            Register
          </button>
        </form>

        <div className="flex justify-center mt-6 md:mt-8 text-sm md:text-base">
          <p>
            Already have an account?{" "}
            <Link
              to="/"
              className="text-gray-800 hover:underline hover:text-gray-900 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
