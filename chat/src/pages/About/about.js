import React from "react";
import "./about.css"; 

const About = () => {
  return (
    <div className="about-container">
      <h1>ChatApp</h1>
      <p>
        ChatApp is a real-time messaging application that
        allows users to join rooms and communicate with each other. It is built
        using modern web technologies including React, Node.js, Socket.io, and
        MongoDB.
      </p>
      <p>
        <strong>Key Features:</strong>
        <ul>
          <li>Real-time messaging</li>
          <li>Room-based chat</li>
          <li>Active users list</li>
          <li>Responsive design</li>
        </ul>
      </p>
      <p>
        Our goal is to provide a seamless and efficient communication platform
        for users to connect and share information in real-time.
      </p>
    </div>
  );
};

export default About;
