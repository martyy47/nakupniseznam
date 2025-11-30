// server/routes/item.js
const express = require("express");
const { Types } = require("mongoose");
const ShoppingList = require("../models/ShoppingList");
const Item = require("../models/Item");

const router = express.Router();

// helper jako ve shoppingList.js (můžeš si ho pak vytáhnout do společného souboru)
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

// malý helper pro kontrolu oprávnění k listu
async function ensureCanEditList(listId, user) {
  const list = await ShoppingList.findById(listId);
  if (!list) {
    const err = new Error("Shopping list not found");
    err.code = "notFound";
    err.status = 404;
    err.paramMap = { listId };
    throw err;
  }

  const isAdmin = user?.profile === "Authorities";
  const isOwner = list.ownerId === user?.id;

  // tady bys časem doplnil i "member" logiku
  if (!isAdmin && !isOwner) {
    const err = new Error("User is not allowed to modify this list.");
    err.code = "notAuthorized";
    err.status = 403;
    err.paramMap = { listId };
    throw err;
  }

  return list;
}

/**
 * item/add
 * dtoIn: { listId, name }
 * POST /item/add
 */
router.post("/add", async (req, res) => {
  const dtoIn = req.body || {};
  const allowedKeys = ["listId", "name", "quantity", "unit"];
  const unsupportedKeys = Object.keys(dtoIn).filter(
    (k) => !allowedKeys.includes(k)
  );
  const errors = [];

  if (!dtoIn.listId || !Types.ObjectId.isValid(dtoIn.listId)) {
    errors.push({
      invalidTypeKeyMap: { listId: "valid ObjectId" },
    });
  }
  if (typeof dtoIn.name !== "string" || !dtoIn.name.trim()) {
    errors.push({
      invalidTypeKeyMap: { name: "string" },
    });
  }

  if (errors.length) {
    return res.status(400).json({
      uuAppErrorMap: createErrorMap(unsupportedKeys, errors),
    });
  }

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

  try {
    // kontrola práv (owner / admin)
    await ensureCanEditList(dtoIn.listId, req.user);

    const item = await Item.create({
      listId: dtoIn.listId,
      name: dtoIn.name.trim(),
      quantity:
        typeof dtoIn.quantity === "number" ? dtoIn.quantity : undefined,
      unit: dtoIn.unit,
      addedBy: req.user.id,
    });

    return res.json({
      uuAppErrorMap: createErrorMap(unsupportedKeys, []),
      item: {
        id: item._id.toString(),
        listId: item.listId.toString(),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        isDone: item.isDone,
        createdAt: item.createdAt.toISOString(),
      },
    });
  } catch (e) {
    if (e.code === "notFound" || e.code === "notAuthorized") {
      return res.status(e.status).json({
        uuAppErrorMap: {
          [e.code]: {
            type: "error",
            message: e.message,
            paramMap: e.paramMap,
          },
        },
      });
    }
    console.error(e);
    return res.status(500).json({
      uuAppErrorMap: {
        systemError: {
          type: "error",
          message: "Unexpected server error.",
          paramMap: {},
        },
      },
    });
  }
});

/**
 * item/update
 * dtoIn: { id, name?, isDone? }
 * POST /item/update
 */
router.post("/update", async (req, res) => {
  const dtoIn = req.body || {};
  const allowedKeys = ["id", "name", "isDone", "quantity", "unit"];
  const unsupportedKeys = Object.keys(dtoIn).filter(
    (k) => !allowedKeys.includes(k)
  );
  const errors = [];

  if (!dtoIn.id || !Types.ObjectId.isValid(dtoIn.id)) {
    errors.push({
      invalidTypeKeyMap: { id: "valid ObjectId" },
    });
  }
  if (dtoIn.name !== undefined && typeof dtoIn.name !== "string") {
    errors.push({
      invalidTypeKeyMap: { name: "string" },
    });
  }
  if (dtoIn.isDone !== undefined && typeof dtoIn.isDone !== "boolean") {
    errors.push({
      invalidTypeKeyMap: { isDone: "boolean" },
    });
  }

  if (errors.length) {
    return res.status(400).json({
      uuAppErrorMap: createErrorMap(unsupportedKeys, errors),
    });
  }

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

  try {
    const item = await Item.findById(dtoIn.id);
    if (!item) {
      return res.status(404).json({
        uuAppErrorMap: {
          notFound: {
            type: "error",
            message: "Item not found.",
            paramMap: { id: dtoIn.id },
          },
        },
      });
    }

    // kontrola oprávnění vůči listu
    await ensureCanEditList(item.listId, req.user);

    if (dtoIn.name !== undefined) item.name = dtoIn.name.trim();
    if (dtoIn.isDone !== undefined) item.isDone = dtoIn.isDone;
    if (dtoIn.quantity !== undefined) item.quantity = dtoIn.quantity;
    if (dtoIn.unit !== undefined) item.unit = dtoIn.unit;

    await item.save();

    return res.json({
      uuAppErrorMap: createErrorMap(unsupportedKeys, []),
      item: {
        id: item._id.toString(),
        listId: item.listId.toString(),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        isDone: item.isDone,
        createdAt: item.createdAt.toISOString(),
      },
    });
  } catch (e) {
    if (e.code === "notFound" || e.code === "notAuthorized") {
      return res.status(e.status).json({
        uuAppErrorMap: {
          [e.code]: {
            type: "error",
            message: e.message,
            paramMap: e.paramMap,
          },
        },
      });
    }
    console.error(e);
    return res.status(500).json({
      uuAppErrorMap: {
        systemError: {
          type: "error",
          message: "Unexpected server error.",
          paramMap: {},
        },
      },
    });
  }
});

/**
 * item/delete
 * dtoIn: { id }
 * POST /item/delete
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

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        uuAppErrorMap: {
          notFound: {
            type: "error",
            message: "Item not found.",
            paramMap: { id },
          },
        },
      });
    }

    await ensureCanEditList(item.listId, req.user);

    await Item.deleteOne({ _id: id });

    return res.json({
      uuAppErrorMap: {},
      deletedId: id,
    });
  } catch (e) {
    if (e.code === "notFound" || e.code === "notAuthorized") {
      return res.status(e.status).json({
        uuAppErrorMap: {
          [e.code]: {
            type: "error",
            message: e.message,
            paramMap: e.paramMap,
          },
        },
      });
    }
    console.error(e);
    return res.status(500).json({
      uuAppErrorMap: {
        systemError: {
          type: "error",
          message: "Unexpected server error.",
          paramMap: {},
        },
      },
    });
  }
});

module.exports = router;