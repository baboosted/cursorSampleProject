import React, { useState, useEffect, useRef } from "react";
import { getCurrentSlot, getAccountBalance } from "../services/solanaService";
import phantomWalletService from "../services/phantomWalletService";

const SolanaAiAgent = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Solana AI assistant. I can help with Solana blockchain operations like checking balances and making transfers. What would you like to do today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [currentSlot, setCurrentSlot] = useState(null);

  const messagesEndRef = useRef(null);

  // Check if Phantom is installed and connected on component mount
  useEffect(() => {
    const isInstalled = phantomWalletService.isPhantomInstalled();

    if (isInstalled) {
      if (phantomWalletService.isConnected()) {
        handleWalletConnection();
      }
      fetchCurrentSlot();
    } else {
      addAssistantMessage(
        "I notice you don't have Phantom wallet installed. You'll need it to perform Solana transfers. Would you like to know how to install it?"
      );
    }

    // Update blockchain slot every 30 seconds
    const interval = setInterval(fetchCurrentSlot, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update wallet balance when connected
  useEffect(() => {
    if (walletConnected) {
      fetchWalletBalance();
    }
  }, [walletConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCurrentSlot = async () => {
    try {
      setConnectionStatus("checking");
      const slot = await getCurrentSlot();
      setCurrentSlot(slot);
      setConnectionStatus("connected");
    } catch (err) {
      console.error("Error getting current slot:", err);
      setConnectionStatus("error");
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const balance = await phantomWalletService.getBalance();
      setWalletBalance(balance);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
    }
  };

  const handleWalletConnection = async () => {
    try {
      setLoading(true);
      const pubKey = await phantomWalletService.connect();
      setPublicKey(pubKey);
      setWalletConnected(true);

      // Get wallet balance
      await fetchWalletBalance();

      // Add a message to the chat
      addAssistantMessage(
        `Wallet connected successfully! Your address: ${formatAddress(pubKey)}`
      );
    } catch (err) {
      console.error("Connection error:", err);
      addAssistantMessage(`Failed to connect wallet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await phantomWalletService.disconnect();
      setPublicKey("");
      setWalletConnected(false);
      setWalletBalance(null);
      addAssistantMessage("Wallet disconnected successfully.");
    } catch (err) {
      console.error("Disconnect error:", err);
      addAssistantMessage(`Failed to disconnect: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceCheck = async (address = null) => {
    try {
      setLoading(true);
      if (address) {
        // Check balance of provided address
        if (!phantomWalletService.isValidSolanaAddress(address)) {
          addAssistantMessage(
            "That doesn't appear to be a valid Solana address. Please check and try again."
          );
          return;
        }

        const balance = await getAccountBalance(address);
        addAssistantMessage(
          `The address ${formatAddress(
            address
          )} has a balance of ${balance.toFixed(6)} SOL.`
        );
      } else if (walletConnected) {
        // Check connected wallet balance
        await fetchWalletBalance();
        addAssistantMessage(
          `Your wallet balance is ${walletBalance.toFixed(6)} SOL.`
        );
      } else {
        addAssistantMessage(
          "You need to connect your wallet first to check its balance."
        );
      }
    } catch (err) {
      console.error("Balance check error:", err);
      addAssistantMessage(`Error checking balance: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (recipientAddress, amount) => {
    if (!walletConnected) {
      addAssistantMessage(
        "You need to connect your wallet first to make transfers."
      );
      return;
    }

    if (!recipientAddress || !amount) {
      addAssistantMessage(
        "I need both a recipient address and an amount to make a transfer."
      );
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      addAssistantMessage("The amount must be a positive number.");
      return;
    }

    // Validate address format
    if (!phantomWalletService.isValidSolanaAddress(recipientAddress)) {
      addAssistantMessage(
        "That doesn't appear to be a valid Solana address. Please check and try again."
      );
      return;
    }

    // Verify the user has enough balance
    if (walletBalance !== null && parseFloat(amount) > walletBalance) {
      addAssistantMessage(
        `Insufficient balance. You're trying to send ${parseFloat(
          amount
        ).toFixed(6)} SOL but your wallet only has ${walletBalance.toFixed(
          6
        )} SOL.`
      );
      return;
    }

    try {
      setLoading(true);
      addAssistantMessage(
        `Preparing to send ${amount} SOL to ${formatAddress(
          recipientAddress
        )}...`
      );

      // Transfer SOL
      const result = await phantomWalletService.transferSol(
        recipientAddress,
        parseFloat(amount),
        true // Charge fee
      );

      addAssistantMessage(
        `Transaction successful! ✅\nSignature: ${
          result.signature
        }\n\nRecipient received: ${result.fee.recipientAmountInSol.toFixed(
          6
        )} SOL\nService fee: ${result.fee.feeInSol.toFixed(6)} SOL (${
          result.fee.feePercentage
        }%)`
      );

      // Refresh balance
      await fetchWalletBalance();
    } catch (err) {
      console.error("Transfer error:", err);
      addAssistantMessage(`Transaction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotCheck = async () => {
    try {
      setLoading(true);
      await fetchCurrentSlot();
      addAssistantMessage(`The current Solana slot is ${currentSlot}.`);
    } catch (err) {
      console.error("Slot check error:", err);
      addAssistantMessage(`Error checking current slot: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addUserMessage = (content) => {
    setMessages((prev) => [...prev, { role: "user", content }]);
  };

  const addAssistantMessage = (content) => {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  };

  // Helper function to format addresses for display
  const formatAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Call Claude API to process user input
  const callClaudeApi = async (messageHistory, userMessage) => {
    try {
      // Log debugging information
      console.log("=== Claude API Request Debug ===");
      console.log("API URL:", "http://localhost:3001/api/claude");

      // Prepare system prompt with context
      const systemPrompt = `You are an AI assistant specializing in Solana blockchain operations.

Current Solana context:
- Wallet connected: ${walletConnected ? "Yes" : "No"}
${walletConnected ? `- Wallet address: ${publicKey}` : ""}
${
  walletBalance !== null
    ? `- Wallet balance: ${walletBalance.toFixed(6)} SOL`
    : ""
}
- Blockchain connection: ${connectionStatus}
${currentSlot ? `- Current slot: ${currentSlot}` : ""}

You can help users with the following Solana operations:
1. Connect to Phantom wallet
2. Disconnect from Phantom wallet
3. Check wallet balance
4. Check balance of any Solana address
5. Transfer SOL to another address
6. Check current Solana blockchain slot

IMPORTANT INSTRUCTIONS:
- When a user wants to perform an action, identify the intent and include <action> tags in your response.
- Valid actions are: <connect_wallet>, <disconnect_wallet>, <check_balance:address?>, <transfer_sol:recipientAddress,amount>, <check_slot>
- For balance checks, include the address parameter if a specific address was provided, otherwise leave it empty.
- For transfers, always include both recipient address and amount.
- Only include ONE action tag per response.
- Example: "I'll check your balance. <check_balance:>"
- Example: "I'll send 1 SOL to that address. <transfer_sol:8xrt45...zQ9,1.0>"
- If the user wants to check a specific address balance: "I'll check that address. <check_balance:8xrt45...zQ9>"
- Do NOT include action tags if the user is just asking general questions.
- Respond conversationally and briefly. Don't overexplain basic concepts unless asked.`;

      // Prepare message history for Claude
      const claudeMessages = messageHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add new user message
      claudeMessages.push({
        role: "user",
        content: userMessage,
      });

      // Call our backend proxy
      const response = await fetch("http://localhost:3001/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: claudeMessages,
          system: systemPrompt,
        }),
      });

      console.log("API Response Status:", response.status, response.statusText);

      if (!response.ok) {
        console.error(
          "Claude API response error:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Claude API error details:", errorText);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Claude API response:", data);

      if (!data.content || !data.content[0] || !data.content[0].text) {
        console.error("Unexpected Claude API response format:", data);
        throw new Error("Unexpected Claude API response format");
      }

      return data.content[0].text;
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  };

  // Extract action from Claude's response
  const extractAction = (response) => {
    // Match action tags with optional parameters
    const connectWalletMatch = response.match(/<connect_wallet>/);
    const disconnectWalletMatch = response.match(/<disconnect_wallet>/);
    const checkBalanceMatch = response.match(/<check_balance:([^>]*)>/);
    const transferSolMatch = response.match(/<transfer_sol:([^,]*),([^>]*)>/);
    const checkSlotMatch = response.match(/<check_slot>/);

    // Clean the response by removing the action tags
    const cleanedResponse = response
      .replace(/<connect_wallet>/g, "")
      .replace(/<disconnect_wallet>/g, "")
      .replace(/<check_balance:[^>]*>/g, "")
      .replace(/<transfer_sol:[^>]*>/g, "")
      .replace(/<check_slot>/g, "")
      .trim();

    // Determine the action
    if (connectWalletMatch) {
      return { response: cleanedResponse, action: { type: "connect_wallet" } };
    } else if (disconnectWalletMatch) {
      return {
        response: cleanedResponse,
        action: { type: "disconnect_wallet" },
      };
    } else if (checkBalanceMatch) {
      const address = checkBalanceMatch[1].trim();
      return {
        response: cleanedResponse,
        action: { type: "check_balance", address: address || null },
      };
    } else if (transferSolMatch) {
      const recipientAddress = transferSolMatch[1].trim();
      const amount = transferSolMatch[2].trim();
      return {
        response: cleanedResponse,
        action: {
          type: "transfer_sol",
          recipientAddress,
          amount: parseFloat(amount),
        },
      };
    } else if (checkSlotMatch) {
      return { response: cleanedResponse, action: { type: "check_slot" } };
    }

    // No action found
    return { response: response, action: null };
  };

  // Process user input with Claude
  const processInput = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    addUserMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      // Call Claude API
      const claudeResponse = await callClaudeApi(messages, userMsg);

      // Extract action and clean response
      const { response, action } = extractAction(claudeResponse);

      // Display the cleaned response
      addAssistantMessage(response);

      // Execute action if present
      if (action) {
        await executeAction(action);
      }
    } catch (error) {
      console.error("Error processing with Claude:", error);
      addAssistantMessage(
        `There was an error with the Claude API: ${error.message}. Please try again later or check the console for more details.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Execute action extracted from Claude's response
  const executeAction = async (action) => {
    switch (action.type) {
      case "connect_wallet":
        await handleWalletConnection();
        break;
      case "disconnect_wallet":
        await handleDisconnect();
        break;
      case "check_balance":
        await handleBalanceCheck(action.address);
        break;
      case "transfer_sol":
        await handleTransfer(action.recipientAddress, action.amount);
        break;
      case "check_slot":
        await handleSlotCheck();
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  };

  // Add a simple Claude API test function
  const testClaudeApi = async () => {
    try {
      setLoading(true);
      addAssistantMessage("Testing Claude API connection...");

      // Test the backend health endpoint first
      const healthResponse = await fetch("http://localhost:3001/health");
      if (!healthResponse.ok) {
        throw new Error("Backend server is not running");
      }

      // Test the Claude API through our backend
      const response = await fetch("http://localhost:3001/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hello, are you working?" }],
          system: "You are a helpful AI assistant.",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        addAssistantMessage(
          `Claude API test failed: ${response.status} - ${errorText}`
        );
        return;
      }

      const data = await response.json();
      addAssistantMessage(
        `Claude API test successful! Response: "${data.content[0].text}"`
      );
    } catch (error) {
      console.error("Claude API test error:", error);
      addAssistantMessage(`Claude API test error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="solana-ai-agent"
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "700px",
        border: "1px solid var(--color-primary)",
        borderRadius: "12px",
        background: "var(--color-card)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="agent-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid var(--color-primary-dark)",
          marginBottom: "1rem",
          background: "rgba(0, 0, 0, 0.02)",
          borderRadius: "8px",
        }}
      >
        <div
          className="agent-title"
          style={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ color: "var(--color-primary)" }}>
            Solana AI Assistant
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: "normal",
              padding: "2px 6px",
              backgroundColor: "var(--color-primary)",
              color: "white",
              borderRadius: "4px",
            }}
          >
            Powered by Claude
          </span>
          <button
            onClick={testClaudeApi}
            disabled={loading}
            style={{
              fontSize: "0.7rem",
              padding: "4px 8px",
              backgroundColor: loading ? "#ccc" : "#444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Testing..." : "Test API"}
          </button>
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              color:
                connectionStatus === "connected"
                  ? "var(--color-primary-light)"
                  : connectionStatus === "error"
                  ? "#ef4444"
                  : "var(--color-text-muted)",
            }}
          >
            {connectionStatus === "connected"
              ? "● Blockchain Connected"
              : connectionStatus === "error"
              ? "● Connection Error"
              : "● Checking..."}
          </span>

          {walletConnected && (
            <span
              style={{
                color: "var(--color-primary-light)",
                backgroundColor: "rgba(32, 129, 226, 0.1)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>● Wallet: {formatAddress(publicKey)}</span>
              {walletBalance !== null && (
                <span style={{ marginLeft: "0.25rem" }}>
                  ({walletBalance.toFixed(4)} SOL)
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <div
        className="messages-container"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                backgroundColor:
                  message.role === "user"
                    ? "var(--color-primary)"
                    : "rgba(0, 0, 0, 0.05)",
                color: message.role === "user" ? "white" : "inherit",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="input-container"
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "1rem",
          background: "rgba(0, 0, 0, 0.02)",
          borderRadius: "8px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && processInput()}
          placeholder="Type your message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.8rem",
            border: "1px solid var(--color-primary)",
            borderRadius: "8px",
            fontSize: "1rem",
            background: "white",
            transition: "border-color 0.2s",
          }}
        />
        <button
          onClick={processInput}
          disabled={loading || !input.trim()}
          style={{
            padding: "0.8rem 1.5rem",
            backgroundColor:
              loading || !input.trim() ? "#ccc" : "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            fontWeight: "bold",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default SolanaAiAgent;
