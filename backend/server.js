require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Claude API proxy endpoint
app.post("/api/claude", async (req, res) => {
  try {
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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Claude API configuration:");
  console.log("- Model:", process.env.CLAUDE_MODEL);
  console.log("- API URL:", process.env.CLAUDE_API_URL);
  console.log("- API Version:", process.env.ANTHROPIC_VERSION);
});
