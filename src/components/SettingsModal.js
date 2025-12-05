// src/components/SettingsModal.js
import React from "react";
import { useLanguage } from "./language/LanguageContext";

export default function SettingsModal({
  open,
  onClose,
  theme,
  onThemeChange,
  user,
}) {
  const { language, setLanguage, t } = useLanguage();

  if (!open) return null;

  const setLight = () => onThemeChange("light");
  const setDark = () => onThemeChange("dark");

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>{t("settings.title")}</h2>
        </div>

        {/* User info */}
        <div style={styles.userInfo}>
          <div>
            <strong>{t("settings.user.name")}:</strong> {user?.name}
          </div>
          <div>
            <strong>{t("settings.user.email")}:</strong> {user?.email}
          </div>
          <div>
            <strong>{t("settings.user.id")}:</strong> {user?.id}
          </div>
        </div>

        {/* Theme */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>{t("settings.appearance")}</h3>

          <div style={styles.themeToggle}>
            <button
              type="button"
              onClick={setLight}
              style={{
                ...styles.themeOption,
                ...(theme === "light" ? styles.themeOptionActive : {}),
                borderRight: "1px solid var(--border-color)",
                borderTopLeftRadius: 999,
                borderBottomLeftRadius: 999,
              }}
            >
              {t("settings.theme.light")}
            </button>

            <button
              type="button"
              onClick={setDark}
              style={{
                ...styles.themeOption,
                ...(theme === "dark" ? styles.themeOptionActive : {}),
                borderTopRightRadius: 999,
                borderBottomRightRadius: 999,
              }}
            >
              {t("settings.theme.dark")}
            </button>
          </div>
        </section>

        {/* Language */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>{t("settings.language")}</h3>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option value="cs">{t("language.cs")}</option>
            <option value="en">{t("language.en")}</option>
          </select>
        </section>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeButton}>
            {t("settings.close")}
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
    background: "var(--bg-card)",
    color: "var(--text-main)",
    padding: 24,
    borderRadius: 14,
    width: "min(480px, 92vw)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
    border: "1px solid var(--border-color)",
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
    color: "var(--text-main)",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: 15,
  },
  themeToggle: {
    display: "inline-flex",
    borderRadius: 999,
    border: "1px solid var(--border-color)",
    overflow: "hidden",
  },
  themeOption: {
    padding: "6px 14px",
    fontSize: 14,
    border: "none",
    background: "transparent",
    color: "var(--text-main)",
    cursor: "pointer",
    minWidth: 110,
  },
  themeOptionActive: {
    background: "#2563eb",
    color: "#ffffff",
  },
  select: {
    width: "100%",
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    fontSize: 14,
    boxSizing: "border-box",
    background: "var(--bg-card)",
    color: "var(--text-main)",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  closeButton: {
    background: "#e5e7eb",
    color: "#111827",
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
};