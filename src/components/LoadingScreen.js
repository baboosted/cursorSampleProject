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
          width: "80px",
          height: "80px",
          border: "4px solid transparent",
          borderTop: "4px solid #9945FF",
          borderRight: "4px solid #14F195",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <h2
        style={{
          marginTop: "2rem",
          color: "var(--color-text)",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Loading AI Assistant
      </h2>
      <p
        style={{
          marginTop: "0.5rem",
          color: "var(--color-text-muted)",
          fontSize: "1rem",
        }}
      >
        Preparing your personalized experience...
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
