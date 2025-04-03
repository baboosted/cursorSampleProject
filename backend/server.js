require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Claude API proxy endpoint
app.post("/api/claude", async (req, res) => {
  try {
    console.log("Received Claude API request");
    const { messages, system } = req.body;

    console.log(
      "Making Claude API request with model:",
      process.env.CLAUDE_MODEL
    );
    console.log("API URL:", process.env.CLAUDE_API_URL);

    const response = await fetch(process.env.CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": process.env.ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL,
        messages,
        system,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("Claude API response:", data);
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  // Function to try starting the server on a given port
  const startServer = (port) => {
    try {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });

      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`Port ${port} is busy, trying port ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error("Server error:", err);
        }
      });
    } catch (err) {
      console.error("Failed to start server:", err);
    }
  };

  // Start the server with the initial port
  startServer(port);
}

// For Vercel serverless functions
module.exports = app;
