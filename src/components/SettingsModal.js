// src/components/SettingsModal.js
import React from "react";

export default function SettingsModal({
  open,
  onClose,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  user,
}) {
  if (!open) return null;

  const handleSave = () => {
    onClose();
  };

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Uživatelské nastavení</h2>
        </div>

        {/* User info (bez nadpisu!) */}
        <div style={styles.userInfo}>
          <div><strong>Jméno:</strong> {user?.name}</div>
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>ID:</strong> {user?.id}</div>
        </div>

        {/* Theme */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Vzhled</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={styles.radioRow}>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => onThemeChange("light")}
              />
              <span>Světlý režim</span>
            </label>
            <label style={styles.radioRow}>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => onThemeChange("dark")}
              />
              <span>Tmavý režim</span>
            </label>
          </div>
        </section>

        {/* Language */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Jazyk</h3>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={styles.select}
          >
            <option value="cs">Čeština</option>
            <option value="en">English</option>
          </select>
        </section>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            onClick={onClose}
            style={styles.cancelButton}
          >
            Zrušit
          </button>

          <button
            onClick={handleSave}
            style={styles.saveButton}
          >
            Uložit změny
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1200,
  },
  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 14,
    width: "min(480px, 92vw)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: 16,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 18,
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: 15,
  },
  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
  },
  select: {
    width: "100%",
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    boxSizing: "border-box",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    background: "#e5e7eb",
    color: "#111827",
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
  saveButton: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
};