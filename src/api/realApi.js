import { API_BASE_URL } from "./config";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Server vrátil chybu");
  }
  return res.json();
}

export async function getShoppingLists() {
  const res = await fetch(`${API_BASE_URL}/shoppingList/list`);
  return handleResponse(res);
}

export async function getShoppingListById(id) {
  const res = await fetch(`${API_BASE_URL}/shoppingList/get?id=${id}`);
  return handleResponse(res);
}

// Zbytek může klidně zůstat TODO, pro úkol stačí mockApi
export async function createShoppingList() {
  throw new Error("Real API není implementované");
}

export async function deleteShoppingList() {
  throw new Error("Real API není implementované");
}

export async function addItemToList() {
  throw new Error("Real API není implementované");
}

export async function toggleItemDone() {
  throw new Error("Real API není implementované");
}

export async function archiveShoppingList() {
  throw new Error("Real API není implementované");
}