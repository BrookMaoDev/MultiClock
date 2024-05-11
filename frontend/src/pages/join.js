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
                navigate(`/clock?room=${outgoingData.code}`);
            } else {
                ReactDOM.render(
                    <Msg
                        message={data.message}
                        success={false}
                        key={uniqueFlashMsgKey}
                    ></Msg>,
                    document.getElementById("flashMsg")
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
            <div id="flashMsg" className="absolute w-full top-0 left-0 h-12">
                {roomCreatedMessage && (
                    <Msg message={roomCreatedMessage} success={true}></Msg>
                )}
            </div>
            <h3 className="mb-6 text-2xl font-medium text-center">Join Game</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="code"
                    id="code"
                    className="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                    placeholder="Join Code"
                />
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                    placeholder="Name"
                />
                <div className="flex justify-center mt-8 space-x-3">
                    <button className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow hover:bg-indigo-700">
                        Join Game
                    </button>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
