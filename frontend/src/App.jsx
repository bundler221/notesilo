import { BrowserRouter, Routes, Route } from "react-router-dom";
import "intro.js/introjs.css";

import "./App.css";
import Home from "./components/Home";
import Register from "./components/Register";
import Notes from "./components/Notes";
import OauthSuccess from "./components/Oauthsuccess";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/forgotpassword";
import GraphPage from "./components/GraphPage"; 
import AddReferenceForm from "./components/AddReferenceForm"; // optional if you want direct page
import LeftSideFiles from "./components/LeftSideFiles"
import { Toaster } from "react-hot-toast";
import UserGuide from "./components/UserGuide";
import AboutUs from "./components/AboutUs";
import AdminDashboard from "./components/AdminDashboard";
import Incognoir from '@incognoir/browser-sdk';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Debug: Check if environment variables are loaded
    // console.log('=== VITE ENV DEBUG ===');
    // console.log('VITE_INCOGNOIR_API_KEY:', import.meta.env.VITE_INCOGNOIR_API_KEY);
    // console.log('VITE_INCOGNOIR_ENVIRONMENT_ID:', import.meta.env.VITE_INCOGNOIR_ENVIRONMENT_ID);
    // console.log('API Key Length:', import.meta.env.VITE_INCOGNOIR_API_KEY?.length);
    // console.log('API Key Format:', import.meta.env.VITE_INCOGNOIR_API_KEY?.startsWith('sk_') ? 'Valid format' : 'Invalid format');
    // console.log('All VITE env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
    // console.log('===================');
    
    // Initialize Incognoir with correct init function
    try {
      Incognoir.init({
        apiBase: 'https://api.incognoir.com',
        apiKey: import.meta.env.VITE_INCOGNOIR_API_KEY,
        environmentId: import.meta.env.VITE_INCOGNOIR_ENVIRONMENT_ID
      });
      
      console.log('Incognoir initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Incognoir:', error);
    }
  }, []);

  return (  
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-success" element={<OauthSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/graph" element={<GraphPage />} />  {/* ✅ Graph page route */}
        <Route path="/dashboard" element={<LeftSideFiles/>}/>
        <Route path="user-guide" element={<UserGuide/>}/>
        <Route path="about-us" element={<AboutUs/>}/>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
