import React from "react";

const Hero = () => {
  return (
    <section className="hero">
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div
          className="hero-content"
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <h1>
            Automate Solana,{" "}
            <span className="gradient-text">amplify the gains</span>
          </h1>
          <p
            style={{
              margin: "20px auto",
              maxWidth: "600px",
              lineHeight: "1.6",
              fontSize: "1.1rem",
            }}
          >
            Pathos helps to automate on-chain duties. Complete various tasks
            using Pathos.
          </p>
        </div>
      </div>
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
    </section>
  );
};

export default Hero;
