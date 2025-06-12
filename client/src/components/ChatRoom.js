import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io.connect("http://localhost:3001");

function ChatRoom({ username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    socket.emit("join_room", { room });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("show_typing", () => setTyping(true));
    socket.on("hide_typing", () => setTyping(false));

    return () => socket.disconnect();
  }, [room]);

  const sendMessage = () => {
    if (currentMessage || image) {
      const msgData = {
        room,
        username,
        message: currentMessage,
        image: image ? URL.createObjectURL(image) : null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      socket.emit("send_message", msgData);
      
      setCurrentMessage("");
      setImage(null);
    }
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    socket.emit("typing", room);
    setTimeout(() => socket.emit("stop_typing", room), 1000);
  };

  const handleEmojiClick = (emojiObj) => {
    setCurrentMessage((prev) => prev + emojiObj.emoji);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Chat Room: {room}</h2>
      <div style={{ height: 500, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.username === username ? "flex-end" : "flex-start",
              marginBottom: 10
            }}
          >
            <div
              style={{
                background: msg.username === username ? "#d4f8d4" : "#f0f0f0",
                padding: 10,
                borderRadius: 10,
                maxWidth: "60%",
              }}
            >
              <div><strong>{msg.username}</strong>: {msg.message}</div>
              {msg.image && <img src={msg.image} alt="uploaded" width="100" />}
              <div style={{ fontSize: "0.8em", color: "#555", textAlign: "right" }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {typing && <p><em>Someone is typing...</em></p>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Type message..."
          value={currentMessage}
          onChange={handleTyping}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>
        <button onClick={sendMessage}>Send</button>
      </div>

      {showEmoji && <EmojiPicker onEmojiClick={handleEmojiClick} />}
    </div>
  );
}

export default ChatRoom;
