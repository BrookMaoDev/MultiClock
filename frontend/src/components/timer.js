import React from "react";

export default function Timer({ player = `Player`, time = 0, increment = 0 }) {
    return (
        <div className="grid w-full grid-cols-2 grow mt-1 mx-1 bg-indigo-200 rounded-lg">
            <div className="flex items-center justify-center">{player}</div>
            <div className="flex items-center justify-center">{time}</div>
        </div>
    );
}
