// src/pages/ListDetailPage.js
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const CURRENT_USER_ID = "user-1";

// jednoduchý mock, jen pro vzhled a základní logiku
const INITIAL_LISTS = [
  {
    id: "list-1",
    name: "Penny - týdenní nákup",
    ownerId: "user-1",
    ownerName: "Matyáš Novák",
    items: ["Mléko", "Chleba"],
  },
  {
    id: "list-2",
    name: "Lidl - párty nákup",
    ownerId: "user-1",
    ownerName: "Matyáš Novák",
    items: ["Brambůrky", "Kola"],
  },
  {
    id: "list-3",
    name: "Billa - minulý měsíc",
    ownerId: "user-2",
    ownerName: "Jana",
    items: ["Voda", "Vodka 1L", "Pomeranče 0,5kg", "Rohlíky 5ks"],
  },
];

export default function ListDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();

  const initialList = INITIAL_LISTS.find((l) => l.id === id) || null;

  const [name, setName] = useState(initialList ? initialList.name : "");
  const [items, setItems] = useState(initialList ? initialList.items : []);
  const [newItem, setNewItem] = useState("");

  const isOwner =
    initialList && initialList.ownerId === CURRENT_USER_ID;

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
    // tady by se normálně volalo API / propsalo do globálního stavu
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

        {!initialList ? (
          <div style={s.card}>
            <p>Seznam nebyl nalezen.</p>
            <Link to="/list" style={s.linkBack}>
              ← Zpět na přehled
            </Link>
          </div>
        ) : (
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
                value={isOwner ? "Vy" : initialList.ownerName}
                readOnly
              />
            </div>

            {/* Členové */}
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