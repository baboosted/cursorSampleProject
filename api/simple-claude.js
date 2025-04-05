const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "API key is missing",
        envKeys: Object.keys(process.env).filter(
          (key) => !key.includes("SECRET")
        ),
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku",
        messages,
        system,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
