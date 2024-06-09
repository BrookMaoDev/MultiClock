import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Timer from "../components/timer";
import NotFound from "./not_found";

export default function Clock() {
  // Retrieving room code from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get("room");

  // Which order the player is in. Can range from 0 - (numPlayers - 1).
  const playerIndex = Number(sessionStorage.getItem("playerIndex"));
  const playerRoomCode = sessionStorage.getItem("playerRoomCode");

  // Endpoints for fetching room data
  const EXPRESS_API_ENDPOINT = process.env.REACT_APP_GET_ENDPOINT;
  const SOCKET_API_ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT;

  // State for storing room data
  const [roomData, setRoomData] = useState(null);

  // State for keeping track of the index of the player who has lost on time
  const [gameOver, setGameOver] = useState(false);

  // Socket.IO setup
  const [socket, setSocket] = useState(null);

  // Connects to socket
  function createSocket() {
    const socket = socketIOClient(SOCKET_API_ENDPOINT);
    setSocket(socket);

    // Emit an event to the server to join the Socket.IO room
    socket.emit("joinRoom", { roomCode: roomCode });

    // Room information has changed
    socket.on("update", ({ newData }) => {
      setRoomData(newData);
    });

    // Reset
    socket.on("reset", ({ newData }) => {
      setGameOver(false);
      setRoomData(newData);
    });

    // Someone has lost on time
    socket.on("gameOver", () => {
      setGameOver(true);
    });

    return () => {
      socket.disconnect();
    };
  }

  /**
   * Fetch room data from the server.
   * @param {string} roomCode Join code for the room of interest.
   * @returns {Object|boolean} Information about the room, or false if unsuccessful.
   */
  async function getRoomData(roomCode) {
    const outgoingData = { code: roomCode };

    try {
      const response = await fetch(EXPRESS_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outgoingData),
      });
      const data = await response.json();

      if (data.success) {
        return data.roomData;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      return false;
    }
  }

  // Fetch room data when roomCode changes
  useEffect(() => {
    async function fetchData() {
      const data = await getRoomData(roomCode);
      setRoomData(data);

      if (data) {
        createSocket();
      }
    }
    fetchData();
  }, [roomCode]);

  // Display message if room data is null or false
  if (roomData === null || roomData === false) {
    return <NotFound></NotFound>;
  }

  // Generate Timer components for each player
  const clocks = [];
  for (let i = 0; i < roomData.numPlayers; i++) {
    const playerName = roomData.players[i]
      ? roomData.players[i]
      : `Player ${i + 1}`;

    let timerState = "normal";
    if (roomData.currentTurnIndex == i) {
      timerState = gameOver ? "lost" : "timeRunning";
    }

    clocks.push(
      <Timer
        player={playerName}
        time={roomData.times ? roomData.times[i] : roomData.time * 60}
        socket={socket}
        index={i}
        room={roomCode}
        state={timerState}
        pressable={playerRoomCode == roomCode && !gameOver && i == playerIndex}
        key={i}
      />,
    );
  }

  const startClock = () => {
    socket.emit("start", { roomCode: roomData.code });
  };

  const pauseClock = () => {
    socket.emit("pause", { roomCode: roomData.code });
  };

  const resetClock = () => {
    if (gameOver) {
      socket.emit("reset", { roomCode: roomData.code });
    } else {
      const userConfirmed = window.confirm(
        "Are you sure you want to reset the clock?",
      );
      if (userConfirmed) {
        socket.emit("reset", { roomCode: roomData.code });
      }
    }
  };

  let options;
  if (playerRoomCode != roomCode) {
    options = null;
  } else if (gameOver) {
    options = (
      <div className="mt-1 flex w-full justify-center">
        <div className="grid w-full grid-cols-2 gap-1">
          <Link
            to="/"
            className="flex h-10 items-center justify-center rounded-lg bg-blue-900 text-white"
          >
            Leave
          </Link>
          <div
            className="flex h-10 items-center justify-center rounded-lg bg-blue-900 text-white"
            onClick={resetClock}
          >
            Reset
          </div>
        </div>
      </div>
    );
  } else if (roomData.active) {
    // Clocks are running, the option to pause should be shown
    options = (
      <div className="mt-1 flex w-full justify-center">
        <div className="grid w-full grid-cols-2 gap-1">
          <div
            className="flex h-10 items-center justify-center rounded-lg bg-blue-900 text-white"
            onClick={pauseClock}
          >
            Pause
          </div>
          <div
            className="flex h-10 items-center justify-center rounded-lg bg-blue-900 text-white"
            onClick={resetClock}
          >
            Reset
          </div>
        </div>
      </div>
    );
  } else {
    // Clocks are not running, the option to start should be shown
    options = (
      <div className="mt-1 flex w-full justify-center">
        <div className="grid w-full grid-cols-2 gap-1">
          <div
            className="flex h-10 items-center justify-center rounded-lg bg-blue-900 text-white"
            onClick={startClock}
          >
            Start
          </div>
          <div
            className="flex h-10 items-center justify-center rounded-lg bg-blue-900 text-white"
            onClick={resetClock}
          >
            Reset
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="clockPage"
      className="full bg-gradient-to-r from-slate-50 to-slate-200 px-1 pb-1"
    >
      <div className="mt-1 flex h-10 w-full items-center justify-center rounded-lg bg-blue-900 text-white">
        Moves: {roomData.moves || "0"}
      </div>
      {clocks}
      {options}
    </div>
  );
}
