const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json()); // To parse incoming JSON

const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

const express_port = process.env.BACKEND_CONTAINER_PORT_EXPRESS;
const socket_port = process.env.BACKEND_CONTAINER_PORT_SOCKET;

// MongoDB connection setup
const mongoURL = process.env.MONGO_URL;
const client = new MongoClient(mongoURL);
const dbName = "rooms";
const collectionName = "rooms";
let collection;

async function connectMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        // Attempts to create the collection.
        // If the collection (and implicitly the database) doesn't exist, MongoDB will create them.
        await db.command({ create: collectionName });

        collection = db.collection(collectionName);
        console.log("Collection set up successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectMongoDB().catch((error) => {
    console.error("Error initializing MongoDB:", error);
});

/**
 * Fetches room data by join code.
 * @param {string} code Join code for desired room.
 * @returns {Object|null} Information about desired room.
 */
async function getRoomByCode(code) {
    try {
        return await collection.findOne({ code: code });
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

function startTimer(roomData, playerIndex) {
    const room = roomData;
    room.times = [];

    for (let i = 0; i < room.numPlayers; i++) {
        room.times.push(roomData.time * 60);
    }

    const timer = setInterval(() => {
        roomData.times[playerIndex]--;
        io.to(roomData.code).emit("update", { newData: room });
    }, 1000);
}

// Express routes

// Create a room
app.post("/create", async (req, res) => {
    try {
        const data = req.body;

        // Validate request body
        const requiredFields = ["code", "numPlayers", "time", "increment"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return res.status(400).json({
                    success: false,
                    message: "All form fields are required",
                });
            }
        }

        // Check if room with code already exists
        const existingRoom = await getRoomByCode(data.code);
        if (existingRoom) {
            return res.status(409).json({
                success: false,
                message: "Room with that join code already exists",
            });
        }

        // Create room
        data.players = [];
        await collection.insertOne(data);
        res.status(201).json({ success: true, message: "Room Created" });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

// Join a room
app.post("/join", async (req, res) => {
    try {
        const data = req.body;

        // Validate request body
        if (!data.code || !data.name) {
            return res.status(400).json({
                success: false,
                message: "All form fields are required",
            });
        }

        // Fetch room by code
        const room = await getRoomByCode(data.code);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room with that join code does not exist",
            });
        }

        // Check room capacity
        if (room.players.length >= room.numPlayers) {
            return res
                .status(403)
                .json({ success: false, message: "Room is full" });
        }

        // Add player to room
        const updatedDocument = await collection.findOneAndUpdate(
            { _id: room._id },
            { $push: { players: data.name } },
            { returnDocument: "after" }
        );

        // Send updated player list to all listening sockets
        io.to(data.code).emit("update", { newData: updatedDocument });

        // If room is filled, tell the frontend so that the game can start
        if (updatedDocument.players.length == updatedDocument.numPlayers) {
            startTimer(updatedDocument, 0);
        }

        res.status(200).json({ success: true, message: "Player Added" });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

// Get room data
app.post("/get", async (req, res) => {
    try {
        const data = req.body;
        const room = await getRoomByCode(data.code);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room with that join code does not exist",
            });
        }
        res.status(200).json({ success: true, roomData: room });
    } catch (error) {
        console.error("Error fetching room data:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

// Start Express server
app.listen(express_port, () => {
    console.log(`Express server listening on port ${express_port}`);
});

// Socket.IO setup

// Runs on new connections
io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);

    // User joined the clock page, not necessarily a player
    socket.on("joinRoom", ({ roomCode }) => {
        socket.join(roomCode);
        console.log(`Client ${socket.id} joined ${roomCode}`);
    });

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`);
    });
});

// Start Socket.IO server
server.listen(socket_port, () => {
    console.log(`Socket.IO server listening on port ${socket_port}`);
});
