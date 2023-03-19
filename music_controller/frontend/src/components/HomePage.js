import React, { useEffect, useState } from 'react'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import Room from './Room'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './Home'

const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);

  CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };

  useEffect(() => {
    const request = async () => {
      const response = await fetch("/api/user-in-room");
      const data = await response.json();
      setRoomCode(data.code);
      console.log(data.code)
    };

    request()
  }, [])

  function clearRoomCode() {
    setRoomCode(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home roomCode={roomCode}/>} />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room leaveRoomCallback={clearRoomCode} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default HomePage