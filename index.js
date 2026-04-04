const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const admin = require("firebase-admin");

// load environment variables from .env file
require("dotenv").config();

const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);

const app = express();
const port = process.env.PORT || 5000;

//  MIDDLEWARE
app.use(cors());
app.use(express.json());



const serviceAccount = require("./firebase-admin-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


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
        const usersCollection = db.collection('users');
        const parcelCollection = db.collection("parcels"); //collection
        const paymentsCollection = db.collection('payments');
        const trackingCollection = db.collection('tracking');


        // custom middlewares
        const verifyFBToken = async (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send({ message: 'Unauthorized access' })
            }
            // console.log('header in middleware', req.headers)
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).send({ message: 'Unauthorized access' })

            }

            //verify the token
            try {
                const decoded = await admin.auth().verifyIdToken(token);
                req.decoded = decoded;
                next();
            } catch (error) {
                return res.status(401).send({ message: 'Forbidden access' })
            }



        }


        app.post('/users', async (req, res) => {
            const email = req.body.email;
            const userExists = await usersCollection.findOne({ email });
            if (userExists) {
                //update last log in info
                return res.send({
                    inserted: false,
                    message: "User already exists"
                });
            }
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);

        })

        // parcels api
        // GET: All parcels or  parcels by user (created_by), sorted by latest 
        app.get("/parcels", verifyFBToken, async (req, res) => {
            try {
                const userEmail = req.query.email;

                // 🔍 If email exists → filter, else → get all
                const query = userEmail ? { created_by: userEmail } : {};
                const options = {
                    sort: { creation_date: -1 }, // newest first
                };

                const parcels = await parcelCollection
                    .find(query, options)
                    .toArray();
                res.send(parcels);
            } catch (error) {
                console.error('error fetching parcels:', error);
                res.status(500).send({ message: "Failed to fetch parcels" });
            }
        });


        app.get('/parcels/:id', async (req, res) => {
            try {
                const id = req.params.id;

                const parcel = await parcelCollection.findOne({
                    _id: new ObjectId(id)
                });

                if (!parcel) {
                    return res.status(404).send({
                        message: "Parcel not found"
                    });

                }
                res.send(parcel);
            } catch (error) {
                console.error('Error fetching parcel:', error);
                res.status(500).send({ message: 'failed to fetch parcel' });

            }
        });

        //POST:  CREATE a new  PARCEL (POST)
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


        const { ObjectId } = require("mongodb");

        // DELETE: Delete a parcel
        app.delete("/parcels/:id", async (req, res) => {
            try {
                const id = req.params.id;

                const result = await parcelCollection.deleteOne({
                    _id: new ObjectId(id),
                });

                if (result.deletedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Parcel not found",
                    });
                }

                res.send({
                    success: true,
                    message: "Parcel deleted successfully",
                    deletedCount: result.deletedCount,
                });
            } catch (error) {
                console.error("Delete error:", error);
                res.status(500).send({
                    success: false,
                    message: "Failed to delete parcel",
                });
            }
        });


        // tracking
        app.post("/tracking", async (req, res) => {
            try {
                const trackingData = req.body;

                const result = await trackingCollection.insertOne({
                    ...trackingData,
                    created_at: new Date(),
                });

                res.send({
                    success: true,
                    message: "Tracking updated",
                    insertedId: result.insertedId,
                });

            } catch (error) {
                console.error("Tracking error:", error);
                res.status(500).send({
                    message: "Failed to add tracking update",
                });
            }
        });


        // api to get tracking history

        app.get("/tracking/:tracking_id", async (req, res) => {
            try {
                const tracking_id = req.params.tracking_id;

                const updates = await trackingCollection
                    .find({ tracking_id })
                    .sort({ created_at: -1 }) // latest first
                    .toArray();

                res.send(updates);

            } catch (error) {
                console.error("Fetch tracking error:", error);
                res.status(500).send({
                    message: "Failed to fetch tracking",
                });
            }
        });


        //payments


        app.get("/payments", verifyFBToken, async (req, res) => {
            // console.log('headers in payments', req.headers);

            try {
                const email = req.query.email;

                const query = email ? { email } : {};

                const payments = await paymentsCollection
                    .find(query)
                    .sort({ paid_at: -1 }) // latest first
                    .toArray();

                res.send(payments);

            } catch (error) {
                console.error("Fetch payments error:", error);
                res.status(500).send({
                    message: "Failed to fetch payments",
                });
            }
        });


        //POST : Record Payment and update parcel status
        // POST : Record Payment + Update Parcel + Add Tracking
        app.post("/payments", async (req, res) => {
            try {
                const paymentData = req.body;

                const {
                    parcelId,
                    email,
                    amount,
                    paymentMethod,
                    transactionId,
                    tracking_id, // 🔥 IMPORTANT
                } = paymentData;

                // 1️⃣ Update parcel
                const updateResult = await parcelCollection.updateOne(
                    { _id: new ObjectId(parcelId) },
                    {
                        $set: {
                            payment_status: "paid",
                            transaction_id: transactionId,
                        },
                    }
                );

                if (updateResult.modifiedCount === 0) {
                    return res.status(404).send({
                        message: "Parcel not found or already paid",
                    });
                }

                // 2️⃣ Save payment history
                const paymentDoc = {
                    parcelId,
                    email,
                    amount,
                    paymentMethod,
                    transactionId,
                    tracking_id,
                    paid_at_string: new Date().toISOString(),
                    paid_at: new Date(),
                };

                const insertResult = await paymentsCollection.insertOne(paymentDoc);

                // 3️⃣ 🔥 INSERT INITIAL TRACKING
                await trackingCollection.insertOne({
                    tracking_id,
                    status: "Parcel Confirmed",
                    message: "Your parcel has been confirmed after payment",
                    location: "Origin Center",
                    created_at: new Date(),
                });

                res.send({
                    success: true,
                    message: "Payment recorded & tracking started",
                    insertedId: insertResult.insertedId,
                });

            } catch (error) {
                console.error("Payment error:", error);
                res.status(500).send({
                    success: false,
                    message: "Failed to process payment",
                });
            }
        });



        app.post('/create-payment-intent', async (req, res) => {
            const amountInCents = req.body.amountInCents

            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amountInCents, // Amount in cents
                    currency: 'usd',
                    payment_method_types: ["card"],
                });

                res.json({ clientSecret: paymentIntent.client_secret });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
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



//  TEST ROUTE
app.get("/", (req, res) => {
    res.send("🚀 SamShift Server is Running...");
});


//  START SERVER
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});