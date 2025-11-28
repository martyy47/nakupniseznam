// src/pages/ArchivePage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CURRENT_USER_ID = "user-1";

const INITIAL_ARCHIVE = [
  { id: "list-3", name: "Billa - minulý měsíc", ownerId: "user-2", ownerName: "Jana" },
  { id: "list-5", name: "Tesco - velký nákup", ownerId: "user-1", ownerName: "Matyáš Novák" },
];

export default function ArchivePage() {
  const nav = useNavigate();
  const [lists, setLists] = useState(INITIAL_ARCHIVE);

  const openDetail = (id) => {
    nav(`/list/${id}`);
  };

  const removeOne = (id) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  };

  const removeAll = () => {
    if (window.confirm("Opravdu smazat všechny archivované seznamy?")) {
      setLists([]);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <header style={s.header}>
          <h1>Archivované seznamy</h1>
          <Link to="/list" style={s.backLink}>
            ← Zpět na přehled
          </Link>
        </header>

        <div style={s.grid}>
          {lists.length === 0 && (
            <div style={s.emptyText}>Archiv je prázdný.</div>
          )}

          {lists.map((list) => {
            const isOwner = list.ownerId === CURRENT_USER_ID;
            return (
              <div key={list.id} style={s.card}>
                <div style={s.cardTitle}>{list.name}</div>
                <div style={s.ownerNote}>
                  Vlastník: {isOwner ? "Vy" : list.ownerName}
                </div>

                <div style={s.cardButtons}>
                  <button
                    style={s.detailButton}
                    onClick={() => openDetail(list.id)}
                  >
                    Zobrazit detail
                  </button>

                  {isOwner && (
                    <button
                      style={s.deleteButton}
                      onClick={() => removeOne(list.id)}
                    >
                      Smazat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {lists.length > 0 && (
          <div style={s.bottomControls}>
            <button style={s.deleteAllButton} onClick={removeAll}>
              Smazat všechny archivované
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#eef1f7",
    padding: "40px 60px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backLink: {
    fontSize: 14,
    color: "#2563eb",
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#fff",
    padding: 22,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 600,
    marginBottom: 8,
    color: "#111",
  },
  ownerNote: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
  },
  cardButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  detailButton: {
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    padding: "7px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
  deleteButton: {
    background: "#fee2e2",
    border: "1px solid #ee1111ff",
    color: "#ee1111ff",
    padding: "7px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
  },
  bottomControls: {
    marginTop: 24,
    textAlign: "right",
  },
  deleteAllButton: {
    background: "#dc2626",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
};
