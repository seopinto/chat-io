import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import socket from '../socket'; 

function ChatContainer({ roomId, currentUserId, selectedUserAlias, socket }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Recuperar el historial de mensajes del localStorage al cargar la aplicación
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("Mensaje recibido:", message);
      if (message.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
  
    socket.on('newMessage', handleNewMessage);
  
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [roomId, socket]) // Dependencia de efecto, re-ejecuta este efecto si 'roomId' cambia.

useEffect(() => {
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    setMessages(JSON.parse(savedMessages));
  }
}, [roomId]);


  // Función para enviar un nuevo mensaje.
  const sendMessage = (text) => {
    if (text.trim() && currentUserId) {
      const message = {
        roomId,
        senderId: currentUserId,
        text,
        timestamp: Date.now(),
      };
      console.log('Enviando mensaje:', message);
      socket.emit('sendMessage', message);
    } else {
      console.error("No se puede enviar el mensaje, falta texto o senderId es undefined.");
    }
  };

  return (
   
<div className="w-3/4 p-4 block bg-gray-100 h-screen relative">
      <div className="p-4 shadow-lg bg-blue-600 text-white">
        <h2 className="text-xl font-bold text-center">Chat con {selectedUserAlias || 'Seleccione un chat'}</h2>
      </div>
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}

export default ChatContainer;