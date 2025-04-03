import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChatting = () => {
    setIsLoading(true);

    // Show loading screen for 2 seconds before navigating
    setTimeout(() => {
      setIsLoading(false);
      navigate("/chat");
    }, 2000);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--color-background)",
      }}
    >
      {isLoading && <LoadingScreen />}

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
          color: "white",
          padding: "4rem 1rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
        className="hero-section"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.2)",
            zIndex: 1,
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "0.5rem 1.5rem",
              borderRadius: "50px",
              marginBottom: "2rem",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              🚀 Solana's First MCP Implementation
            </span>
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "1.5rem",
              fontWeight: "bold",
              lineHeight: "1.2",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
            className="hero-title"
          >
            Your AI-Powered Solana Assistant
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem",
              opacity: "0.95",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
            }}
            className="hero-description"
          >
            Experience the future of Solana blockchain interaction with our
            pioneering MCP implementation. Send crypto, check balances, and get
            instant blockchain insights - all through natural conversation.
          </p>
          <button
            onClick={handleStartChatting}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              backgroundColor: "white",
              color: "#9945FF",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
            className="cta-button"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
            }}
          >
            Start Chatting Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "4rem 1rem",
          backgroundColor: "var(--color-card)",
        }}
        className="features-section"
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
          className="features-grid"
        >
          <div
            style={{
              padding: "2rem",
              backgroundColor: "var(--color-background)",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            className="feature-card"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
            }}
          >
            <h3
              style={{
                color: "#9945FF",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Revolutionary MCP Technology
            </h3>
            <p style={{ color: "var(--color-text)", lineHeight: "1.6" }}>
              The first implementation of Message Control Protocol on Solana,
              enabling seamless communication between AI and blockchain.
            </p>
          </div>
          <div
            style={{
              padding: "2rem",
              backgroundColor: "var(--color-background)",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            className="feature-card"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
            }}
          >
            <h3
              style={{
                color: "#9945FF",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Real-time Insights
            </h3>
            <p style={{ color: "var(--color-text)", lineHeight: "1.6" }}>
              Get instant balance updates, transaction history, and blockchain
              analytics through simple conversation.
            </p>
          </div>
          <div
            style={{
              padding: "2rem",
              backgroundColor: "var(--color-background)",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            className="feature-card"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
            }}
          >
            <h3
              style={{
                color: "#9945FF",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Seamless Transactions
            </h3>
            <p style={{ color: "var(--color-text)", lineHeight: "1.6" }}>
              Send SOL to any address with just a simple command. No need to
              navigate complex interfaces or remember technical details.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "4rem 1rem",
          backgroundColor: "var(--color-background)",
          textAlign: "center",
        }}
        className="cta-section"
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "2rem",
            backgroundColor: "var(--color-card)",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "1.5rem",
              fontWeight: "bold",
              color: "var(--color-text)",
            }}
          >
            Ready to Experience the Future?
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "2rem",
              color: "var(--color-text-muted)",
            }}
          >
            Connect your Phantom wallet and start chatting with your AI
            assistant today. No technical knowledge required!
          </p>
          <button
            onClick={handleStartChatting}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#9945FF",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
            className="cta-button"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
            }}
          >
            Start Chatting Now
          </button>
        </div>
      </section>

      <style>
        {`
          @media (min-width: 768px) {
            .hero-section {
              padding: 6rem 2rem !important;
            }
            
            .hero-title {
              font-size: 3.5rem !important;
            }
            
            .hero-description {
              font-size: 1.25rem !important;
            }
            
            .cta-button {
              padding: 1rem 2.5rem !important;
              font-size: 1.1rem !important;
            }
            
            .features-section {
              padding: 5rem 2rem !important;
            }
            
            .cta-section {
              padding: 5rem 2rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .hero-title {
              font-size: 2rem !important;
            }
            
            .hero-description {
              font-size: 1rem !important;
            }
            
            .feature-card {
              padding: 1.5rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
