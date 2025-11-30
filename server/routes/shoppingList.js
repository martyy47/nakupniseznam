// server/routes/shoppingList.js
const express = require("express");
const { Types } = require("mongoose");
const ShoppingList = require("../models/ShoppingList");

const router = express.Router();

// uuApp-like errorMap helper (zjednodušená verze)
function createErrorMap(warnings = [], errors = []) {
  const map = {};
  if (warnings.length) {
    map.unsupportedKeys = {
      type: "warning",
      message: "DtoIn contains unsupported keys.",
      paramMap: { unsupportedKeyList: warnings },
    };
  }
  if (errors.length) {
    map.invalidDtoIn = {
      type: "error",
      message: "DtoIn is not valid.",
      paramMap: errors[0],
    };
  }
  return map;
}

/**
 * shoppingList/create
 * dtoIn: { name }
 */
router.post("/create", async (req, res) => {
  const dtoIn = req.body || {};
  const allowedKeys = ["name"];
  const unsupportedKeys = Object.keys(dtoIn).filter(
    (k) => !allowedKeys.includes(k)
  );
  const errors = [];

  if (typeof dtoIn.name !== "string" || !dtoIn.name.trim()) {
    errors.push({
      invalidTypeKeyMap: { name: "string" },
    });
  }

  if (!req.user || !req.user.id) {
    // není přihlášený uživatel
    return res.status(401).json({
      uuAppErrorMap: {
        notAuthenticated: {
          type: "error",
          message: "User is not authenticated.",
          paramMap: {},
        },
      },
    });
  }

  if (errors.length) {
    return res.status(400).json({
      uuAppErrorMap: createErrorMap(unsupportedKeys, errors),
    });
  }

  const list = await ShoppingList.create({
    name: dtoIn.name.trim(),
    ownerId: req.user.id,
  });

  return res.json({
    uuAppErrorMap: createErrorMap(unsupportedKeys, []),
    id: list._id.toString(),
    name: list.name,
    ownerId: list.ownerId,
    createdAt: list.createdAt.toISOString(),
  });
});

/**
 * shoppingList/get
 * dtoIn: { id }
 * GET /shoppingList/get?id=...
 */
router.get("/get", async (req, res) => {
  const id = req.query.id;

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      uuAppErrorMap: createErrorMap([], [
        { invalidTypeKeyMap: { id: "valid ObjectId" } },
      ]),
    });
  }

  const list = await ShoppingList.findById(id);
  if (!list) {
    return res.status(404).json({
      uuAppErrorMap: {
        notFound: {
          type: "error",
          message: "Shopping list not found.",
          paramMap: { id },
        },
      },
    });
  }

  // Později sem doplníme items + members
  return res.json({
    uuAppErrorMap: {},
    shoppingList: {
      id: list._id.toString(),
      name: list.name,
      ownerId: list.ownerId,
      createdAt: list.createdAt.toISOString(),
    },
    items: [],
    members: [
      {
        userId: list.ownerId,
        role: "owner",
      },
      // tady bychom časem doplnili members
    ],
  });
});

/**
 * shoppingList/listMy
 * dtoIn: { pageIndex, pageSize }
 * GET /shoppingList/listMy?pageIndex=0&pageSize=20
 */
router.get("/listMy", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      uuAppErrorMap: {
        notAuthenticated: {
          type: "error",
          message: "User is not authenticated.",
          paramMap: {},
        },
      },
    });
  }

  const pageIndex = Number(req.query.pageIndex ?? 0);
  const pageSize = Number(req.query.pageSize ?? 20);

  // Zjednodušeně: zatím bereme jen seznamy, kde je owner = user
  const filter = { ownerId: req.user.id };

  const total = await ShoppingList.countDocuments(filter);
  const lists = await ShoppingList.find(filter)
    .sort({ createdAt: -1 })
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  return res.json({
    uuAppErrorMap: {},
    itemList: lists.map((l) => ({
      id: l._id.toString(),
      name: l.name,
      role: "owner", // až přidáme members, budeme umět i "member"
    })),
    pageInfo: {
      pageIndex,
      pageSize,
      total,
    },
  });
});

/**
 * shoppingList/delete
 * dtoIn: { id }
 * POST /shoppingList/delete
 */
router.post("/delete", async (req, res) => {
  const dtoIn = req.body || {};
  const { id } = dtoIn;

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      uuAppErrorMap: createErrorMap([], [
        { invalidTypeKeyMap: { id: "valid ObjectId" } },
      ]),
    });
  }

  const list = await ShoppingList.findById(id);
  if (!list) {
    return res.status(404).json({
      uuAppErrorMap: {
        notFound: {
          type: "error",
          message: "Shopping list not found.",
          paramMap: { id },
        },
      },
    });
  }

  // Autorizace – jen owner (nebo Authorities)
  const isAdmin = req.user?.profile === "Authorities";
  const isOwner = list.ownerId === req.user?.id;

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      uuAppErrorMap: {
        notAuthorized: {
          type: "error",
          message: "User is not allowed to delete this list.",
          paramMap: { id },
        },
      },
    });
  }

  await ShoppingList.deleteOne({ _id: id });

  return res.json({
    uuAppErrorMap: {},
    deletedId: id,
  });
});

module.exports = router;