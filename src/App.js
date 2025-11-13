import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListPage from "./pages/ListPage";
import ListDetailPage from "./pages/ListDetailPage";
import NewListPage from "./pages/NewListPage";
import ArchivePage from "./pages/ArchivePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/list/new" element={<NewListPage />} />
        <Route path="/list/:id" element={<ListDetailPage />} />
        <Route path="/archiv" element={<ArchivePage />} />
      </Routes>
    </BrowserRouter>
  );
}
