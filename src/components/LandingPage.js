import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--color-background)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          padding: "2rem",
          background: "var(--color-card)",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            color: "var(--color-primary)",
            fontWeight: "bold",
          }}
        >
          Solana AI Assistant
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "2rem",
            color: "var(--color-text)",
            lineHeight: "1.6",
          }}
        >
          Experience the future of Solana blockchain interaction with our
          AI-powered assistant. Connect your wallet, check balances, make
          transfers, and get instant answers to your Solana questions - all
          through natural conversation.
        </p>
        <button
          onClick={() => navigate("/chat")}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "transform 0.2s, background-color 0.2s",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.backgroundColor = "var(--color-primary-dark)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.backgroundColor = "var(--color-primary)";
          }}
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
