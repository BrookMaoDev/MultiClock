import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import Msg from "../components/flash-msg";
import NotFound from "./not_found";

export default function Order() {
  const API_JOIN_ENDPOINT = process.env.REACT_APP_JOIN_ENDPOINT;
  const API_GET_ENDPOINT = process.env.REACT_APP_GET_ENDPOINT;
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get("room");
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getRoomData(roomCode);
      setRoomData(data);
    }

    fetchData();
  }, [roomCode]);

  let uniqueFlashMsgKey = 0; // Unique key for flash messages

  if (roomData == null) {
    return <NotFound></NotFound>;
  }

  /**
   * Fetch room data from the server.
   * @param {string} roomCode Join code for the room of interest.
   * @returns {Object|boolean} Information about the room, or false if unsuccessful.
   */
  async function getRoomData(roomCode) {
    const outgoingData = { code: roomCode };

    try {
      const response = await fetch(API_GET_ENDPOINT, {
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

  /**
   * Sends a post request to the server. Function should be called upon form submission.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Package form data as a JSON
      const outgoingData = {
        code: roomCode,
        name: urlParams.get("name"),
        order: document.getElementById("order").value,
      };

      // Makes the API call
      const response = await fetch(API_JOIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outgoingData),
      });
      const data = await response.json();

      if (data.success) {
        // Redirect to game
        sessionStorage.setItem("playerIndex", data.playerIndex);
        sessionStorage.setItem("playerRoomCode", roomCode);
        navigate(`/clock?room=${roomCode}`);
      } else {
        if (data.message == "Someone has already taken that spot") {
          const newData = await getRoomData(roomCode);
          setRoomData(newData);
        }

        ReactDOM.render(
          <Msg
            message={data.message}
            success={false}
            key={uniqueFlashMsgKey}
          ></Msg>,
          document.getElementById("flashMsg"),
        );
        uniqueFlashMsgKey++;
        return;
      }
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };

  const options = [];

  for (let i = 0; i < roomData.numPlayers; i++) {
    if (roomData.players[i] == null) {
      options.push(
        <option value={i} key={i} id={`option${i}`}>
          {i + 1}
        </option>,
      );
    }
  }

  return (
    <div
      id="orderPage"
      className="full bg-gradient-to-r from-slate-50 to-slate-200 px-1 pb-1"
    >
      <div id="flashMsg" className="absolute left-0 top-0 h-12 w-full"></div>
      <h1 className="m-2 text-center text-xl">
        This room accommodates {roomData.numPlayers} players
      </h1>
      <h1 className="m-2 text-center text-xl">
        {roomData.numJoinedPlayers} have already joined
      </h1>
      <h1 className="m-2 text-center text-xl">
        Please select what order you would like to join in
      </h1>
      <form onSubmit={handleSubmit} className="mt-6">
        <select
          name="order"
          id="order"
          className="mb-4 block w-full rounded-lg border-2 border-gray-200 border-transparent px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500"
          data-rounded="rounded-lg"
          data-primary="blue-500"
        >
          {options}
        </select>
        <div className="mt-8 flex justify-center space-x-3">
          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-700"
            data-primary="indigo-600"
            data-rounded="rounded-md"
          >
            Join Game
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-5 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200"
            data-primary="indigo-600"
            data-rounded="rounded-md"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
