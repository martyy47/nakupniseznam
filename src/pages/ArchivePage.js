// src/pages/ArchivePage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const INITIAL_ARCHIVE = [
  { id: "a1", name: "Penny - minulý týden" },
  { id: "a2", name: "BILLA něco dobrýho" },
];

export default function ArchivePage() {
  const [lists, setLists] = useState(INITIAL_ARCHIVE);

  const removeOne = (id) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  };

  const removeAll = () => {
    setLists([]);
  };

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        <div style={s.topBar}>
          <span style={s.topRoute}>/archiv</span>
          <span style={s.statusIcons}>12:34  |  🔋📶</span>
        </div>

        <h1 style={s.title}>ARCHIV SEZNAMŮ</h1>

        <div style={s.listArea}>
          {lists.length === 0 && (
            <div style={s.emptyText}>Archiv je prázdný.</div>
          )}

          {lists.map((l) => (
            <div key={l.id} style={s.tile}>
              <div style={s.tileHeader}>
                <span>{l.name}</span>
                <button
                  style={s.iconButtonDanger}
                  onClick={() => removeOne(l.id)}
                >
                  🗑️
                </button>
              </div>
              <button style={s.detailButton}>Zobrazit detail</button>
            </div>
          ))}
        </div>

        <button
          style={{ ...s.dangerButton, marginTop: 12 }}
          onClick={removeAll}
        >
          Smazat všechny
        </button>

        <div style={{ marginTop: 8, fontSize: 12 }}>
          <Link to="/list">← Zpět na seznamy</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: {
    minHeight: "100vh",
    background: "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  phone: {
    width: 420,
    minHeight: 720,
    background: "#b3b3b3",
    borderRadius: 32,
    padding: 16,
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#eee",
    marginBottom: 8,
  },
  topRoute: { opacity: 0.7 },
  statusIcons: { opacity: 0.8 },
  title: {
    textAlign: "center",
    margin: "4px 0 12px",
    fontSize: 22,
  },
  listArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tile: {
    background: "#fff",
    borderRadius: 16,
    padding: 10,
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  tileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButtonDanger: {
    border: "none",
    background: "#ffdddd",
    borderRadius: 999,
    padding: "4px 6px",
    cursor: "pointer",
  },
  detailButton: {
    alignSelf: "center",
    border: "none",
    borderRadius: 999,
    padding: "6px 16px",
    background: "#e0e0e0",
    cursor: "pointer",
  },
  dangerButton: {
    border: "none",
    borderRadius: 999,
    padding: "10px 16px",
    background: "#ff5555",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  emptyText: {
    color: "#444",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 12,
  },
};
