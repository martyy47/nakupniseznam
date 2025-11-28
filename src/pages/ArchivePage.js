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

  const [toDeleteOne, setToDeleteOne] = useState(null);
  const [toDeleteAll, setToDeleteAll] = useState(false);

  const openDetail = (id) => {
    nav(`/list/${id}`);
  };

  // otevře modál pro konkrétní list
  const askDeleteOne = (list) => setToDeleteOne(list);

  // potvrzení odstranění jednoho listu
  const confirmDeleteOne = () => {
    setLists((prev) => prev.filter((l) => l.id !== toDeleteOne.id));
    setToDeleteOne(null);
  };

  const cancelDeleteOne = () => setToDeleteOne(null);

  // otevře modál „smazat všechny“
  const askDeleteAll = () => setToDeleteAll(true);

  const confirmDeleteAll = () => {
    setLists([]);
    setToDeleteAll(false);
  };

  const cancelDeleteAll = () => setToDeleteAll(false);

  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1>Archivované seznamy</h1>

        <div style={s.headerRight}>
          {lists.length > 0 && (
            <button style={s.deleteAllButton} onClick={askDeleteAll}>
              Smazat všechny archivované
            </button>
          )}

          <Link to="/list" style={s.backLink}>
            ← Zpět na přehled
          </Link>
        </div>
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
                    onClick={() => askDeleteOne(list)}
                  >
                    Smazat
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODÁL – smazat jeden */}
      {toDeleteOne && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h3>Smazat archivovaný seznam</h3>
            <p>
              Opravdu chceš smazat <strong>{toDeleteOne.name}</strong>?
            </p>

            <div style={s.modalButtons}>
              <button style={s.cancelButton} onClick={cancelDeleteOne}>
                Zrušit
              </button>
              <button style={s.deleteButton} onClick={confirmDeleteOne}>
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODÁL – smazat všechny */}
      {toDeleteAll && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h3>Smazat všechny archivované seznamy</h3>
            <p>Opravdu chceš nenávratně smazat všechny archivované seznamy?</p>

            <div style={s.modalButtons}>
              <button style={s.cancelButton} onClick={cancelDeleteAll}>
                Zrušit
              </button>
              <button style={s.deleteButton} onClick={confirmDeleteAll}>
                Smazat vše
              </button>
            </div>
          </div>
        </div>
      )}
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerRight: {
    display: "flex",
    gap: 12,
    alignItems: "center",
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
  deleteAllButton: {
    background: "#dc2626",
    color: "#fff",
    padding: "9px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: 30,
    borderRadius: 14,
    width: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    background: "#e5e7eb",
    color: "#111827",
    padding: "9px 18px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
};
