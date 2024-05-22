import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      id="homePage"
      className="full mx-auto bg-gradient-to-r from-slate-50 to-slate-200 px-4 text-center sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl xl:text-6xl">
        MultiClock
      </h2>
      <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
        Multiplayer Game Timer
      </p>
      <div className="mt-8 flex justify-center space-x-3">
        <Link
          to="/create"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-700"
        >
          Create Game
        </Link>
        <Link
          to="/join"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-5 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200"
        >
          Join Game
        </Link>
      </div>
      <div className="absolute bottom-0 flex h-8 justify-center text-center text-sm">
        View the source code and usage instructions on&nbsp;{" "}
        <a
          href="https://github.com/BrookMaoDev/MultiClock"
          className="text-blue-600 underline"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
