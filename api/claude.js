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

    // Get API key from environment variables
    const apiKey =
      process.env.CLAUDE_API_KEY || process.env.REACT_APP_CLAUDE_API_KEY;

    // Always use claude-3-haiku which is widely available
    const modelName = "claude-3-haiku";

    console.log("Using model:", modelName);
    console.log("API key available:", !!apiKey);
    console.log(
      "API key prefix:",
      apiKey ? apiKey.substring(0, 10) + "..." : "none"
    );
    console.log(
      "Anthropic Version:",
      process.env.ANTHROPIC_VERSION || "2023-06-01"
    );
    console.log("System prompt length:", system ? system.length : 0);
    console.log("Messages count:", messages ? messages.length : 0);

    // Check for missing API key
    if (!apiKey) {
      console.error("API key is missing");
      return res.status(500).json({ error: "API key configuration error" });
    }

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
      console.error("Claude API error details:", {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
      });
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("Claude API response received successfully");
    return res.json(data);
  } catch (error) {
    console.error("Server error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
