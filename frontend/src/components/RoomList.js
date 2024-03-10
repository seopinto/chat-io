function RoomList({ rooms, setCurrentRoom }) {
    return (
      <div>
        {rooms.map(room => (
          <div key={room.id} onClick={() => setCurrentRoom(room)}>
            {room.name}
          </div>
        ))}
      </div>
    );
  }