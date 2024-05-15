import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import needed pages
import Home from "./pages/home";
import Create from "./pages/create";
import Join from "./pages/join";
import Clock from "./pages/clock";
import NotFound from "./pages/not_found";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/join" element={<Join />} />
        <Route path="/clock" element={<Clock />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root"),
);
