// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ListDetailPage from "./pages/ListDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Domovská stránka */}
        <Route
          path="/"
          element={
            <div style={{ fontFamily: "Arial", padding: 24 }}>
              <h1>Moje nákupní seznamy</h1>
              <p>
                <Link to="/list/list-1">Zobrazit „Víkendový nákup“</Link>
              </p>
            </div>
          }
        />
        {/* Detail seznamu */}
        <Route path="/list/:id" element={<ListDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
