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

/**
 * Deletes a room from the database.
 * @param {string} code Join code for desired room.
 * @returns {boolean} True if successful.
 */
async function deleteRoomByCode(code) {
  try {
    await collection.deleteOne({ code: code });
    return true;
  } catch (error) {
    console.error("Error deleting room data:", error);
    throw error;
  }
}

// Storage of rooms in live use
const rooms = {};

function subtractTime(roomCode) {
  const room = rooms[roomCode];

  room.times[room.currentTurnIndex]--;
  io.to(room.code).emit("update", { newData: room });

  // Somebody has lost on time
  if (room.times[room.currentTurnIndex] == 0) {
    stopTimer(roomCode);
    io.to(room.code).emit("gameOver");
  }
}

function startTimer(roomCode) {
  rooms[roomCode].active = true;
  subtractTime(roomCode);
  rooms[roomCode].timer = setInterval(() => {
    subtractTime(roomCode);
  }, 1000);
}

function stopTimer(roomCode) {
  const room = rooms[roomCode];
  if (room && room.timer) {
    clearInterval(room.timer);
    delete room.timer;
  }
}

function resetRoom(roomCode) {
  const room = rooms[roomCode];

  if (room) {
    room.times = new Array(Number(room.numPlayers)).fill(room.time * 60);
    room.currentTurnIndex = 0;
    room.active = false;
    room.moves = 0;
  }
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
    data.players = new Array(Number(data.numPlayers)).fill(null);
    data.numJoinedPlayers = 0;

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

// Called when user enters in room and name info, but not order
app.post("/prepare", async (req, res) => {
  try {
    const data = req.body;

    // Validate request body
    if (!data.code || !data.name) {
      return res.status(400).json({
        success: false,
        message: "All form fields are required",
      });
    }

    // Enforce username length limit
    if (data.name.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Username cannot be longer than 10 characters",
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
    if (room.numJoinedPlayers >= room.numPlayers) {
      return res.status(403).json({ success: false, message: "Room is full" });
    }

    res.status(200).json({
      success: true,
      message: "Correct Info",
    });
  } catch (error) {
    console.error("Error joining room:", error);
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
    if (!data.code || !data.name || !data.order) {
      return res.status(400).json({
        success: false,
        message: "All form fields are required",
      });
    }

    // Enforce username length limit
    if (data.name.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Username cannot be longer than 10 characters",
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
    if (room.numJoinedPlayers >= room.numPlayers) {
      return res.status(403).json({ success: false, message: "Room is full" });
    }

    // Check if the spot they want is still available
    if (room.players[data.order] != null) {
      return res.status(403).json({
        success: false,
        message: "Someone has already taken that spot",
      });
    }

    // Add player to room at specific position and increment numJoinedPlayers
    const updatedDocument = await collection.findOneAndUpdate(
      { _id: room._id },
      {
        $set: { [`players.${data.order}`]: data.name },
        $inc: { numJoinedPlayers: 1 },
      },
      { returnDocument: "after" },
    );

    // Send updated player list to all listening sockets
    io.to(updatedDocument.code).emit("update", {
      newData: updatedDocument,
    });

    // If room is filled, start the game
    if (updatedDocument.numJoinedPlayers == updatedDocument.numPlayers) {
      rooms[updatedDocument.code] = updatedDocument;
      resetRoom(updatedDocument.code);
    }

    res.status(200).json({
      success: true,
      message: "Player Added",
      playerIndex: data.order,
    });
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
  });

  socket.on("clockPressed", ({ roomCode, playerIndex }) => {
    const room = rooms[roomCode];

    if (room && room.currentTurnIndex == playerIndex) {
      stopTimer(roomCode);

      room.times[room.currentTurnIndex] += Number(room.increment);
      room.currentTurnIndex++;

      if (room.currentTurnIndex >= room.numPlayers) {
        room.moves++;
        room.currentTurnIndex = 0;
      }

      startTimer(roomCode);
    }
  });

  socket.on("start", ({ roomCode }) => {
    const room = rooms[roomCode];

    if (room) {
      stopTimer(roomCode);
      startTimer(roomCode);
    }
  });

  socket.on("pause", ({ roomCode }) => {
    stopTimer(roomCode);
    rooms[roomCode].active = false;
    io.to(roomCode).emit("update", { newData: rooms[roomCode] });
  });

  socket.on("reset", ({ roomCode }) => {
    const room = rooms[roomCode];

    if (room) {
      stopTimer(roomCode);
      resetRoom(roomCode);
      io.to(roomCode).emit("reset", { newData: rooms[roomCode] });
    }
  });

  socket.on("disconnecting", () => {
    console.log(`Client ${socket.id} disconnecting`);

    // Loop through rooms the user was in
    for (const value of socket.rooms) {
      const usersInRoom = io.sockets.adapter.rooms.get(value).size;

      // If room is empty (or about to be), and has been used, delete it from the server and database
      if (rooms[value] && Number(usersInRoom) <= 1) {
        delete rooms[value];
        deleteRoomByCode(value);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

// Start Socket.IO server
server.listen(socket_port, () => {
  console.log(`Socket.IO server listening on port ${socket_port}`);
});
