import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import MetricCard from "./MetricCard";

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
          background: "var(--color-background)",
          color: "var(--color-text)",
          padding: "5rem 1rem 10rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
        className="hero-section"
      >
        {/* Green Ball Gradient Background */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -40%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74, 222, 128, 1) 0%, rgba(22, 163, 74, 0.5) 40%, rgba(22, 163, 74, 0) 70%)",
            filter: "blur(70px)",
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0.9,
          }}
          className="green-ball-gradient"
        ></div>
        
        {/* Remove Secondary and Tertiary Gradients */}
        
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              backgroundColor: "var(--color-success-light)",
              color: "#166534",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              marginBottom: "2rem",
              border: "1px solid var(--color-success-border)",
              fontWeight: "500",
              fontSize: "0.9rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                backgroundColor: "var(--color-success)",
                borderRadius: "50%",
              }}
            ></span>
            We are now live!
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="1.5" fill="#166534" />
                <circle cx="4" cy="8" r="1.5" fill="#166534" />
                <circle cx="12" cy="8" r="1.5" fill="#166534" />
              </svg>
            </span>
          </div>
          <h1
            style={{
              fontSize: "5rem",
              marginBottom: "1.5rem",
              fontWeight: "700",
              lineHeight: "1.1",
              fontFamily: "Playfair Display, serif",
            }}
            className="hero-title"
          >
            Your AI-Powered Solana Assistant
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              marginBottom: "2.5rem",
              color: "var(--color-text-muted)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
            className="hero-description"
          >
            Experience the future of Solana blockchain interaction with our pioneering MCP implementation. Send crypto, check balances, and get instant blockchain insights - all through natural conversation.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleStartChatting}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "0.85rem",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-background)",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              className="btn btn-primary"
            >
              START CHATTING NOW
            </button>
          </div>
          
          {/* Replace Dashboard Showcase with Metric Cards */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "900px",
              margin: "3rem auto 0",
              zIndex: 2,
            }}
            className="dashboard-showcase"
          >
            {/* Notification above metric cards */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--color-success-light)",
                borderRadius: "8px",
                fontSize: "0.9rem",
                color: "#166534",
                marginBottom: "1.5rem",
              }}
              className="notification-icon-success"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="#22C55E" fillOpacity="0.1"/>
                <path d="M11.5 6L7 10.5L4.5 8" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>All 1100 transactions are successfully matched</span>
            </div>

            {/* Metric Cards Container */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
              }}
              className="dashboard-grid"
            >
              {/* Metric Card 1: Transactions */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                }}
                className="metric-card"
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.5rem",
                  }}
                  className="metric-title"
                >
                  Transaction Volume
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    color: "var(--color-text)",
                  }}
                  className="metric-value"
                >
                  14,856 SOL
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                  className="metric-change positive"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +24.3%
                </div>
              </div>

              {/* Metric Card 2: Wallets */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                }}
                className="metric-card"
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.5rem",
                  }}
                  className="metric-title"
                >
                  Connected Wallets
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    color: "var(--color-text)",
                  }}
                  className="metric-value"
                >
                  5,234
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                  className="metric-change positive"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +18.7%
                </div>
              </div>

              {/* Metric Card 3: Performance */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                }}
                className="metric-card"
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.5rem",
                  }}
                  className="metric-title"
                >
                  Network Performance
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    color: "var(--color-text)",
                  }}
                  className="metric-value"
                >
                  98.7%
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                  className="metric-change positive"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +3.2%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Gradient */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "350px",
            background: "linear-gradient(to top, rgba(22, 163, 74, 0.8), rgba(74, 222, 128, 0.3) 50%, rgba(247, 254, 231, 0) 90%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
          className="hero-background-gradient"
        ></div>
      </section>

      <style>
        {`
          @media (max-width: 768px) {
            .hero-title {
              font-size: 3.5rem !important;
            }
            
            .hero-description {
              font-size: 1rem !important;
            }
            
            .dashboard-grid {
              grid-template-columns: 1fr !important;
            }
          }
          
          @media (max-width: 640px) {
            .hero-title {
              font-size: 3rem !important;
            }
            
            .hero-section {
              padding-top: 4rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
