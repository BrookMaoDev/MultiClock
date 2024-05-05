import React, { useEffect, useState } from "react";
import Timer from "../components/timer";

export default function Clock() {
    // Retrieving room code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get("room");

    // Endpoint for fetching room data
    const API_ENDPOINT = process.env.REACT_APP_GET_ENDPOINT;

    // State for storing room data
    const [roomData, setRoomData] = useState(null);

    /**
     * Fetch room data from the server.
     * @param {string} roomCode Join code for the room of interest.
     * @returns {Object|boolean} Information about the room, or false if unsuccessful.
     */
    async function getRoomData(roomCode) {
        const outgoingData = { code: roomCode };

        try {
            const response = await fetch(API_ENDPOINT, {
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
        }
        fetchData();
    }, [roomCode]);

    // Display message if room data is null or false
    if (roomData === null || roomData === false) {
        return <h1 className="text-3xl">Could not join room</h1>;
    }

    // Generate Timer components for each player
    const clocks = [];
    for (let i = 0; i < roomData.numPlayers; i++) {
        const playerName = roomData.players[i]
            ? roomData.players[i]
            : `Player ${i + 1}`;
        clocks.push(
            <Timer
                player={playerName}
                time={roomData.time}
                increment={roomData.increment}
                key={i}
            />
        );
    }

    return (
        <div id="clockPage" className="full pb-1 px-1">
            {clocks}
        </div>
    );
}
