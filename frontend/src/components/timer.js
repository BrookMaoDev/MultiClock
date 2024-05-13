import React from "react";

export default function Timer({
    player = "",
    time = 0,
    increment = 0,
    socket = null,
    index = 0,
    room = null,
    state = "normal",
}) {
    function handleClick() {
        if (socket) {
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
            timeDisplay = `${Math.floor(time / 60)}:${String(
                time % 60
            ).padStart(2, "0")}`;
            break;
        default:
            colorScheme = "text-indigo-700 bg-indigo-100";
            timeDisplay = `${Math.floor(time / 60)}:${String(
                time % 60
            ).padStart(2, "0")}`;
            break;
    }

    return (
        <div
            className={`grid w-full grid-cols-2 grow mt-1 mx-1 ${colorScheme} rounded-lg`}
            onClick={handleClick}
        >
            <div className="flex items-center justify-center text-3xl">
                {player}
            </div>
            <div className="flex items-center justify-center text-3xl">
                {timeDisplay}
            </div>
        </div>
    );
}
