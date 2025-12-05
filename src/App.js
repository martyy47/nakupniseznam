// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListPage from "./pages/ListPage";
import ListDetailPage from "./pages/ListDetailPage";
import NewListPage from "./pages/NewListPage";
import ArchivePage from "./pages/ArchivePage";
import { ThemeProvider } from "./components/theme/ThemeContext";
import { LanguageProvider } from "./components/language/LanguageContext";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/list/new" element={<NewListPage />} />
            <Route path="/list/:id" element={<ListDetailPage />} />
            <Route path="/archiv" element={<ArchivePage />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}