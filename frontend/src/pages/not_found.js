import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="full">
      <h1 className="m-2 text-6xl">WHOOPS!</h1>
      <h1 className="m-2 text-center">
        This page does not exist. Click{" "}
        <Link to="/" className="text-blue-600 underline">
          here
        </Link>{" "}
        to return to homepage.
      </h1>
    </div>
  );
}
