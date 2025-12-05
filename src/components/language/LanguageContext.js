// src/components/language/LanguageContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  cs: {
    // Settings
    "settings.title": "Uživatelské nastavení",
    "settings.user.name": "Jméno",
    "settings.user.email": "Email",
    "settings.user.id": "ID",
    "settings.appearance": "Vzhled",
    "settings.language": "Jazyk",
    "settings.theme.light": "Světlý režim",
    "settings.theme.dark": "Tmavý režim",
    "settings.close": "Zavřít",
    "language.cs": "Čeština",
    "language.en": "Angličtina",

    // List page
    "list.title": "Nákupní seznamy",
    "list.button.showArchived": "Zobrazit archivované",
    "list.button.new": "Nový seznam",
    "list.empty": "Žádné seznamy k zobrazení.",
    "list.owner": "Vlastník",
    "list.owner.you": "Vy",
    "list.button.detail": "Zobrazit detail",
    "list.button.delete": "Smazat",
    "list.itemsCount": "Počet položek",
    "list.delete.title": "Smazat nákupní seznam",
    "list.delete.questionPrefix": "Opravdu chceš smazat",
    "list.delete.cancel": "Zrušit",
    "list.delete.confirm": "Smazat",

    // Archive page
    "archive.title": "Archivované seznamy",
    "archive.backToList": "Zpět na přehled",
    "archive.loading": "Načítám archivované seznamy...",
    "archive.error.load": "Nepodařilo se načíst archivované seznamy.",
    "archive.empty": "Archiv je prázdný.",
    "archive.owner": "Vlastník",
    "archive.owner.you": "Vy",
    "archive.button.detail": "Zobrazit detail",
    "archive.button.delete": "Smazat",
    "archive.button.deleteAll": "Smazat všechny archivované",

    "archive.modal.deleteOne.title": "Smazat archivovaný seznam",
    "archive.modal.deleteOne.questionPrefix": "Opravdu chceš smazat",
    "archive.modal.deleteAll.title": "Smazat všechny archivované seznamy",
    "archive.modal.deleteAll.text":
    "Opravdu chceš nenávratně smazat všechny archivované seznamy?",
    "archive.modal.cancel": "Zrušit",
    "archive.modal.delete": "Smazat",
    "archive.modal.deleteAllConfirm": "Smazat vše",

    "archive.error.deleteOne": "Nepodařilo se smazat archivovaný seznam.",
    "archive.error.deleteAll": "Nepodařilo se smazat všechny archivované seznamy.",

    // Detail page
    "detail.title": "Detail nákupního seznamu",
    "detail.subtitle": "Zobrazení a úprava existujícího nákupního seznamu.",
    "detail.backToList": "Zpět na přehled",
    "detail.loading": "Načítám seznam...",
    "detail.error.load": "Nepodařilo se načíst seznam.",

    "detail.field.name": "Název seznamu",
    "detail.field.owner": "Vlastník",
    "detail.field.members": "Členové",
    "detail.field.members.placeholder": "Zatím žádní členové",
    "detail.field.items": "Položky",

    "detail.items.empty": "Žádné položky.",
    "detail.items.newPlaceholder": "Nová položka",
    "detail.items.addButton": "Přidat položku",
    "detail.button.deleteItem": "Smazat",

    "detail.buttons.cancel": "Zrušit",
    "detail.buttons.save": "Uložit změny",

    "detail.item.status.todo": "Nevyřešená",
    "detail.item.status.done": "Vyřešená",

    "detail.modal.title": "Upozornění",
    "detail.modal.ok": "OK",
    "detail.validation.nameRequired": "Zadejte název seznamu.",
    "detail.error.save": "Nepodařilo se uložit změny seznamu.",
    "detail.owner.you": "Vy",

    // New list page
    "newList.title": "Nový nákupní seznam",
    "newList.subtitle": "Vytvoř si nový seznam a přidej položky.",
    "newList.backToList": "Zpět na přehled",

    "newList.field.name": "Název seznamu",
    "newList.field.name.placeholder": "Zadejte název seznamu",
    "newList.field.owner": "Vlastník",
    "newList.field.members": "Členové",
    "newList.field.members.placeholder": "Zatím žádní členové",
    "newList.field.items": "Položky",

    "newList.items.empty": "Zatím nemáš žádné položky.",
    "newList.items.newPlaceholder": "Nová položka",
    "newList.items.addButton": "Přidat položku",
    "newList.button.deleteItem": "Smazat",

    "newList.buttons.cancel": "Zrušit",
    "newList.buttons.save": "Uložit seznam",
    "newList.buttons.saving": "Ukládám...",

    "newList.modal.title": "Upozornění",
    "newList.modal.ok": "OK",
    "newList.validation.nameRequired": "Zadejte název seznamu.",
    "newList.error.save": "Nepodařilo se uložit nový seznam.",

    // Loading / error
    "list.loading": "Načítám nákupní seznamy...",
    "list.error.load": "Nepodařilo se načíst nákupní seznamy.",
    "list.error.delete": "Nepodařilo se smazat seznam.",
  },

  en: {
    // Settings
    "settings.title": "User settings",
    "settings.user.name": "Name",
    "settings.user.email": "Email",
    "settings.user.id": "ID",
    "settings.appearance": "Appearance",
    "settings.language": "Language",
    "settings.theme.light": "Light mode",
    "settings.theme.dark": "Dark mode",
    "settings.close": "Close",
    "language.cs": "Czech",
    "language.en": "English",

    // List page
    "list.title": "Shopping lists",
    "list.button.showArchived": "Show archived",
    "list.button.new": "New list",
    "list.empty": "No lists to display.",
    "list.owner": "Owner",
    "list.owner.you": "You",
    "list.button.detail": "Show detail",
    "list.button.delete": "Delete",
    "list.itemsCount": "Items count",
    "list.delete.title": "Delete shopping list",
    "list.delete.questionPrefix": "Do you really want to delete",
    "list.delete.cancel": "Cancel",
    "list.delete.confirm": "Delete",

    // Archive page
    "archive.title": "Archived lists",
    "archive.backToList": "Back to overview",
    "archive.loading": "Loading archived lists...",
    "archive.error.load": "Failed to load archived lists.",
    "archive.empty": "Archive is empty.",
    "archive.owner": "Owner",
    "archive.owner.you": "You",
    "archive.button.detail": "Show detail",
    "archive.button.delete": "Delete",
    "archive.button.deleteAll": "Delete all archived",

    "archive.modal.deleteOne.title": "Delete archived list",
    "archive.modal.deleteOne.questionPrefix": "Do you really want to delete",
    "archive.modal.deleteAll.title": "Delete all archived lists",
    "archive.modal.deleteAll.text":
    "Do you really want to permanently delete all archived lists?",
    "archive.modal.cancel": "Cancel",
    "archive.modal.delete": "Delete",
    "archive.modal.deleteAllConfirm": "Delete all",

    "archive.error.deleteOne": "Failed to delete archived list.",
    "archive.error.deleteAll": "Failed to delete all archived lists.",

    // Detail page
    "detail.title": "Shopping list detail",
    "detail.subtitle": "View and edit an existing shopping list.",
    "detail.backToList": "Back to overview",
    "detail.loading": "Loading list...",
    "detail.error.load": "Failed to load the list.",

    "detail.field.name": "List name",
    "detail.field.owner": "Owner",
    "detail.field.members": "Members",
    "detail.field.members.placeholder": "No members yet",
    "detail.field.items": "Items",

    "detail.items.empty": "No items.",
    "detail.items.newPlaceholder": "New item",
    "detail.items.addButton": "Add item",
    "detail.button.deleteItem": "Delete",

    "detail.buttons.cancel": "Cancel",
    "detail.buttons.save": "Save changes",

    "detail.item.status.todo": "Not done",
    "detail.item.status.done": "Done",

    "detail.modal.title": "Notice",
    "detail.modal.ok": "OK",
    "detail.validation.nameRequired": "Please enter the list name.",
    "detail.error.save": "Failed to save list changes.",
    "detail.owner.you": "You",

    // New list page
    "newList.title": "New shopping list",
    "newList.subtitle": "Create a new list and add items.",
    "newList.backToList": "Back to overview",

    "newList.field.name": "List name",
    "newList.field.name.placeholder": "Enter list name",
    "newList.field.owner": "Owner",
    "newList.field.members": "Members",
    "newList.field.members.placeholder": "No members yet",
    "newList.field.items": "Items",

    "newList.items.empty": "You don't have any items yet.",
    "newList.items.newPlaceholder": "New item",
    "newList.items.addButton": "Add item",
    "newList.button.deleteItem": "Delete",

    "newList.buttons.cancel": "Cancel",
    "newList.buttons.save": "Save list",
    "newList.buttons.saving": "Saving...",

    "newList.modal.title": "Notice",
    "newList.modal.ok": "OK",
    "newList.validation.nameRequired": "Please enter the list name.",
    "newList.error.save": "Failed to save new list.",


    // Loading / error
    "list.loading": "Loading shopping lists...",
    "list.error.load": "Failed to load shopping lists.",
    "list.error.delete": "Failed to delete the list.",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("cs");

  // načtení z localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("appLanguage");
      if (stored === "cs" || stored === "en") {
        setLanguage(stored);
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // zápis do localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem("appLanguage", language);
    } catch (_) {
      // ignore
    }
  }, [language]);

  const t = (key) => {
    const langTable = translations[language] || translations.cs;
    return langTable[key] || translations.cs[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}