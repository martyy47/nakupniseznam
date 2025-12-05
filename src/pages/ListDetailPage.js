// src/pages/ListDetailPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useApiRequest } from "../hooks/useApiRequest";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import { useLanguage } from "../components/language/LanguageContext";

const CURRENT_USER_ID = "user-1";

export default function ListDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();

  const {
    status,
    data: list,
    error,
    execute: loadList,
  } = useApiRequest(() => api.getShoppingListById(id));

  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // stav pro hezké modální okno (místo alert)
  const [dialogMessage, setDialogMessage] = useState(null);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // Když se poprvé načte list, propsat do lokálního stavu
  useEffect(() => {
    if (list) {
      setName(list.name || "");

      // převedeme items na pole stringů
      const normalizedItems = (list.items || []).map((it) =>
        typeof it === "string" ? it : it.text
      );

      setItems(normalizedItems);
    }
  }, [list]);

  const isOwner = list && list.ownerId === CURRENT_USER_ID;

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setNewItem("");
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setDialogMessage(t("detail.validation.nameRequired"));
      return;
    }

    try {
      await api.updateShoppingList(id, { name: trimmedName, items });
      nav("/list");
    } catch (e) {
      console.error(e);
      setDialogMessage(t("detail.error.save"));
    }
  };

  const handleCancel = () => {
    nav("/list");
  };

  // 🔄 PENDING
  if (status === "pending" && !list) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <header style={s.header}>
            <div>
              <h1 style={s.title}>{t("detail.title")}</h1>
              <p style={s.subtitle}>{t("detail.subtitle")}</p>
            </div>
            <div>
              <Link to="/list" style={s.linkBack}>
                ← {t("detail.backToList")}
              </Link>
            </div>
          </header>

          <div style={s.card}>
            <LoadingIndicator text={t("detail.loading")} />
          </div>
        </div>
      </div>
    );
  }

  // ❌ ERROR
  if (status === "error") {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <header style={s.header}>
            <div>
              <h1 style={s.title}>{t("detail.title")}</h1>
              <p style={s.subtitle}>{t("detail.subtitle")}</p>
            </div>
            <div>
              <Link to="/list" style={s.linkBack}>
                ← {t("detail.backToList")}
              </Link>
            </div>
          </header>

          <div style={s.card}>
            <ErrorMessage
              message={t("detail.error.load")}
              detail={error?.message}
              onRetry={loadList}
            />
            <Link to="/list" style={s.linkBack}>
              ← {t("detail.backToList")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ READY
  return (
    <div style={s.page}>
      <div style={s.container}>
        <header style={s.header}>
          <div>
            <h1 style={s.title}>{t("detail.title")}</h1>
            <p style={s.subtitle}>{t("detail.subtitle")}</p>
          </div>
          <div>
            <Link to="/list" style={s.linkBack}>
              ← {t("detail.backToList")}
            </Link>
          </div>
        </header>

        <div style={s.card}>
          {/* Název seznamu */}
          <div style={s.field}>
            <label style={s.label}>{t("detail.field.name")}</label>
            <input
              style={s.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Vlastník */}
          <div style={s.field}>
            <label style={s.label}>{t("detail.field.owner")}</label>
            <input
              style={{
                ...s.input,
                color: "var(--text-muted)",
              }}
              value={isOwner ? t("detail.owner.you") : list.ownerName}
              readOnly
            />
          </div>

          {/* Členové – zatím dummy */}
          <div style={s.field}>
            <label style={s.label}>{t("detail.field.members")}</label>
            <input
              style={{
                ...s.input,
                color: "var(--text-muted)",
              }}
              value={t("detail.field.members.placeholder")}
              readOnly
            />
          </div>

          {/* Položky */}
          <div style={s.field}>
            <label style={s.label}>{t("detail.field.items")}</label>

            <ul style={s.itemsList}>
              {items.map((it, i) => (
                <li key={i} style={s.itemRow}>
                  <span>{it}</span>
                  {isOwner && (
                    <button
                      style={s.deleteSmallButton}
                      onClick={() => removeItem(i)}
                    >
                      {t("detail.button.deleteItem")}
                    </button>
                  )}
                </li>
              ))}
              {items.length === 0 && (
                <li style={s.emptyText}>{t("detail.items.empty")}</li>
              )}
            </ul>

            {isOwner && (
              <div style={s.addRow}>
                <input
                  style={s.input}
                  placeholder={t("detail.items.newPlaceholder")}
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <button style={s.secondaryButton} onClick={addItem}>
                  {t("detail.items.addButton")}
                </button>
              </div>
            )}
          </div>

          {/* Spodní tlačítka */}
          <div style={s.footerButtons}>
            <button style={s.cancelButton} onClick={handleCancel}>
              {t("detail.buttons.cancel")}
            </button>
            {isOwner && (
              <button style={s.primaryButton} onClick={handleSave}>
                {t("detail.buttons.save")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modální okno pro chyby / validaci názvu */}
      {dialogMessage && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>{t("detail.modal.title")}</h2>
            <p style={s.modalText}>{dialogMessage}</p>
            <div style={s.modalButtons}>
              <button
                style={s.primaryButton}
                onClick={() => setDialogMessage(null)}
              >
                {t("detail.modal.ok")}
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
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 26,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "var(--text-muted)",
    fontSize: 14,
  },
  linkBack: {
    fontSize: 14,
    color: "#2563eb",
    textDecoration: "none",
  },

  card: {
    background: "var(--bg-card)",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid var(--border-color)",
  },

  field: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    fontSize: 15,
    boxSizing: "border-box",
    background: "var(--bg-card)",
    color: "var(--text-main)",
  },

  itemsList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 10px",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--bg-card)",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    borderBottom: "1px solid var(--border-color)",
  },
  emptyText: {
    padding: "8px 10px",
    fontStyle: "italic",
    color: "var(--text-muted)",
  },
  addRow: {
    display: "flex",
    gap: 10,
    marginTop: 8,
  },

  footerButtons: {
    marginTop: 24,
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
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
  cancelButton: {
    background: "#e5e7eb",
    color: "#111827",
    padding: "10px 20px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
  secondaryButton: {
    background: "#f1f5f9",
    color: "#111827",
    padding: "10px 18px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  deleteSmallButton: {
    background: "var(--delete-bg)",
    color: "#ee1111ff",
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #ee1111ff",
    cursor: "pointer",
    fontWeight: 600,
  },

  // styly pro modální okno
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "var(--bg-card)",
    color: "var(--text-main)",
    borderRadius: 16,
    padding: 24,
    maxWidth: 420,
    width: "90%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    border: "1px solid var(--border-color)",
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  modalText: {
    marginTop: 12,
    marginBottom: 20,
    fontSize: 14,
    color: "var(--text-muted)",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
};