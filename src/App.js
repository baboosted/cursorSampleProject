import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import SolanaAiAgent from "./components/SolanaAiAgent";

function App() {
  return (
    <Router>
      <div
        className="App"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-background)",
          }}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/chat"
              element={
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem 0",
                  }}
                >
                  <SolanaAiAgent />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
