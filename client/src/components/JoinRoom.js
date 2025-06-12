import React, { useState } from "react";

function JoinRoom({ setUsername, setRoom, setJoined }) {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const joinChat = () => {
    if (name && roomCode) {
      setUsername(name);
      setRoom(roomCode);
      setJoined(true);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Join Chat Room</h2>
      <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Room Code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
      <button onClick={joinChat}>Join</button>
    </div>
  );
}

export default JoinRoom;
