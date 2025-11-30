// src/api/mockApi.js
import { mockShoppingLists } from "../mocks/mockData";

let lists = [...mockShoppingLists];

const delay = (result, ms = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

export async function getShoppingLists() {
  return delay(lists);
}

export async function getShoppingListById(id) {
  const list = lists.find((l) => l.id === id);
  if (!list) {
    // FE musí zvládnout error stav
    throw new Error("Seznam nebyl nalezen");
  }
  return delay(list);
}

// ✔️ přidáno items = [], aby se daly poslat položky z NewListPage
export async function createShoppingList({
  name,
  ownerId,
  ownerName,
  items = [],
}) {
  const newList = {
    id: "list-" + (lists.length + 1),
    name,
    ownerId,
    ownerName,
    archived: false,
    // tady uložíme, co přijde – třeba pole stringů
    items: [...items],
  };
  lists = [...lists, newList];
  return delay(newList);
}

export async function deleteShoppingList(id) {
  lists = lists.filter((l) => l.id !== id);
  return delay({ ok: true });
}

// ✔️ NOVĚ – update názvu a položek, používá ListDetailPage
export async function updateShoppingList(id, { name, items }) {
  const index = lists.findIndex((l) => l.id === id);
  if (index === -1) {
    throw new Error("Seznam nebyl nalezen");
  }

  const current = lists[index];
  const updated = {
    ...current,
    ...(typeof name !== "undefined" ? { name } : {}),
    ...(typeof items !== "undefined" ? { items: [...items] } : {}),
  };

  const newLists = [...lists];
  newLists[index] = updated;
  lists = newLists;

  return delay(updated);
}

// Tyhle klidně můžeš zatím nevyužívat, ale nechal bych je do budoucna.

export async function addItemToList(listId, text, addedBy) {
  const list = lists.find((l) => l.id === listId);
  if (!list) throw new Error("Seznam nebyl nalezen");

  const newItem = {
    id: "item-" + Date.now(),
    text,
    done: false,
    addedBy,
  };

  // POZOR: tady počítáme s tím, že items je pole objektů,
  // takže když budeš chtít tyto funkce používat, měl bys sjednotit strukturu.
  list.items = [...(list.items || []), newItem];
  return delay({ list, item: newItem });
}

export async function toggleItemDone(listId, itemId) {
  const list = lists.find((l) => l.id === listId);
  if (!list) throw new Error("Seznam nebyl nalezen");

  list.items = (list.items || []).map((item) =>
    item.id === itemId ? { ...item, done: !item.done } : item
  );

  return delay(list);
}

export async function archiveShoppingList(id) {
  const list = lists.find((l) => l.id === id);
  if (!list) throw new Error("Seznam nebyl nalezen");
  list.archived = true;
  return delay(list);
}
