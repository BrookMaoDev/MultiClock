import React from "react";

/**
 * @param {string} player Player name
 * @param {number} time Time they have left in seconds
 * @param {socket} socket Socket to emit to
 * @param {number} index Order they are in
 * @param {string} room Game room this clock belongs to
 * @param {string} state Impacts display of clock
 * @param {boolean} pressable Whether or not the user can press the clock
 * @returns A single game clock for a single player
 */
export default function Timer({
  player = "",
  time = 0,
  socket = null,
  index = 0,
  room = null,
  state = "normal",
  pressable = false,
}) {
  function handleClick() {
    if (socket && pressable) {
      socket.emit("clockPressed", { roomCode: room, playerIndex: index });
    }
  }

  let colorScheme;
  let timeDisplay;

  switch (state) {
    case "lost":
      colorScheme = "text-white bg-red-500";
      timeDisplay = "LOST ON TIME";
      break;
    case "timeRunning":
      colorScheme = "text-white bg-indigo-600";
      timeDisplay = `${Math.floor(time / 60)}:${String(time % 60).padStart(
        2,
        "0",
      )}`;
      break;
    default:
      colorScheme = "text-indigo-700 bg-indigo-100";
      timeDisplay = `${Math.floor(time / 60)}:${String(time % 60).padStart(
        2,
        "0",
      )}`;
      break;
  }

  return (
    <div
      className={`mx-1 mt-1 grid w-full grow grid-cols-2 ${colorScheme} rounded-lg`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center text-3xl">{player}</div>
      <div className="flex items-center justify-center text-3xl">
        {timeDisplay}
      </div>
    </div>
  );
}
