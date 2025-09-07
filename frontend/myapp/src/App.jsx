import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; 
import Login from "./components/login";
import Register from "./components/Register";
import Notes from "./components/Notes";
import OauthSuccess from "./components/OauthSuccess";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/forgotpassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/oauth-success" element={<OauthSuccess />}
        
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
