import React, { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div>
      {joined ? (
        <ChatRoom username={username} room={room} />
      ) : (
        <JoinRoom setUsername={setUsername} setRoom={setRoom} setJoined={setJoined} />
      )}
    </div>
  );
}

export default App;
