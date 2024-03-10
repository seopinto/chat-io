// src/components/MessageInput.js
import React, { useState } from "react";

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage(""); // Limpia el input después de enviar
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-auto flex border-t-2 py-4 absolute bottom-0 w-11/12">
      <input
        type="text"
        className="flex-1 font-sans block text-sm leading-5 w-full py-2 px-3 border-2 border-slate-300 text-slate-500  shadow-sm focus:outline-none focus:ring focus:ring-slate-200 focus:border-slate-500 dark:text-slate-400 dark:placeholder:text-slate-600 dark:bg-slate-900 dark:border-slate-500 dark:focus:ring-slate-900 dark:focus:border-slate-600 "
        placeholder="Escribe un mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-6 w-6"
        >
          <path
            fill="#74C0FC"
            d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"
          />
        </svg>
      </button>
    </form>
  );
}

export default MessageInput;
