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
          gap: "0.75rem",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            minWidth: "40px",
            height: "auto",
          }}
        >
          <path
            d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0ZM20 7.5C26.904 7.5 32.5 13.096 32.5 20C32.5 26.904 26.904 32.5 20 32.5C13.096 32.5 7.5 26.904 7.5 20C7.5 13.096 13.096 7.5 20 7.5Z"
            fill="url(#paint0_linear)"
          />
          <path
            d="M26 16L20 13L14 16L14 24L20 27L26 24V16Z"
            fill="url(#paint1_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1="0"
              x2="40"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4ADE80" />
              <stop offset="1" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient
              id="paint1_linear"
              x1="14"
              y1="13"
              x2="26"
              y2="27"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#22C55E" />
              <stop offset="1" stopColor="#4ADE80" />
            </linearGradient>
          </defs>
        </svg>
        <span
          style={{
            fontWeight: "700",
            fontSize: "1.5rem",
            background:
              "linear-gradient(90deg, var(--color-primary-light), var(--color-primary))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Pathos
        </span>
      </div>
    </Link>
  );
};

export default Logo;
