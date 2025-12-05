// src/pages/NewListPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useLanguage } from "../components/language/LanguageContext";

const CURRENT_USER_ID = "user-1";
const CURRENT_USER_NAME = "Matyáš Novák";

export default function NewListPage() {
  const nav = useNavigate();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [items, setItems] = useState([]); // nový seznam je prázdný
  const [newItem, setNewItem] = useState("");
  const [saving, setSaving] = useState(false);

  // Stav pro naše "hezké" vyskakovací okno
  const [dialogMessage, setDialogMessage] = useState(null);

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
    if (!name.trim()) {
      setDialogMessage(t("newList.validation.nameRequired"));
      return;
    }
    setSaving(true);
    try {
      await api.createShoppingList({
        name,
        ownerId: CURRENT_USER_ID,
        ownerName: CURRENT_USER_NAME,
        items,
      });
      nav("/list");
    } catch (e) {
      console.error(e);
      setDialogMessage(t("newList.error.save"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    nav("/list");
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <header style={s.header}>
          <div>
            <h1 style={s.title}>{t("newList.title")}</h1>
            <p style={s.subtitle}>{t("newList.subtitle")}</p>
          </div>
          <div>
            <Link to="/list" style={s.linkBack}>
              ← {t("newList.backToList")}
            </Link>
          </div>
        </header>

        <div style={s.card}>
          {/* Název seznamu */}
          <div style={s.field}>
            <label style={s.label}>{t("newList.field.name")}</label>
            <input
              style={s.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("newList.field.name.placeholder")}
            />
          </div>

          {/* Vlastník */}
          <div style={s.field}>
            <label style={s.label}>{t("newList.field.owner")}</label>
            <div style={s.readonlyBox}>{CURRENT_USER_NAME}</div>
          </div>

          {/* Členové */}
          <div style={s.field}>
            <label style={s.label}>{t("newList.field.members")}</label>
            <input
              style={{
                ...s.input,
                color: "var(--text-muted)",
              }}
              value={t("newList.field.members.placeholder")}
              readOnly
            />
          </div>

          {/* Položky */}
          <div style={s.field}>
            <label style={s.label}>{t("newList.field.items")}</label>

            <ul style={s.itemsList}>
              {items.map((it, i) => (
                <li key={i} style={s.itemRow}>
                  <span>{it}</span>
                  <button
                    style={s.deleteSmallButton}
                    onClick={() => removeItem(i)}
                  >
                    {t("newList.button.deleteItem")}
                  </button>
                </li>
              ))}
              {items.length === 0 && (
                <li style={s.emptyText}>{t("newList.items.empty")}</li>
              )}
            </ul>

            <div style={s.addRow}>
              <input
                style={s.input}
                placeholder={t("newList.items.newPlaceholder")}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />
              <button style={s.secondaryButton} onClick={addItem}>
                {t("newList.items.addButton")}
              </button>
            </div>
          </div>

          {/* Spodní tlačítka */}
          <div style={s.footerButtons}>
            <button style={s.cancelButton} onClick={handleCancel}>
              {t("newList.buttons.cancel")}
            </button>
            <button
              style={s.primaryButton}
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? t("newList.buttons.saving")
                : t("newList.buttons.save")}
            </button>
          </div>
        </div>
      </div>

      {/* Hezké modální okno místo web local host alertu */}
      {dialogMessage && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>{t("newList.modal.title")}</h2>
            <p style={s.modalText}>{dialogMessage}</p>
            <div style={s.modalButtons}>
              <button
                style={s.primaryButton}
                onClick={() => setDialogMessage(null)}
              >
                {t("newList.modal.ok")}
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
    position: "relative",
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
  readonlyBox: {
    padding: "10px 12px",
    borderRadius: 8,
    background: "var(--bg-page)",
    border: "1px solid var(--border-color)",
    fontSize: 15,
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

  // Styl pro modální okno
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