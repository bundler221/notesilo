// src/api/auth.js

// Use Vite environment variable for backend URL
// Create a .env file in your frontend root with:
// VITE_API_URL=http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

export async function register(username, email, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      let errorMessage = "Registration failed";
      try {
        const errorData = await res.json();
        console.error("Backend error response:", errorData);
        errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage;
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (err) {
    console.error("Register error:", err.message);
    throw err;
  }
}


export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // Try to parse error response safely
      let errorMessage = "Login failed";
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (err) {
    console.error("Login error:", err.message);
    throw err;
  }
}

export function googleLogin() {
  window.location.href = `${API_URL}/google`;
}
