// src/pages/ListPage.js
import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useApiRequest } from "../hooks/useApiRequest";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import SettingsModal from "../components/SettingsModal";
import IconSettings from "../components/icons/IconSettings";
import { useTheme } from "../components/theme/ThemeContext";

const CURRENT_USER_ID = "user-1";
const CURRENT_USER = {
  id: "user-1",
  name: "Matyáš Novák",
  email: "matyas.novak@example.com",
};

export default function ListPage() {
  const nav = useNavigate();
  const { theme, setTheme } = useTheme();

  const {
    status,
    data: lists,
    error,
    execute: loadLists,
    setData: setLists,
  } = useApiRequest(api.getShoppingLists);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [language, setLanguage] = React.useState("cs"); // jazyk zatím lokálně, context doděláme pak

  // ✅ /list = vždy jen nearchivované seznamy
  const visibleLists = useMemo(() => {
    return (lists || []).filter((l) => !l.archived);
  }, [lists]);

  const openDetail = (id) => {
    nav(`/list/${id}`);
  };

  const openNewPage = () => {
    nav("/list/new");
  };

  const openArchivePage = () => {
    nav("/archiv");
  };

  const [toDelete, setToDelete] = React.useState(null);

  const askDelete = (list) => setToDelete(list);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.deleteShoppingList(toDelete.id);
      setLists((prev) => (prev || []).filter((l) => l.id !== toDelete.id));
    } catch (e) {
      console.error(e);
      alert("Nepodařilo se smazat seznam.");
    } finally {
      setToDelete(null);
    }
  };

  const cancelDelete = () => setToDelete(null);

  const settingsButton = (
    <button
      style={s.settingsButton}
      onClick={() => setIsSettingsOpen(true)}
      title="Uživatelské nastavení"
    >
      <IconSettings size={20} />
    </button>
  );

  // 🔄 PENDING
  if (status === "pending" && !lists) {
    return (
      <div style={s.page}>
        <header style={s.header}>
          <h1>Nákupní seznamy</h1>
          <div style={s.headerRight}>
            <button style={s.secondaryButton} onClick={openArchivePage}>
              Zobrazit archivované
            </button>
            <button style={s.primaryButton} onClick={openNewPage}>
              Nový seznam
            </button>
            {settingsButton}
          </div>
        </header>

        <LoadingIndicator text="Načítám nákupní seznamy..." />

        <SettingsModal
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
          user={CURRENT_USER}
        />
      </div>
    );
  }

  // ❌ ERROR
  if (status === "error") {
    return (
      <div style={s.page}>
        <header style={s.header}>
          <h1>Nákupní seznamy</h1>
          <div style={s.headerRight}>
            <button style={s.secondaryButton} onClick={openArchivePage}>
              Zobrazit archivované
            </button>
            <button style={s.primaryButton} onClick={openNewPage}>
              Nový seznam
            </button>
            {settingsButton}
          </div>
        </header>

        <ErrorMessage
          message="Nepodařilo se načíst nákupní seznamy."
          detail={error?.message}
          onRetry={loadLists}
        />

        <SettingsModal
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
          user={CURRENT_USER}
        />
      </div>
    );
  }

  // ✅ READY
  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1>Nákupní seznamy</h1>

        <div style={s.headerRight}>
          <button style={s.secondaryButton} onClick={openArchivePage}>
            Zobrazit archivované
          </button>

          <button style={s.primaryButton} onClick={openNewPage}>
            Nový seznam
          </button>

          {settingsButton}
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

      {/* Uživatelské nastavení */}
      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        language={language}
        onLanguageChange={setLanguage}
        user={CURRENT_USER}
      />
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-page)",
    padding: "40px 60px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    color: "var(--text-main)",
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
    background: "var(--bg-card)",
    padding: 22,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    transition: "0.15s",
    border: "1px solid var(--border-color)",
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 600,
    marginBottom: 8,
    color: "var(--text-main)",
  },
  ownerNote: {
    fontSize: 13,
    color: "var(--text-muted)",
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
  background: "var(--delete-bg)",
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
  emptyText: {
    color: "var(--text-muted)",
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
    background: "var(--bg-card)",
    color: "var(--text-main)",
    padding: 30,
    borderRadius: 14,
    width: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    border: "1px solid var(--border-color)",
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
  settingsButton: {
    background: "#e5e7eb",
    color: "#111827",
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "1px solid #d1d5db",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, transform 0.15s",
  },
};