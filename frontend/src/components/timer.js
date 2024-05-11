import React from "react";

export default function Timer({ player = `Player`, time = 0, increment = 0 }) {
    return (
        <div className="grid w-full grid-cols-2 grow mt-1 mx-1 bg-indigo-200 text-indigo-700 rounded-lg">
            <div className="flex items-center justify-center text-3xl">
                {player}
            </div>
            <div className="flex items-center justify-center text-3xl">
                {`${Math.floor(time / 60)}:${String(time % 60).padStart(
                    2,
                    "0"
                )}`}
            </div>
        </div>
    );
}
