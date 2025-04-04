import React from "react";
import Logo from "./Logo";

const Header = () => {
  return (
    <header
      style={{
        padding: "1rem 0",
        position: "relative",
        zIndex: 10,
        width: "100%",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Logo />
      </div>
    </header>
  );
};

export default Header;
