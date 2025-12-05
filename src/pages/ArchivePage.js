// src/pages/ArchivePage.js
import React, { useMemo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApiRequest } from "../hooks/useApiRequest";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import { useLanguage } from "../components/language/LanguageContext";

const CURRENT_USER_ID = "user-1";

export default function ArchivePage() {
  const nav = useNavigate();
  const { t } = useLanguage();

  const {
    status,
    data: lists,
    error,
    execute: loadLists,
    setData: setLists,
  } = useApiRequest(api.getShoppingLists);

  const [toDeleteOne, setToDeleteOne] = useState(null);
  const [toDeleteAll, setToDeleteAll] = useState(false);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const archivedLists = useMemo(() => {
    return (lists || []).filter((l) => l.archived);
  }, [lists]);

  const openDetail = (id) => {
    nav(`/list/${id}`);
  };

  // otevře modál pro konkrétní list
  const askDeleteOne = (list) => setToDeleteOne(list);

  // potvrzení odstranění jednoho listu
  const confirmDeleteOne = async () => {
    if (!toDeleteOne) return;
    try {
      await api.deleteShoppingList(toDeleteOne.id);
      setLists((prev) => (prev || []).filter((l) => l.id !== toDeleteOne.id));
    } catch (e) {
      console.error(e);
      alert(t("archive.error.deleteOne"));
    } finally {
      setToDeleteOne(null);
    }
  };

  const cancelDeleteOne = () => setToDeleteOne(null);

  // otevře modál „smazat všechny“
  const askDeleteAll = () => setToDeleteAll(true);

  const confirmDeleteAll = async () => {
    try {
      const ids = archivedLists.map((l) => l.id);
      await Promise.all(ids.map((id) => api.deleteShoppingList(id)));
      setLists((prev) => (prev || []).filter((l) => !l.archived));
    } catch (e) {
      console.error(e);
      alert(t("archive.error.deleteAll"));
    } finally {
      setToDeleteAll(false);
    }
  };

  const cancelDeleteAll = () => setToDeleteAll(false);

  // 🔄 PENDING
  if (status === "pending" && !lists) {
    return (
      <div style={s.page}>
        <header style={s.header}>
          <h1>{t("archive.title")}</h1>
          <div style={s.headerRight}>
            <Link to="/list" style={s.backLink}>
              ← {t("archive.backToList")}
            </Link>
          </div>
        </header>

        <LoadingIndicator text={t("archive.loading")} />
      </div>
    );
  }

  // ❌ ERROR
  if (status === "error") {
    return (
      <div style={s.page}>
        <header style={s.header}>
          <h1>{t("archive.title")}</h1>
          <div style={s.headerRight}>
            <Link to="/list" style={s.backLink}>
              ← {t("archive.backToList")}
            </Link>
          </div>
        </header>

        <ErrorMessage
          message={t("archive.error.load")}
          detail={error?.message}
          onRetry={loadLists}
        />
      </div>
    );
  }

  // ✅ READY
  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1>{t("archive.title")}</h1>

        <div style={s.headerRight}>
          {archivedLists.length > 0 && (
            <button style={s.deleteAllButton} onClick={askDeleteAll}>
              {t("archive.button.deleteAll")}
            </button>
          )}

          <Link to="/list" style={s.backLink}>
            ← {t("archive.backToList")}
          </Link>
        </div>
      </header>

      <div style={s.grid}>
        {archivedLists.length === 0 && (
          <div style={s.emptyText}>{t("archive.empty")}</div>
        )}

        {archivedLists.map((list) => {
          const isOwner = list.ownerId === CURRENT_USER_ID;
          return (
            <div key={list.id} style={s.card}>
              <div style={s.cardTitle}>{list.name}</div>
              <div style={s.ownerNote}>
                {t("archive.owner")}:{" "}
                {isOwner ? t("archive.owner.you") : list.ownerName}
              </div>

              <div style={s.cardButtons}>
                <button
                  style={s.detailButton}
                  onClick={() => openDetail(list.id)}
                >
                  {t("archive.button.detail")}
                </button>

                {isOwner && (
                  <button
                    style={s.deleteButton}
                    onClick={() => askDeleteOne(list)}
                  >
                    {t("archive.button.delete")}
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
            <h3>{t("archive.modal.deleteOne.title")}</h3>
            <p>
              {t("archive.modal.deleteOne.questionPrefix")}{" "}
              <strong>{toDeleteOne.name}</strong>?
            </p>

            <div style={s.modalButtons}>
              <button style={s.cancelButton} onClick={cancelDeleteOne}>
                {t("archive.modal.cancel")}
              </button>
              <button style={s.deleteButton} onClick={confirmDeleteOne}>
                {t("archive.modal.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODÁL – smazat všechny */}
      {toDeleteAll && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h3>{t("archive.modal.deleteAll.title")}</h3>
            <p>{t("archive.modal.deleteAll.text")}</p>

            <div style={s.modalButtons}>
              <button style={s.cancelButton} onClick={cancelDeleteAll}>
                {t("archive.modal.cancel")}
              </button>
              <button style={s.deleteButton} onClick={confirmDeleteAll}>
                {t("archive.modal.deleteAllConfirm")}
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
    background: "var(--bg-card)",
    padding: 22,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
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
  emptyText: {
    color: "var(--text-muted)",
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
};