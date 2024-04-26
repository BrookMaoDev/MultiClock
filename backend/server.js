const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // To parse incoming JSON

// Set up connection with database
const mongoURL = "mongodb://mongo:27017";
const dbName = "rooms";
const collectionName = "rooms";
const client = new MongoClient(mongoURL);
let collection;

async function connectMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

async function setupCollection() {
    try {
        const db = client.db(dbName);
        collection = db.collection(collectionName);
        console.log("Collection set up successfully");
    } catch (error) {
        console.error("Error setting up collection:", error);
    }
}

connectMongoDB()
    .then(setupCollection)
    .catch((error) => {
        console.error("Error initializing MongoDB:", error);
    });

// Incoming request to create a room
app.post("/create", async (req, res) => {
    const data = req.body;
    console.log(data);
    const result = await collection.insertOne(data);
    res.json({ message: "Room Created", id: result.insertedId });
});

// Tells our server to listen for requests
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
