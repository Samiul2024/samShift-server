require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpsg6ul.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db("samShiftDB"); // database name
        const parcelCollection = db.collection("parcels"); //collection
        // ✅ CREATE PARCEL (POST)
        app.post("/parcels", async (req, res) => {
            const parcel = req.body;

            if (!parcel) {
                return res.status(400).send({ message: "No parcel data provided" });
            }

            const result = await parcelCollection.insertOne(parcel);

            res.send({
                success: true,
                message: "Parcel saved to DB",
                insertedId: result.insertedId,
            });
        });

        // ✅ GET ALL PARCELS
        app.get("/parcels", async (req, res) => {
            const result = await parcelCollection.find().toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("🚀 SamShift Server is Running...");
});

// ✅ SAMPLE ROUTE (parcel)
app.get("/parcels", (req, res) => {
    res.send([]);
});

// ✅ START SERVER
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});