const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Global token and expiry variables
let accessToken = "";
let tokenExpiry = 0;

// Fetch Access Token
const fetchAccessToken = async () => {
    try {
        const response = await axios.post(
            "https://api.petfinder.com/v2/oauth2/token",
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.PETFINDER_API_KEY,
                client_secret: process.env.PETFINDER_API_SECRET,
            })
        );

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000; // Token expiry in ms
        console.log("Access token fetched successfully:", accessToken);
    } catch (error) {
        console.error("Error fetching access token:", error.response?.data || error.message);
    }
};

// Middleware to Ensure Access Token
const ensureAccessToken = async (req, res, next) => {
    if (!accessToken || Date.now() >= tokenExpiry) {
        await fetchAccessToken();
    }
    next();
};

// Serve index.html on root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Apply Middleware to API Routes
app.use("/api", ensureAccessToken);

// Fetch Animals API Route
app.get("/api/animals", async (req, res) => {
  const { location, type, breed, age, size, page = 1 } = req.query;

  if (!location) {
      return res.status(400).json({ error: "Location is required." });
  }

  try {
      const params = {
          location,
          type,
          breed: breed || undefined, // Include only if provided
          age: age || undefined,     // Include only if provided
          size: size || undefined,   // Include only if provided
          limit: 10,
          page,
      };

      const response = await axios.get("https://api.petfinder.com/v2/animals", {
          headers: { Authorization: `Bearer ${accessToken}` },
          params,
      });

      res.json(response.data);
  } catch (error) {
      console.error("Error fetching animals:", error.response?.data || error.message);
      res.status(500).json({ error: "Error fetching animals from the API." });
  }
});

app.get("/api/breeds", async (req, res) => {
  const { type } = req.query;

  if (!type) {
      return res.status(400).json({ error: "Type is required." });
  }

  try {
      const response = await axios.get(`https://api.petfinder.com/v2/types/${type}/breeds`, {
          headers: { Authorization: `Bearer ${accessToken}` },
      });
      res.json(response.data);
  } catch (error) {
      console.error("Error fetching breeds:", error.response?.data || error.message);
      res.status(500).json({ error: "Error fetching breeds from the API." });
  }
});



// Fetch Animal by ID API Route
app.get("/api/animals/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`https://api.petfinder.com/v2/animals/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching animal details:", error.response?.data || error.message);
        res.status(500).json({ error: "Error fetching animal details" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
