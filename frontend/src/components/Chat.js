// src/components/Chat.js
import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function Chat({ messages, onSendMessage }) {
    return (
      <div className="flex-1 p-4 flex flex-col">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    );
  }

export default Chat;