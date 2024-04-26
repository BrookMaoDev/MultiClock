import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import needed pages
import Home from "./pages/home";
import Create from "./pages/create";
import Join from "./pages/join";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/join" element={<Join />} />
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);
