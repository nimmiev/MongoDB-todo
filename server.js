require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

// Define Schema and Model
const dataSchema = new mongoose.Schema({
  content: { type: String, required: true },
});

const Data = mongoose.model("Data", dataSchema);

// Routes
app.route("/")
  // GET: Fetch all documents
  .get(async (req, res) => {
    try {
      const allData = await Data.find();
      res.status(200).json({ message: "All saved data", data: allData });
    } catch (err) {
      res.status(500).json({ message: "Error fetching data", error: err });
    }
  })

  // POST: Save a document
  .post(async (req, res) => {
    try {
      const newData = new Data({ content: req.body.content });
      await newData.save();
      res.status(201).json({ message: "Data saved successfully", data: newData });
    } catch (err) {
      res.status(500).json({ message: "Error saving data", error: err });
    }
  })

  // PUT: Respond with a generic message
  .put((req, res) => {
    res.status(200).send("Response for PUT request");
  })

  // DELETE: Respond with a generic message
  .delete((req, res) => {
    res.status(200).send("Response for DELETE request");
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
