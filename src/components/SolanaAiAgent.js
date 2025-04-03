import React, { useState, useEffect, useRef } from "react";
import { getCurrentSlot, getAccountBalance } from "../services/solanaService";
import phantomWalletService from "../services/phantomWalletService";

const SolanaAiAgent = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Solana AI assistant. I can help with Solana blockchain operations like checking balances and making transfers. To get started, please connect your Phantom wallet by clicking the 'Connect Wallet' button above, or simply ask me to connect your wallet in chat. What would you like to do today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [currentSlot, setCurrentSlot] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

    // Cleanup function to disconnect wallet when component unmounts
    return () => {
      clearInterval(interval);
      // Disconnect wallet if connected
      if (phantomWalletService.isConnected()) {
        phantomWalletService.disconnect().catch((err) => {
          console.error("Error disconnecting wallet during cleanup:", err);
        });
      }
    };
  }, [handleWalletConnection]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

      // Check if already connected to avoid duplicate connection
      if (phantomWalletService.isConnected() && walletConnected) {
        // Just fetch the balance and return
        await fetchWalletBalance();
        return;
      }

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
    setMessages((prevMessages) => [...prevMessages, { role: "user", content }]);
  };

  const addAssistantMessage = (content) => {
    // Set typing indicator immediately
    setTypingIndicator(true);

    // Calculate a natural typing delay based on message length
    // Average typing speed is about 80 words per minute, or ~400 characters per minute
    // This means ~6.7 characters per second
    const messageLength = content.length;
    const baseDelay = 200; // Base delay of 200ms
    const typingDelay = Math.min(baseDelay + (messageLength / 6.7) * 100, 800); // Cap at 800ms

    // Force a re-render to ensure typing indicator is visible
    setTimeout(() => {
      // Simulate natural typing delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content },
        ]);
        setTypingIndicator(false);
      }, typingDelay);
    }, 0);
  };

  // Helper function to format addresses for display
  const formatAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Call Claude API to process user input
  const callClaudeApi = async (messageHistory, userMessage) => {
    try {
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.content || !data.content[0] || !data.content[0].text) {
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

    const userInput = input.trim();
    setInput("");
    addUserMessage(userInput);
    setLoading(true);

    try {
      // Call Claude API
      const claudeResponse = await callClaudeApi(messages, userInput);

      // Extract action and clean response
      const { response, action } = extractAction(claudeResponse);

      // Display the cleaned response
      addAssistantMessage(response);

      // Execute action if present
      if (action) {
        await executeAction(action);
      }
    } catch (error) {
      console.error("Error processing input:", error);
      addAssistantMessage(
        "I'm sorry, I encountered an error processing your request. Please try again."
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

  // Handle wallet connection button click
  const handleConnect = async () => {
    if (walletConnected) {
      await handleDisconnect();
    } else {
      await handleWalletConnection();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      processInput();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
      className="solana-agent-container"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
        className="agent-header"
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--color-text)",
            margin: 0,
          }}
          className="agent-title"
        >
          Solana AI Assistant
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
          className="wallet-info"
        >
          {walletConnected && walletBalance !== null && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "var(--color-card)",
                borderRadius: "50px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              className="balance-display"
            >
              <span style={{ color: "var(--color-text-muted)" }}>Balance:</span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "var(--color-text)",
                }}
              >
                {walletBalance} SOL
              </span>
            </div>
          )}
          <button
            onClick={handleConnect}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: walletConnected ? "#14F195" : "#9945FF",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            className="connect-button"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            {walletConnected ? "Connected" : "Connect Wallet"}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 200px)",
          backgroundColor: "var(--color-card)",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
        className="chat-container"
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          className="messages-container"
          ref={messagesEndRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                animation: "fadeIn 0.5s ease-out",
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animationFillMode: "forwards",
              }}
              className={`message-bubble ${message.role}`}
            >
              <div
                style={{
                  padding: "1rem",
                  backgroundColor:
                    message.role === "user"
                      ? "#9945FF"
                      : "var(--color-background)",
                  color:
                    message.role === "user" ? "white" : "var(--color-text)",
                  borderRadius: "15px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {message.content}
              </div>
            </div>
          ))}
          {typingIndicator && (
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: "80%",
                animation: "fadeIn 0.3s ease-out",
                animationFillMode: "forwards",
                opacity: 0,
              }}
              className="typing-indicator"
            >
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text)",
                  borderRadius: "15px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "60px",
                }}
              >
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "var(--color-card)",
          }}
          className="input-container"
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "0.8rem 1rem",
                borderRadius: "50px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-background)",
                color: "var(--color-text)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              className="message-input"
              onFocus={(e) => {
                e.target.style.borderColor = "#9945FF";
                e.target.style.boxShadow = "0 0 0 2px rgba(153, 69, 255, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: "0.8rem",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: loading || !input.trim() ? "#ccc" : "#9945FF",
                color: "white",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              className="send-button"
              onMouseOver={(e) => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.2)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                  className="loading-spinner"
                />
              ) : (
                "➤"
              )}
            </button>
          </form>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .dot {
            animation: bounce 1.4s infinite;
            font-size: 1.5rem;
            line-height: 1;
          }
          
          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-5px);
            }
          }
          
          @media (min-width: 768px) {
            .solana-agent-container {
              padding: 2rem !important;
            }
            
            .agent-title {
              font-size: 2rem !important;
            }
            
            .chat-container {
              height: calc(100vh - 250px) !important;
            }
            
            .message-bubble {
              max-width: 70% !important;
            }
            
            .message-input {
              font-size: 1.1rem !important;
              padding: 1rem 1.5rem !important;
            }
            
            .send-button {
              width: 45px !important;
              height: 45px !important;
            }
          }
          
          @media (max-width: 480px) {
            .solana-agent-container {
              padding: 0.5rem !important;
            }
            
            .agent-header {
              margin-bottom: 1rem !important;
            }
            
            .agent-title {
              font-size: 1.25rem !important;
            }
            
            .wallet-info {
              width: 100% !important;
              justify-content: space-between !important;
            }
            
            .chat-container {
              height: calc(100vh - 180px) !important;
              border-radius: 10px !important;
            }
            
            .messages-container {
              padding: 0.5rem !important;
            }
            
            .message-bubble {
              max-width: 90% !important;
            }
            
            .message-bubble > div {
              padding: 0.8rem !important;
              font-size: 0.9rem !important;
            }
            
            .input-container {
              padding: 0.5rem !important;
            }
            
            .message-input {
              font-size: 0.9rem !important;
              padding: 0.6rem 1rem !important;
            }
            
            .send-button {
              width: 35px !important;
              height: 35px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SolanaAiAgent;
