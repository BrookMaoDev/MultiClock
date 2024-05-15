import React from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import Msg from "../components/flash-msg";

export default function Create() {
  const API_ENDPOINT = process.env.REACT_APP_CREATE_ENDPOINT; // Where the server is located
  const navigate = useNavigate();
  let uniqueFlashMsgKey = 0;

  /**
   * Sends a post request to the server. Function should be called upon form submission.
   * @param {Event} event The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default GET request

    try {
      // Package form data as a JSON
      const outgoingData = {
        code: document.getElementById("code").value,
        numPlayers: document.getElementById("players").value,
        time: document.getElementById("time").value,
        increment: document.getElementById("increment").value,
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
        // Redirect to join page
        sessionStorage.setItem("roomCreated", true);
        navigate(`/join`);
      } else {
        ReactDOM.render(
          <Msg
            message={data.message}
            success={false}
            key={uniqueFlashMsgKey}
          />,
          document.getElementById("flashMsg"),
        );
        uniqueFlashMsgKey++;
        return;
      }
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };

  return (
    <div
      id="createPage"
      className="full flex bg-gradient-to-r from-slate-50 to-slate-200"
    >
      <div id="flashMsg" className="absolute left-0 top-0 h-12 w-full"></div>
      <h3 className="mb-6 text-center text-2xl font-medium">Create Game</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="code"
          id="code"
          className="mb-4 block w-full rounded-lg border-2 border-gray-200 border-transparent px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500"
          data-rounded="rounded-lg"
          data-primary="blue-500"
          placeholder="Join Code"
        />
        <select
          name="players"
          id="players"
          className="mb-4 block w-full rounded-lg border-2 border-gray-200 border-transparent px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500"
          data-rounded="rounded-lg"
          data-primary="blue-500"
        >
          <option value="" disabled selected hidden>
            Players
          </option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <div className="flex justify-center space-x-3">
          <select
            name="time"
            id="time"
            className="mb-4 block w-full rounded-lg border-2 border-gray-200 border-transparent px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500"
            data-rounded="rounded-lg"
            data-primary="blue-500"
          >
            <option value="" disabled selected hidden>
              Time
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
            <option value="90">90</option>
            <option value="120">120</option>
            <option value="150">150</option>
            <option value="180">180</option>
          </select>
          <select
            name="increment"
            id="increment"
            className="mb-4 block w-full rounded-lg border-2 border-gray-200 border-transparent px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500"
            data-rounded="rounded-lg"
            data-primary="blue-500"
          >
            <option value="" disabled selected hidden>
              Increment
            </option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
            <option value="90">90</option>
            <option value="120">120</option>
            <option value="150">150</option>
            <option value="180">180</option>
          </select>
        </div>
        <div className="mt-4 flex justify-center space-x-3">
          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-700"
            data-primary="indigo-600"
            data-rounded="rounded-md"
          >
            Create Game
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
