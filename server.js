const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "envfile"),
});

const app = express();
const port = process.env.PORT || 5000;
// const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Serve static files
app.use(express.static(path.join(__dirname, ".")));

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = process.env.TABLE_NAME;

// Airtable API URL
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Discover API key
const DISCOVER_API_KEY = process.env.DISCOVER_API_KEY;

// console.log("AIRTABLE_API_KEY:", AIRTABLE_API_KEY);
// console.log("BASE_ID:", BASE_ID);
// console.log("TABLE_NAME:", TABLE_NAME);
// console.log("DISCOVER_API_KEY:", DISCOVER_API_KEY);

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await axios.get(AIRTABLE_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      params: {
        filterByFormula: `AND({Username} = '${username}', {Password} = '${password}')`,
      },
    });

    if (response.data.records.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("Error request:", error.request);
      res.status(500).json({ error: "No response received from the server" });
    } else {
      console.error("Error message:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

// Search Route
app.get("/search", async (req, res) => {
  console.log("Search request received with query parameters:", req.query);
  console.log("Headers:", { "x-discolike-key": DISCOVER_API_KEY });

  try {
    const response = await axios.get("https://api.discolike.com/v1/discover", {
      params: req.query,
      headers: {
        "x-discolike-key": DISCOVER_API_KEY,
      },
    });
    console.log("API Response data:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("Error request:", error.request);
      res.status(500).json({ error: "No response received from the server" });
    } else {
      console.error("Error message:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

// Serve the login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "index.html"));
});

// Serve the home page
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "home_page.html"));
});

app.listen(5000, () => {
  console.log(`Server running at http://localhost:${port}`);
});