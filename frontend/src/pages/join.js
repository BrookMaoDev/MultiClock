import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import Msg from "../components/flash-msg";

export default function Join() {
  const API_ENDPOINT = process.env.REACT_APP_JOIN_ENDPOINT; // API endpoint for joining a game
  const navigate = useNavigate(); // Navigation hook
  const roomCreatedMessage = sessionStorage.getItem("roomCreated")
    ? "Game Successfully Created"
    : ""; // Message indicating successful game creation
  let uniqueFlashMsgKey = 0; // Unique key for flash messages

  /**
   * Sends a post request to the server. Function should be called upon form submission.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Package form data as a JSON
      const outgoingData = {
        code: document.getElementById("code").value,
        name: document.getElementById("name").value,
      };

      // Makes the API call
      const response = await fetch(API_ENDPOINT, {
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
        navigate(`/clock?room=${outgoingData.code}`);
      } else {
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

  useEffect(() => {
    sessionStorage.removeItem("roomCreated");
  });

  return (
    <div
      id="joinPage"
      className="full flex bg-gradient-to-r from-slate-50 to-slate-200"
    >
      <div id="flashMsg" className="absolute left-0 top-0 h-12 w-full">
        {roomCreatedMessage && (
          <Msg message={roomCreatedMessage} success={true}></Msg>
        )}
      </div>
      <h3 className="mb-6 text-center text-2xl font-medium">Join Game</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="code"
          id="code"
          className="mb-4 block w-full rounded-lg border-2 border-gray-200 border-transparent px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Join Code"
        />
        <input
          type="text"
          name="name"
          id="name"
          className="mb-4 block w-full rounded-lg border-2 border-gray-200 border-transparent px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Name"
        />
        <div className="mt-8 flex justify-center space-x-3">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-700">
            Join Game
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-5 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
