import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OauthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 OauthSuccess mounted");
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const tokenFromStorage = localStorage.getItem("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      console.log("✅ Token stored in localStorage");
      navigate("/notes");
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
