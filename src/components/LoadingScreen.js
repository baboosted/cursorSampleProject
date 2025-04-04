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
        backgroundColor: "white",
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
          border: "4px solid rgba(0, 0, 0, 0.1)",
          borderTop: "4px solid #000000",
          borderRight: "4px solid #000000",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <h2
        style={{
          marginTop: "2rem",
          color: "#000000",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Loading AI Assistant
      </h2>
      <p
        style={{
          marginTop: "0.5rem",
          color: "rgba(0, 0, 0, 0.6)",
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
