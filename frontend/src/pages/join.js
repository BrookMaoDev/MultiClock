import React from "react";
import { Link } from "react-router-dom";

export default function Join() {
    return (
        <div>
            <h3 class="mb-6 text-2xl font-medium text-center">Join Game</h3>
            <form>
                <input
                    type="text"
                    name="code"
                    id="code"
                    class="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                    data-rounded="rounded-lg"
                    data-primary="blue-500"
                    placeholder="Join Code"
                />
                <input
                    type="text"
                    name="name"
                    id="name"
                    class="block w-full px-4 py-3 mb-4 border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                    data-rounded="rounded-lg"
                    data-primary="blue-500"
                    placeholder="Name"
                />
                <div class="flex justify-center mt-8 space-x-3">
                    <button
                        class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow hover:bg-indigo-700"
                        data-primary="indigo-600"
                        data-rounded="rounded-md"
                    >
                        Join Game
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
        </div>
    );
}
