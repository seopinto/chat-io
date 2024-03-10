import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import UserAliasForm from "./components/UserAliasForm";
import ChatContainer from "./components/ChatContainer";
import ConnectedUsers from "./components/ConnectedUsers";

const socket = io("http://localhost:4000");

function App() {
  const [alias, setAlias] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessagesFromUsers, setNewMessagesFromUsers] = useState({});
  const [selectedUserAlias, setSelectedUserAlias] = useState('');


  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("disconnect", () => console.log("Disconnected from server"));

    socket.on("usersList", (updatedUsers) => setUsers(updatedUsers));
    socket.on("newMessage", (message) => {
      // Si el usuario actual está en la sala y el mensaje es para esta sala, agregar el mensaje al estado
      if (currentRoom && message.roomId === currentRoom) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    
      // Si el mensaje es para el usuario actual y no lo ha enviado él, actualiza las notificaciones
      if (message.senderId !== currentUserId) {
        setNewMessagesFromUsers((prevNotifications) => ({
          ...prevNotifications,
          [message.senderId]: true
        }));
      }
    });

    socket.on("yourUserId", (userId) => {
      setCurrentUserId(userId);
      console.log("UserID set to:", userId);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newMessage");
      socket.off("usersList");
      socket.off("yourUserId");
    };
  }, [currentRoom, currentUserId]);

  const handleAliasSubmit = (userAlias) => {
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
          newMessagesFromUsers={newMessagesFromUsers} // Pasar el estado de notificaciones
        />
        {currentRoom && (
          <ChatContainer
          roomId={currentRoom}
          currentUserId={currentUserId}
          messages={messages}
          selectedUserAlias={selectedUserAlias}
          socket={socket} // Pasa la instancia de socket
        />
        )}
      </div>
    )}
  </div>
  );
}

export default App;