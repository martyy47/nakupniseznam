// server/app.js
const express = require("express");
const cors = require("cors");
const {
  PROFILES,
  currentUserMiddleware,
  requireLogin,
  requireProfile,
} = require("./auth");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(currentUserMiddleware);

// --- In-memory „databáze“ ---------------------------------

let shoppingLists = [];   // { id, name, ownerId, createdAt }
let items = [];           // { id, listId, name, isDone, createdAt }
let listMembers = [];     // { listId, userId, role }
let invitations = [];     // { id, listId, inviterId, inviteeEmail, status, token, expiresAt }

let lastId = 1;
function genId() {
  return String(lastId++);
}

// Helper – najde list a zkontroluje oprávnění aktuálního usera
function getListForUser(req, res, listId) {
  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) {
    res.status(404).json({
      uuAppErrorMap: { notFound: `Shopping list ${listId} not found` },
    });
    return null;
  }

  const user = req.currentUser;

  // Administrátor může všechno
  if (user && user.profile === PROFILES.ADMINISTRATORS) {
    return list;
  }

  // Operative – musí být owner nebo member
  const isOwner = user && list.ownerId === user.id;
  const isMember = listMembers.some(
    (m) => m.listId === listId && m.userId === user.id
  );

  if (!isOwner && !isMember) {
    res.status(403).json({
      uuAppErrorMap: { forbidden: "User is not owner or member of the list" },
    });
    return null;
  }

  return list;
}

// --- 1) shoppingList/create --------------------------------

// uuCmd: shoppingList/create
app.post("/shoppingList/create", requireLogin, (req, res) => {
  const { name } = req.body;

  const uuAppErrorMap = {};

  if (!name || typeof name !== "string") {
    uuAppErrorMap.invalidDtoIn = "Field 'name' is required and must be string.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const id = genId();
  const createdAt = new Date().toISOString();
  const ownerId = req.currentUser.id;

  const list = { id, name, ownerId, createdAt };
  shoppingLists.push(list);

  // owner je zároveň v members
  listMembers.push({
    listId: id,
    userId: ownerId,
    role: "owner",
  });

  res.json({
    uuAppErrorMap,
    id,
    name,
    ownerId,
    createdAt,
  });
});

// --- 2) shoppingList/get -----------------------------------

app.post("/shoppingList/get", requireLogin, (req, res) => {
  const { id } = req.body;
  const uuAppErrorMap = {};

  if (!id) {
    uuAppErrorMap.invalidDtoIn = "Field 'id' is required.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const list = getListForUser(req, res, id);
  if (!list) return; // chyba už odeslaná

  const listItems = items.filter((i) => i.listId === id);
  const members = listMembers
    .filter((m) => m.listId === id)
    .map((m) => ({ userId: m.userId, role: m.role }));

  res.json({
    uuAppErrorMap,
    shoppingList: {
      id: list.id,
      name: list.name,
      ownerId: list.ownerId,
      createdAt: list.createdAt,
    },
    items: listItems,
    members,
  });
});

// --- 3) shoppingList/listMy -------------------------------

app.post("/shoppingList/listMy", requireLogin, (req, res) => {
  const { pageIndex = 0, pageSize = 20 } = req.body;
  const uuAppErrorMap = {};
  const userId = req.currentUser.id;

  // Listy, kde je user owner nebo member
  const visibleListIds = listMembers
    .filter((m) => m.userId === userId)
    .map((m) => ({ listId: m.listId, role: m.role }));

  const result = visibleListIds.map(({ listId, role }) => {
    const list = shoppingLists.find((l) => l.id === listId);
    return list
      ? {
          id: list.id,
          name: list.name,
          role,
        }
      : null;
  }).filter(Boolean);

  const total = result.length;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const page = result.slice(start, end);

  res.json({
    uuAppErrorMap,
    itemList: page,
    pageInfo: {
      pageIndex,
      pageSize,
      total,
    },
  });
});

// --- 4) shoppingList/delete -------------------------------

app.post("/shoppingList/delete", requireLogin, (req, res) => {
  const { id } = req.body;
  const uuAppErrorMap = {};

  if (!id) {
    uuAppErrorMap.invalidDtoIn = "Field 'id' is required.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const list = shoppingLists.find((l) => l.id === id);
  if (!list) {
    uuAppErrorMap.notFound = `List ${id} not found`;
    return res.status(404).json({ uuAppErrorMap });
  }

  // Operative – jen owner; Admin – všechno
  const user = req.currentUser;
  if (
    user.profile !== PROFILES.ADMINISTRATORS &&
    list.ownerId !== user.id
  ) {
    return res.status(403).json({
      uuAppErrorMap: { forbidden: "Only owner can delete list." },
    });
  }

  shoppingLists = shoppingLists.filter((l) => l.id !== id);
  items = items.filter((i) => i.listId !== id);
  listMembers = listMembers.filter((m) => m.listId !== id);
  invitations = invitations.filter((inv) => inv.listId !== id);

  res.json({
    uuAppErrorMap,
    deletedId: id,
  });
});

// --- 5) item/add ------------------------------------------

app.post("/item/add", requireLogin, (req, res) => {
  const { listId, name } = req.body;
  const uuAppErrorMap = {};

  if (!listId || !name) {
    uuAppErrorMap.invalidDtoIn = "Fields 'listId' and 'name' are required.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const list = getListForUser(req, res, listId);
  if (!list) return;

  const item = {
    id: genId(),
    listId,
    name,
    isDone: false,
    createdAt: new Date().toISOString(),
  };
  items.push(item);

  res.json({
    uuAppErrorMap,
    item,
  });
});

// --- 6) item/update ---------------------------------------

app.post("/item/update", requireLogin, (req, res) => {
  const { id, name, isDone } = req.body;
  const uuAppErrorMap = {};

  if (!id) {
    uuAppErrorMap.invalidDtoIn = "Field 'id' is required.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const item = items.find((i) => i.id === id);
  if (!item) {
    uuAppErrorMap.notFound = `Item ${id} not found`;
    return res.status(404).json({ uuAppErrorMap });
  }

  // Musíme prověřit právo k listu, ke kterému item patří
  const list = getListForUser(req, res, item.listId);
  if (!list) return;

  // Aplikace změn pouze pokud jsou ve vstupu (volitelné položky)
  if (typeof name === "string") {
    item.name = name;
  }
  if (typeof isDone === "boolean") {
    item.isDone = isDone;
  }

  res.json({
    uuAppErrorMap,
    item,
  });
});

// --- 7) item/delete ---------------------------------------

app.post("/item/delete", requireLogin, (req, res) => {
  const { id } = req.body;
  const uuAppErrorMap = {};

  if (!id) {
    uuAppErrorMap.invalidDtoIn = "Field 'id' is required.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const item = items.find((i) => i.id === id);
  if (!item) {
    uuAppErrorMap.notFound = `Item ${id} not found`;
    return res.status(404).json({ uuAppErrorMap });
  }

  const list = getListForUser(req, res, item.listId);
  if (!list) return;

  items = items.filter((i) => i.id !== id);

  res.json({
    uuAppErrorMap,
    deletedId: id,
  });
});

// --- 8) invitation/create ---------------------------------

app.post("/invitation/create", requireLogin, (req, res) => {
  const { listId, inviteeEmail } = req.body;
  const uuAppErrorMap = {};

  if (!listId || !inviteeEmail) {
    uuAppErrorMap.invalidDtoIn =
      "Fields 'listId' and 'inviteeEmail' are required.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const list = getListForUser(req, res, listId);
  if (!list) return;

  const inviterId = req.currentUser.id;
  const id = genId();
  const token = "tok_" + id; // jednoduchý token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // +7 dní

  const invitation = {
    id,
    listId,
    inviterId,
    inviteeEmail,
    status: "pending",
    token,
    expiresAt,
  };

  invitations.push(invitation);

  res.json({
    uuAppErrorMap,
    invitation: {
      id,
      listId,
      inviterId,
      inviteeEmail,
      status: invitation.status,
      expiresAt,
    },
  });
});

// --- 9) invitation/accept ---------------------------------

app.post("/invitation/accept", requireLogin, (req, res) => {
  const { token } = req.body;
  const uuAppErrorMap = {};

  if (!token) {
    uuAppErrorMap.invalidDtoIn = "Field 'token' is required.";
    return res.status(400).json({ uuAppErrorMap });
  }

  const invitation = invitations.find((inv) => inv.token === token);
  if (!invitation) {
    uuAppErrorMap.notFound = "Invitation not found.";
    return res.status(404).json({ uuAppErrorMap });
  }

  if (invitation.status !== "pending") {
    uuAppErrorMap.invalidState = "Invitation is not pending.";
    return res.status(400).json({ uuAppErrorMap });
  }

  // (volitelné) kontrola expirace – TODO: můžeš doplnit
  // if (invitation.expiresAt < new Date().toISOString()) ...

  invitation.status = "accepted";

  // přidáme usera jako člena seznamu
  const userId = req.currentUser.id;
  if (
    !listMembers.some(
      (m) => m.listId === invitation.listId && m.userId === userId
    )
  ) {
    listMembers.push({
      listId: invitation.listId,
      userId,
      role: "member",
    });
  }

  res.json({
    uuAppErrorMap,
    invitation: {
      id: invitation.id,
      listId: invitation.listId,
      inviteeEmail: invitation.inviteeEmail,
      status: invitation.status,
    },
  });
});

// --- start server -----------------------------------------

app.listen(PORT, () => {
  console.log(`Shopping list server running on http://localhost:${PORT}`);
  console.log("Use headers x-user-id and x-user-role to simulate login.");
});
