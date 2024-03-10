import React from 'react';

function ConnectedUsers({ users, onSelectUser, currentUserId, userAlias, newMessagesFromUsers }) {

  return (
    <div className="w-2/4 p-4 overflow-y-auto bg-gray-200 h-screen">
      <h2 className="text-lg font-extrabold text-center">
        Bienvenido, {userAlias || 'Usuario'} {/* Muestra el alias del usuario logueado */}
      </h2>
      <ul role="list" className='divide-y divide-gray-400'>
        {users.map((user) => {
          // Asegúrate de no incluir al usuario actual en la lista
          if(user.id === currentUserId) return null;
          const initial = typeof user.alias === 'string' && user.alias.length > 0 ? user.alias.charAt(0).toUpperCase() : "?";
          const hasNewMessage = newMessagesFromUsers && newMessagesFromUsers[user.id];
          return (
            <li
            key={user.id}
            className={`py-2 px-4 hover:bg-gray-300 flex items-center cursor-pointer ${
              hasNewMessage ? 'bg-cyan-300' : ''
            }`}
    onClick={() => onSelectUser(user)}
  >
              <div className="w-10 h-10 rounded-full mr-4 flex-shrink-0 flex items-center justify-center bg-blue-500 text-white font-bold">
                {initial}
              </div>
              <span className="flex-grow">{user.alias || 'Unknown'}</span>
    {hasNewMessage && <span className="text-xs text-green-500 ml-2">Nuevo mensaje</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ConnectedUsers;