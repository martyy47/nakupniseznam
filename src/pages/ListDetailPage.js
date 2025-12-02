// src/pages/ListDetailPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useApiRequest } from "../hooks/useApiRequest";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const CURRENT_USER_ID = "user-1";

export default function ListDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();

  const {
    status,
    data: list,
    error,
    execute: loadList,
  } = useApiRequest(() => api.getShoppingListById(id));

  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

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
    try {
      await api.updateShoppingList(id, { name, items });
      nav("/list");
    } catch (e) {
      console.error(e);
      alert("Nepodařilo se uložit změny seznamu.");
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
              <h1 style={s.title}>Detail nákupního seznamu</h1>
              <p style={s.subtitle}>
                Zobrazení a úprava existujícího nákupního seznamu.
              </p>
            </div>
            <div>
              <Link to="/list" style={s.linkBack}>
                ← Zpět na přehled
              </Link>
            </div>
          </header>

          <div style={s.card}>
            <LoadingIndicator text="Načítám seznam..." />
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
              <h1 style={s.title}>Detail nákupního seznamu</h1>
              <p style={s.subtitle}>
                Zobrazení a úprava existujícího nákupního seznamu.
              </p>
            </div>
            <div>
              <Link to="/list" style={s.linkBack}>
                ← Zpět na přehled
              </Link>
            </div>
          </header>

          <div style={s.card}>
            <ErrorMessage
              message="Nepodařilo se načíst seznam."
              detail={error?.message}
              onRetry={loadList}
            />
            <Link to="/list" style={s.linkBack}>
              ← Zpět na přehled
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
            <h1 style={s.title}>Detail nákupního seznamu</h1>
            <p style={s.subtitle}>
              Zobrazení a úprava existujícího nákupního seznamu.
            </p>
          </div>
          <div>
            <Link to="/list" style={s.linkBack}>
              ← Zpět na přehled
            </Link>
          </div>
        </header>

        <div style={s.card}>
          {/* Název seznamu */}
          <div style={s.field}>
            <label style={s.label}>Název seznamu</label>
            <input
              style={s.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Vlastník */}
          <div style={s.field}>
            <label style={s.label}>Vlastník</label>
            <input
              style={{ ...s.input, color: "#6b7280", background: "#fff" }}
              value={isOwner ? "Vy" : list.ownerName}
              readOnly
            />
          </div>

          {/* Členové – zatím dummy */}
          <div style={s.field}>
            <label style={s.label}>Členové</label>
            <input
              style={{ ...s.input, color: "#6b7280", background: "#fff" }}
              value="Zatím žádní členové"
              readOnly
            />
          </div>

          {/* Položky */}
          <div style={s.field}>
            <label style={s.label}>Položky</label>

            <ul style={s.itemsList}>
              {items.map((it, i) => (
                <li key={i} style={s.itemRow}>
                  <span>{it}</span>
                  {isOwner && (
                    <button
                      style={s.deleteSmallButton}
                      onClick={() => removeItem(i)}
                    >
                      Smazat
                    </button>
                  )}
                </li>
              ))}
              {items.length === 0 && (
                <li style={s.emptyText}>Žádné položky.</li>
              )}
            </ul>

            {isOwner && (
              <div style={s.addRow}>
                <input
                  style={s.input}
                  placeholder="Nová položka"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <button style={s.secondaryButton} onClick={addItem}>
                  Přidat položku
                </button>
              </div>
            )}
          </div>

          {/* Spodní tlačítka */}
          <div style={s.footerButtons}>
            <button style={s.cancelButton} onClick={handleCancel}>
              Zrušit
            </button>
            {isOwner && (
              <button style={s.primaryButton} onClick={handleSave}>
                Uložit změny
              </button>
            )}
          </div>
        </div>
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
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 26,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#4b5563",
    fontSize: 14,
  },
  linkBack: {
    fontSize: 14,
    color: "#2563eb",
    textDecoration: "none",
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
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
    border: "1px solid #cbd5e1",
    fontSize: 15,
    boxSizing: "border-box",
  },

  itemsList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    borderBottom: "1px solid #e5e7eb",
  },
  emptyText: {
    padding: "8px 10px",
    fontStyle: "italic",
    color: "#6b7280",
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
    background: "#fee2e2",
    color: "#ee1111ff",
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #ee1111ff",
    cursor: "pointer",
    fontWeight: 600,
  },
};
