import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Chat from "./pages/chatpage/chatpage";
import About from "./pages/About/about";
import SignupForm from "./pages/Signup/Signupform.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chatpage" element={<Chat />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
