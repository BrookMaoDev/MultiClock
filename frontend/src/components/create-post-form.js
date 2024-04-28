import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Form() {
    const API_ENDPOINT = "http://localhost:4000/create"; // Where the server is located
    const navigate = useNavigate();

    /**
     * @description Sends a post request to the server. Function should be called upon form submission.
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

            // Ensure all fields are filled
            for (const key in outgoingData) {
                if (outgoingData[key] == "") {
                    alert("All fields are required");
                    return;
                }
            }

            // Makes the API call
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(outgoingData),
            });
            const data = await response.json();

            if (data.message == "Room Created") {
                // Redirect to join page
                sessionStorage.setItem("roomCreated", true);
                navigate(`/join?code=${outgoingData.code}`);
            } else {
                alert(`${data.message}`);
                return;
            }
        } catch (error) {
            console.error("Error making API request:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="code"
                id="code"
                class="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                data-rounded="rounded-lg"
                data-primary="blue-500"
                placeholder="Join Code"
            />
            <select
                name="players"
                id="players"
                class="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
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
            <div class="flex justify-center space-x-3">
                <select
                    name="time"
                    id="time"
                    class="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
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
                    class="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
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
            <div class="flex justify-center mt-4 space-x-3">
                <button
                    class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow hover:bg-indigo-700"
                    data-primary="indigo-600"
                    data-rounded="rounded-md"
                >
                    Create Game
                </button>
                <Link
                    to="/"
                    class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200"
                    data-primary="indigo-600"
                    data-rounded="rounded-md"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
