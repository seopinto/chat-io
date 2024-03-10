import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import UserAliasForm from "./components/UserAliasForm";
import ChatContainer from "./components/ChatContainer";
import ConnectedUsers from "./components/ConnectedUsers";

const socket = io("http://localhost:4000");

function App() {
  const [alias, setAlias] = useState(() => localStorage.getItem('userAlias') || "");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessagesFromUsers, setNewMessagesFromUsers] = useState({});
  const [selectedUserAlias, setSelectedUserAlias] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if(storedUserId) {
      setCurrentUserId(storedUserId);
    }

    socket.on("connect", () => {
      console.log("Connected to server");
      // Al conectarse, si ya tenemos un alias almacenado, reemitimos el alias para establecerlo en el servidor.
      if(alias) {
        socket.emit("setAlias", alias);
      }
    });

    socket.on("disconnect", () => console.log("Disconnected from server"));

    socket.on("usersList", (updatedUsers) => setUsers(updatedUsers));

    socket.on("newMessage", (message) => {
      if (currentRoom && message.roomId === currentRoom) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      if (message.senderId !== currentUserId) {
        setNewMessagesFromUsers((prevNotifications) => ({
          ...prevNotifications,
          [message.senderId]: true
        }));
      }
    });

    socket.on("yourUserId", (userId) => {
      setCurrentUserId(userId);
      localStorage.setItem('userId', userId); // Guarda el userId en localStorage
      console.log("UserID set to:", userId);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newMessage");
      socket.off("usersList");
      socket.off("yourUserId");
    };
  }, [currentRoom, currentUserId, alias]);

  const handleAliasSubmit = (userAlias) => {
    localStorage.setItem('userAlias', userAlias); // Guarda el alias en localStorage
    setAlias(userAlias);
    socket.emit("setAlias", userAlias);
  };

  const handleSelectUser = (selectedUser) => {
    const roomId = [currentUserId, selectedUser.id].sort().join("-");
    setCurrentRoom(roomId);
    setSelectedUserAlias(selectedUser.alias);
    setNewMessagesFromUsers((prevNotifications) => ({
      ...prevNotifications,
      [selectedUser.id]: false
    }));
    socket.emit("joinRoom", { roomId, userId: currentUserId });
    console.log("Joining room:", { roomId, userId: currentUserId });
    setMessages([]);
  };

  return (
    <div className="App bg-gray-800 dark:bg-gray-800 h-screen">
      {!alias ? (
        <UserAliasForm onAliasSubmit={handleAliasSubmit} />
      ) : (
        <div className="container mx-auto flex">
          <ConnectedUsers
            users={users}
            onSelectUser={handleSelectUser}
            currentUserId={currentUserId}
            userAlias={alias}
            newMessagesFromUsers={newMessagesFromUsers}
          />
          {currentRoom && (
            <ChatContainer
              roomId={currentRoom}
              currentUserId={currentUserId}
              messages={messages}
              selectedUserAlias={selectedUserAlias}
              socket={socket}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
