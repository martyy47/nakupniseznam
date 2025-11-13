// src/pages/NewListPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CURRENT_USER_NAME = "Matyáš Novák";

export default function NewListPage() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [items, setItems] = useState(["Mléko", "Chleba"]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setNewItem("");
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // tady by se normálně volalo API / přidalo do seznamů
    nav("/list");
  };

  const handleCancel = () => {
    nav("/list");
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <header style={s.header}>
          <div>
            <h1 style={s.title}>Nový nákupní seznam</h1>
            <p style={s.subtitle}>
              Vytvoř si nový seznam a přidej položky.
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
              placeholder="Zadejte název seznamu"
            />
          </div>

          {/* Vlastník */}
          <div style={s.field}>
            <label style={s.label}>Vlastník</label>
            <div style={s.readonlyBox}>{CURRENT_USER_NAME}</div>
          </div>

        {/* Členové */}
        <div style={s.field}>
          <label style={s.label}>Členové</label>
          <input
            style={{ 
              ...s.input, 
              color: "#6b7280",        // světle šedý text
              background: "#fff"       // stejné jako Název seznamu
          }}
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
                  <button
                    style={s.deleteSmallButton}
                    onClick={() => removeItem(i)}
                  >
                    Smazat
                  </button>
                </li>
              ))}
              {items.length === 0 && (
                <li style={s.emptyText}>Zatím nemáš žádné položky.</li>
              )}
            </ul>

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
          </div>

          {/* Spodní tlačítka */}
          <div style={s.footerButtons}>
            <button style={s.cancelButton} onClick={handleCancel}>
              Zrušit
            </button>
            <button style={s.primaryButton} onClick={handleSave}>
              Uložit seznam
            </button>
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
  readonlyBox: {
    padding: "10px 12px",
    borderRadius: 8,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    fontSize: 15,
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