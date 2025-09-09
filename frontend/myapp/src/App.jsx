import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import Register from "./components/Register";
import Notes from "./components/Notes";
import OauthSuccess from "./components/Oauthsuccess";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/forgotpassword";
import GraphPage from "./components/GraphPage"; 
import AddReferenceForm from "./components/AddReferenceForm"; // optional if you want direct page
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/oauth-success" element={<OauthSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/graph" element={<GraphPage />} />  {/* ✅ Graph page route */}
      </Routes>
    </BrowserRouter>
  );
}


export default App;
