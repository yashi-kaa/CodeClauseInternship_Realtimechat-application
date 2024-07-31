import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/navbar"; 
import Footer from "../Footer/footer";
import "./login.css"; 

const Login = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="background">
      <Navbar /> 
      <div className="container">
        <div className="logo">
          <p></p>
        </div>
        <h1 className="login-h1">Login to your Account</h1>
        <form method="post">
          <div className="form-group">
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Username"
              required
              className="form-control form-input"
            />
          </div>
          <div className="form-group">
            <input
              onChange={(e) => setRoom(e.target.value)}
              type="text"
              placeholder="Room"
              required
              className="form-control form-input"
            />
          </div>
          <Link
            onClick={(e) => (!name || !room ? e.preventDefault() : null)}
            to={`/chatpage?name=${name}&room=${room}`}
          >
            <input type="submit" className="form-submit" value="Join Chat" />
          </Link>
        </form>
      </div>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
};

export default Login;
