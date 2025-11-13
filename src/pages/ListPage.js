// src/pages/ListPage.js
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const CURRENT_USER_ID = "user-1";

const INITIAL_LISTS = [
  {
    id: "list-1",
    name: "Penny - týdenní nákup",
    ownerId: "user-1",
    ownerName: "Matyáš Novák",
    archived: false,
  },
  {
    id: "list-2",
    name: "Lidl - párty nákup",
    ownerId: "user-1",
    ownerName: "Matyáš Novák",
    archived: false,
  },
  {
    id: "list-3",
    name: "Billa - minulý měsíc",
    ownerId: "user-2",
    ownerName: "Jana",
    archived: true,
  },
  {
    id: "list-4",
    name: "Albert - společný nákup",
    ownerId: "user-2",
    ownerName: "Jana",
    archived: false,
  },
];

export default function ListPage() {
  const nav = useNavigate();

  const [lists, setLists] = useState(INITIAL_LISTS);
  const [showArchived, setShowArchived] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const visibleLists = useMemo(() => {
    if (showArchived) return lists;
    return lists.filter((l) => !l.archived);
  }, [lists, showArchived]);

  const openDetail = (id) => {
    nav(`/list/${id}`);
  };

  const openNewPage = () => {
    nav("/list/new");
  };

  const askDelete = (list) => setToDelete(list);

  const confirmDelete = () => {
    if (!toDelete) return;
    setLists((prev) => prev.filter((l) => l.id !== toDelete.id));
    setToDelete(null);
  };

  const cancelDelete = () => setToDelete(null);

  const toggleArchived = () => {
    setShowArchived((prev) => !prev);
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1>Nákupní seznamy</h1>

        <div style={s.headerRight}>
          <button
            style={showArchived ? s.secondaryButtonActive : s.secondaryButton}
            onClick={toggleArchived}
          >
            Zobrazit archivované
          </button>

          <button style={s.primaryButton} onClick={openNewPage}>
            Nový seznam
          </button>
        </div>
      </header>

      <div style={s.grid}>
        {visibleLists.length === 0 && (
          <div style={s.emptyText}>Žádné seznamy k zobrazení.</div>
        )}

        {visibleLists.map((list) => {
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
                    onClick={() => askDelete(list)}
                  >
                    Smazat
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Potvrzení smazání */}
      {toDelete && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h3>Smazat nákupní seznam</h3>
            <p>
              Opravdu chceš smazat <strong>{toDelete.name}</strong>?
            </p>

            <div style={s.modalButtons}>
              <button style={s.cancelButton} onClick={cancelDelete}>
                Zrušit
              </button>
              <button style={s.deleteButton} onClick={confirmDelete}>
                Smazat
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
    transition: "0.15s",
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
  primaryButton: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
  },
  secondaryButton: {
    background: "#e5e7eb",
    color: "#111827",
    padding: "9px 18px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
  secondaryButtonActive: {
    background: "#4b5563",
    color: "#f9fafb",
    padding: "9px 18px",
    borderRadius: 10,
    border: "1px solid #4b5563",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
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
