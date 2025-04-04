import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChatting = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/chat");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {isLoading && <LoadingScreen />}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-black tracking-tight text-black group-hover:text-gray-800 transition-colors">
                PATHOS
              </span>
              <span className="text-xs font-medium text-black/40 group-hover:text-black/60 transition-colors">
                MCP
              </span>
            </a>
            <div className="flex items-center space-x-6">
              <button
                onClick={handleStartChatting}
                className="px-5 py-1.5 bg-gradient-to-r from-black to-gray-800 text-white text-sm font-medium rounded-full hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-8 text-black animate-fade leading-normal pb-2"
                style={{ lineHeight: 1.2, paddingBottom: "0.5rem" }}
              >
                MCP Powered Agent
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-black/60 max-w-3xl mx-auto leading-relaxed animate-fadeIn">
              The first implementation of MCP on Solana, enabling seamless
              communication between AI and blockchain networks. A powerful
              bridge connecting artificial intelligence to the decentralized
              future.
            </p>
            <p className="mt-6 text-base sm:text-lg text-black/50 max-w-2xl mx-auto">
              Unlock the full potential of AI agents interacting with blockchain
              technology through a standardized interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-black/5 to-black/10 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">
                Natural Language
              </h2>
              <p className="text-black/60 leading-relaxed">
                Interact with the blockchain using everyday language. No
                technical knowledge required. Query blockchain data through
                intuitive conversations.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-black/5 to-black/10 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">
                Secure Protocol
              </h2>
              <p className="text-black/60 leading-relaxed">
                MCP ensures secure and reliable communication between AI and
                blockchain networks.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-black/5 to-black/10 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">
                Real-time Data
              </h2>
              <p className="text-black/60 leading-relaxed">
                Instant access to blockchain data through natural language
                queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl font-black tracking-tight mb-8 from-white to-gray-400 pb-2"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(to right, white, #a3a3a3)",
                  lineHeight: 1.2,
                  paddingBottom: "0.5rem",
                  display: "inline-block",
                }}
              >
                MCP Integration
              </h2>
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                Experience the power of Message Control Protocol on Solana. Our
                implementation brings together AI and blockchain in a seamless,
                secure environment, creating a standardized interface for
                next-generation interaction.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">
                      AI-Blockchain Bridge
                    </h3>
                    <p className="text-white/60 group-hover:text-white/80 transition-colors">
                      Connects Claude AI directly to Solana's blockchain
                      ecosystem
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">
                      Comprehensive RPC Methods
                    </h3>
                    <p className="text-white/60 group-hover:text-white/80 transition-colors">
                      Access the full range of Solana blockchain functionality
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">
                      Automated Transactions
                    </h3>
                    <p className="text-white/60 group-hover:text-white/80 transition-colors">
                      Execute smart contracts and transactions via AI
                      interactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-3xl"></div>
              <div className="relative p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="w-32 h-4 bg-white/10 rounded-full"></div>
                      <div className="w-24 h-3 bg-white/10 rounded-full mt-2"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-white/10 rounded-full"></div>
                        <div className="w-1/2 h-4 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex space-x-4 self-end">
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-white/20 rounded-full ml-auto"></div>
                        <div className="w-1/2 h-4 bg-white/20 rounded-full ml-auto"></div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-white/10 rounded-full"></div>
                        <div className="w-1/2 h-4 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section - NEW SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-6">
              Powerful Use Cases
            </h2>
            <p className="text-xl text-black/60 max-w-3xl mx-auto">
              Unleash the potential of AI-powered blockchain interactions with
              our MCP implementation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black">
                  AI-Powered Trading
                </h3>
              </div>
              <p className="text-black/60 leading-relaxed">
                Intelligent agents analyze market data in real-time, identify
                trading opportunities, and execute trades autonomously on the
                Solana blockchain for unparalleled efficiency.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black">
                  Smart Contract Automation
                </h3>
              </div>
              <p className="text-black/60 leading-relaxed">
                Automate interactions with decentralized applications and smart
                contracts through intuitive AI conversations, removing technical
                barriers to blockchain adoption.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black">
                  Real-time Analytics
                </h3>
              </div>
              <p className="text-black/60 leading-relaxed">
                Leverage Claude AI's analytical capabilities to process
                blockchain data streams, providing insights and actionable
                intelligence in natural language.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black">
                  Multi-Agent Coordination
                </h3>
              </div>
              <p className="text-black/60 leading-relaxed">
                Enable collaborative AI systems that coordinate activities
                across the Solana ecosystem, creating complex workflows and
                synergistic operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl font-black mb-8 text-black pb-2"
            style={{
              lineHeight: 1.2,
              paddingBottom: "0.5rem",
              display: "inline-block",
            }}
          >
            Ready to Experience MCP?
          </h2>
          <p className="text-xl text-black/60 mb-6 max-w-2xl mx-auto">
            Join the future of blockchain interaction with our AI-powered
            protocol
          </p>
          <p className="text-lg text-black/50 mb-12 max-w-3xl mx-auto">
            Built with comprehensive RPC methods for seamless blockchain
            operations
          </p>
          <button
            onClick={handleStartChatting}
            className="px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white font-medium rounded-full hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Chatting Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-2xl font-black tracking-tight text-black hover:text-gray-800 transition-colors"
              >
                PATHOS
              </a>
              <span className="text-black/40">MCP on Solana</span>
            </div>
          </div>
          <div className="mt-8 text-center text-black/40 text-sm">
            © {new Date().getFullYear()} PATHOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
