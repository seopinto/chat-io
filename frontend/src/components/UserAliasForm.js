import React, { useState, useEffect, useRef } from "react";
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

function UserAliasForm({ onAliasSubmit }) {
  const [alias, setAlias] = useState("");
  const inputRef = useRef(null);
  const [avatarSvg, setAvatarSvg] = useState('');

  useEffect(() => {
    inputRef.current.focus();
    setAvatarSvg(createAvatar(style, { seed: `user-${Math.random()}` }));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!alias.trim()) return;
    onAliasSubmit(alias);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-cyan-700 to-gray-800">
      <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg w-2/3 sm:w-1/2 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div
          className="w-24 h-24 mb-4 rounded-full"
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />
        <label className="block w-full">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
            Ingresar
          </span>
          <input
            ref={inputRef}
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            name="alias"
            aria-label="Escribe tu nick" 
            className="mt-1 px-5 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            placeholder="Escribe tu nick" />
        </label>
        <button
          className="py-4 px-3 mt-4 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-md shadow focus:outline-none"
          type="submit"
        >
          Ingresar al chat
        </button>
      </form>
    </div>
  );
}

export default UserAliasForm;