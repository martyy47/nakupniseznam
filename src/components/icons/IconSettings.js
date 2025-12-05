// src/components/icons/IconSettings.js
import React from "react";

export default function IconSettings({ size = 22, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 
      2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33
      1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 
      1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 
      2 0 1 1-2.83-2.83l.06-.06c.46-.46.6-1.14.33-1.82
      a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 
      1.65 0 0 0 1.51-1c.27-.68.13-1.36-.33-1.82l-.06-.06
      a2 2 0 1 1 2.83-2.83l.06.06c.46.46 1.14.6 1.82.33
      A1.65 1.65 0 0 0 11 3.09V3a2 2 0 0 1 4 0v.09c0 
      .69.39 1.31 1 1.51.68.27 1.36.13 1.82-.33l.06-.06a2 
      2 0 1 1 2.83 2.83l-.06.06c-.46.46-.6 1.14-.33 
      1.82.27.68.89 1.06 1.51 1H21a2 2 0 0 1 0 4h-.09
      c-.69 0-1.31.39-1.51 1z" />
    </svg>
  );
}