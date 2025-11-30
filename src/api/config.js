// src/api/config.js

// env proměnná: REACT_APP_USE_MOCK_API=true/false
const raw = process.env.REACT_APP_USE_MOCK_API;

// když env NENÍ definované → default mock
// když je "true" → mock
// když je "false" → real

export const USE_MOCK_API =
  raw === undefined ? true : raw === "true";


console.log("USE_MOCK_API =", USE_MOCK_API, "raw =", raw);
// není nutné měnit
export const API_BASE_URL = "http://localhost:3001";