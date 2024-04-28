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

/**
 * @param {string} code Join code for desired room
 * @returns {json|null} Information about desired room
 */
async function getRoomByCode(code) {
    try {
        const result = await collection.findOne({ code: `${code}` });
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Incoming request to create a room
app.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const room = await getRoomByCode(data.code);

        if (room != null) {
            res.json({ message: "Room with join code already exists" });
            return;
        }

        const result = await collection.insertOne(data);
        res.json({ message: "Room Created", id: result.insertedId });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Tells our server to listen for requests
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
