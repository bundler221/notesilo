import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OauthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 OauthSuccess mounted");

    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const usernameFromUrl = params.get("username"); // 👈 backend should pass this
    const tokenFromStorage = localStorage.getItem("token");
    const usernameFromStorage = localStorage.getItem("username");

    console.log("📥 Extracted from URL -> token:", tokenFromUrl, "| username:", usernameFromUrl);
    console.log("💾 Already in localStorage -> token:", tokenFromStorage, "| username:", usernameFromStorage);

    if (tokenFromUrl) {
      try {
        localStorage.setItem("token", tokenFromUrl);
        console.log("✅ Token stored in localStorage");

        if (usernameFromUrl) {
          localStorage.setItem("username", usernameFromUrl);
          console.log("✅ Username stored in localStorage:", usernameFromUrl);
        }

        navigate("/notes");
      } catch (err) {
        console.error("❌ Failed to save token/username:", err);
      }
    } else if (tokenFromStorage) {
      console.log("✅ Token already in localStorage, skipping redirect");
      navigate("/notes");
    } else {
      console.warn("⚠️ No token found, redirecting to login");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}
