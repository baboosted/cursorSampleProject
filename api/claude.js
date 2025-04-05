const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    // Get API key and model from environment variables or use defaults
    const apiKey =
      process.env.CLAUDE_API_KEY || process.env.REACT_APP_CLAUDE_API_KEY;

    // Use the model from environment variable or default to claude-3-sonnet
    // Remove any date suffix (like -20240229) if present
    let modelName = process.env.CLAUDE_MODEL || "claude-3-sonnet";
    // If the model has a date suffix (e.g., claude-3-opus-20240229), strip it to the base name
    modelName = modelName.replace(/-\d{8}$/, "");

    console.log("Using model:", modelName);
    console.log(
      "Making Claude API request with system prompt:",
      system ? system.substring(0, 50) + "..." : "None"
    );

    // Log API key presence (not the actual key)
    console.log("API key available:", !!apiKey);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelName,
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
    console.log("Claude API response received");
    return res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
