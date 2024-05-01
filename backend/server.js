const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.BACKEND_CONTAINER_PORT;

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON

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

// Routes

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
        await collection.updateOne(
            { _id: room._id },
            { $push: { players: data.name } }
        );
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

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
