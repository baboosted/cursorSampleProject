import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            fontSize: "1.5rem",
            color: "var(--color-text)",
            textTransform: "lowercase",
            letterSpacing: "0.5px",
          }}
        >
          pathos
        </span>
      </div>
    </Link>
  );
};

export default Logo;
