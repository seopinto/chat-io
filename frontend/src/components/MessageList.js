function MessageList({ messages, currentUserId }) {
  return (
    <div className='w-full'>
      <h2 className="text-lg font-bold">Chat</h2>
      <ul>
        {messages.map((message, index) => {
          // Crear un objeto Date a partir del timestamp del mensaje
          const messageDate = new Date(message.timestamp);
          
          // Obtener los componentes de la fecha y la hora
          const date = messageDate.toLocaleDateString();
          const time = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

          // Determinar si el mensaje fue enviado por el usuario actual
          const isMessageFromCurrentUser = message.senderId === currentUserId;

          return (
            <li key={index} className={`flex flex-col ${isMessageFromCurrentUser ? 'items-end' : 'items-start'}`}>
            <div className={`break-words p-2 rounded-lg ${isMessageFromCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {!isMessageFromCurrentUser && <strong>{message.alias}:</strong>} {message.text}
            </div>
            <span className={`text-xs text-gray-400`}>
              {date} {time}
            </span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}


export default MessageList;