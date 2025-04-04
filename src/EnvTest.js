import React, { useEffect, useState } from "react";

const EnvTest = () => {
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    // Get all environment variables that start with REACT_APP_
    const reactAppVars = {};
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("REACT_APP_")) {
        reactAppVars[key] = process.env[key]
          ? `${process.env[key].substring(0, 3)}...${process.env[key].substring(
              process.env[key].length - 3
            )}`
          : "(empty)";
      }
    });

    setEnvVars(reactAppVars);
  }, []);

  return (
    <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc" }}>
      <h2>Environment Variables Test</h2>
      <p>React app version: {process.env.REACT_APP_VERSION || "Not set"}</p>
      <p>
        Claude API Key:{" "}
        {process.env.REACT_APP_CLAUDE_API_KEY ? "Available" : "Not available"}
      </p>

      <h3>All REACT_APP_ Environment Variables:</h3>
      <pre style={{ background: "#f5f5f5", padding: "10px" }}>
        {JSON.stringify(envVars, null, 2)}
      </pre>

      <h3>Troubleshooting Environment Variables:</h3>
      <ol>
        <li>
          Environment variables must start with <code>REACT_APP_</code>
        </li>
        <li>
          You must create your .env file in the root of your project (same level
          as package.json)
        </li>
        <li>
          You must restart your development server after creating/modifying .env
        </li>
        <li>
          Format should be: <code>REACT_APP_CLAUDE_API_KEY=your_key_here</code>{" "}
          (no spaces, no quotes)
        </li>
      </ol>
    </div>
  );
};

export default EnvTest;
