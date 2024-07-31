import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import "./chatpage.css";

let socket;
const Chat = () => {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBodyRef = useRef(null); 

  const socketUrl = "http://localhost:7000";

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const user = params.get("name");
    const room = params.get("room");

    setUser(user);
    setRoom(room);

    socket = io(socketUrl);

    socket.emit("join", { user, room }, (err) => {
      if (err) {
        console.error("Error joining chat:", err);
       
      }
    });

    return () => {
      
      socket.disconnect();
      socket.off();
    };
  }, [socketUrl]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prevMsg) => [...prevMsg, msg]);
    });

    socket.on("roomMembers", (usrs) => {
      setUsers(usrs);
    });

    
    return () => {
      socket.off("message");
      socket.off("roomMembers");
    };
  }, []);

  useEffect(() => {
    // Scroll chat body to bottom on messages change
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url("/public/background.jpg")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
        paddingTop: "15px",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: "rgba(2, 255, 255, 0.5)",
          borderRadius: 2,
          padding: 2,
          boxShadow: 3,
          minHeight: "80vh", 
          display: "flex",
          flexDirection: "column",
          alignItems: "center", 
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box display="flex" flex={1} height="100%">
            <Box
              flex={1}
              p={1}
              borderRight="1px solid #e0e0e0"
              overflow="auto"
              maxHeight="100%"
            >
              <Typography variant="h6">Active Users</Typography>
              <List>
                {users.map((e, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {e.user}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box flex={3} display="flex" flexDirection="column" p={2}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Room 1</Typography>
              </Box>
              <Divider />
              <Box
                ref={chatBodyRef}
                id="chat_body"
                flex={1}
                overflow="auto"
                sx={{ bgcolor: "#add8e6", p: 2, maxHeight: "400px" }}
              >
                {messages.map((e, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent={
                      e.user === user?.toLowerCase() ? "flex-end" : "flex-start"
                    }
                    mb={1}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: "100%",
                        bgcolor:
                          e.user === user?.toLowerCase() ? "#87CEEB" : "#fff",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "black" }}
                      >
                        {e.text}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {e.user}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              <Box
                component="form"
                onSubmit={sendMessage}
                display="flex"
                alignItems="center"
                mt={1}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mr: 2 }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={sendMessage}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Chat;
