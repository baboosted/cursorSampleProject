import React from "react";

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "var(--color-background)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          border: "3px solid #f3f4f6",
          borderTop: "3px solid var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <h2
        style={{
          marginTop: "2rem",
          color: "var(--color-text)",
          fontSize: "1.25rem",
          fontWeight: "600",
        }}
      >
        Loading Pathos
      </h2>
      <p
        style={{
          marginTop: "0.5rem",
          color: "var(--color-text-muted)",
          fontSize: "0.9rem",
        }}
      >
        Preparing your personal solana mcp bot...
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;