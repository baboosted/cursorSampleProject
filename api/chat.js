const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    // Use direct API key
    const apiKey = process.env.CLAUDE_API_KEY;

    // Use model from environment variables if available, with fallbacks
    let modelName = process.env.CLAUDE_MODEL;

    // If model name includes a date suffix, strip it
    if (modelName && modelName.match(/-\d{8}$/)) {
      modelName = modelName.replace(/-\d{8}$/, "");
    }

    // Default to haiku if no model set
    if (!modelName) {
      modelName = "claude-3-haiku";
    }

    console.log("Using model:", modelName);

    if (!apiKey) {
      console.error("Missing CLAUDE_API_KEY environment variable");
      return res.status(500).json({
        error: "API key missing",
        env: Object.keys(process.env)
          .filter((k) => !k.includes("SECRET"))
          .join(", "),
      });
    }

    // Make request to Anthropic API
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

    // Get response as text first for debugging
    const responseText = await response.text();
    console.log("Anthropic API response status:", response.status);
    console.log(
      "Anthropic API response text preview:",
      responseText.substring(0, 200)
    );

    // Parse the response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      return res.status(500).json({
        error: "Invalid JSON response from Anthropic API",
        text: responseText,
      });
    }

    // Check for error
    if (data.error) {
      console.error("Error from Anthropic API:", data.error);
      // Construct our own response format
      return res.status(200).json({
        content: [
          {
            type: "text",
            text: `I apologize, but I encountered an error communicating with the AI backend. Please try again later. (Error: ${
              data.error.message || "Unknown error"
            })`,
          },
        ],
      });
    }

    // Return successful response
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in chat API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: error.stack,
    });
  }
};
