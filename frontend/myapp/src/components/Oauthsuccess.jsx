import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OauthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token) localStorage.setItem("token", token);
    if (username) localStorage.setItem("username", username);
    console.log(token);
    
    navigate("/dashboard"); // redirect to notes page
  }, [navigate]);

  return <p>Logging in...</p>;
}
