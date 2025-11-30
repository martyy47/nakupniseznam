// server/routes/invitation.js
const express = require("express");
const { Types } = require("mongoose");
const crypto = require("crypto");
const ShoppingList = require("../models/ShoppingList");
const Invitation = require("../models/Invitation");

const router = express.Router();

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
 * invitation/create
 * dtoIn: { listId, inviteeEmail }
 * POST /invitation/create
 */
router.post("/create", async (req, res) => {
  const dtoIn = req.body || {};
  const allowedKeys = ["listId", "inviteeEmail"];
  const unsupportedKeys = Object.keys(dtoIn).filter(
    (k) => !allowedKeys.includes(k)
  );
  const errors = [];

  if (!dtoIn.listId || !Types.ObjectId.isValid(dtoIn.listId)) {
    errors.push({
      invalidTypeKeyMap: { listId: "valid ObjectId" },
    });
  }
  if (typeof dtoIn.inviteeEmail !== "string" || !dtoIn.inviteeEmail.trim()) {
    errors.push({
      invalidTypeKeyMap: { inviteeEmail: "string" },
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

  const list = await ShoppingList.findById(dtoIn.listId);
  if (!list) {
    return res.status(404).json({
      uuAppErrorMap: {
        notFound: {
          type: "error",
          message: "Shopping list not found.",
          paramMap: { listId: dtoIn.listId },
        },
      },
    });
  }

  const isAdmin = req.user.profile === "Authorities";
  const isOwner = list.ownerId === req.user.id;

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      uuAppErrorMap: {
        notAuthorized: {
          type: "error",
          message: "Only owner or admin can invite members.",
          paramMap: { listId: dtoIn.listId },
        },
      },
    });
  }

  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 dní

  const invitation = await Invitation.create({
    listId: dtoIn.listId,
    inviterId: req.user.id,
    inviteeEmail: dtoIn.inviteeEmail.trim(),
    token,
    expiresAt,
  });

  return res.json({
    uuAppErrorMap: createErrorMap(unsupportedKeys, []),
    invitation: {
      id: invitation._id.toString(),
      listId: invitation.listId.toString(),
      inviterId: invitation.inviterId,
      inviteeEmail: invitation.inviteeEmail,
      status: invitation.status,
      token: invitation.token, // v reálu by byl spíš v emailu
      expiresAt: invitation.expiresAt.toISOString(),
    },
  });
});

/**
 * invitation/accept
 * dtoIn: { token }
 * POST /invitation/accept
 */
router.post("/accept", async (req, res) => {
  const dtoIn = req.body || {};
  const allowedKeys = ["token"];
  const unsupportedKeys = Object.keys(dtoIn).filter(
    (k) => !allowedKeys.includes(k)
  );
  const errors = [];

  if (typeof dtoIn.token !== "string" || !dtoIn.token.trim()) {
    errors.push({
      invalidTypeKeyMap: { token: "string" },
    });
  }

  if (errors.length) {
    return res.status(400).json({
      uuAppErrorMap: createErrorMap(unsupportedKeys, errors),
    });
  }

  const invitation = await Invitation.findOne({ token: dtoIn.token.trim() });
  if (!invitation) {
    return res.status(404).json({
      uuAppErrorMap: {
        notFound: {
          type: "error",
          message: "Invitation not found.",
          paramMap: { token: dtoIn.token },
        },
      },
    });
  }

  if (invitation.status === "accepted") {
    return res.status(400).json({
      uuAppErrorMap: {
        alreadyAccepted: {
          type: "warning",
          message: "Invitation has already been accepted.",
          paramMap: { token: dtoIn.token },
        },
      },
      invitation: {
        id: invitation._id.toString(),
        listId: invitation.listId.toString(),
        inviteeEmail: invitation.inviteeEmail,
        status: invitation.status,
      },
    });
  }

  if (invitation.expiresAt < new Date()) {
    return res.status(400).json({
      uuAppErrorMap: {
        expired: {
          type: "error",
          message: "Invitation expired.",
          paramMap: { token: dtoIn.token },
        },
      },
    });
  }

  // tady by se normálně vytvořil "member" z inviteeEmail → userId
  // a přidal do listMembers; pro BE4 stačí změnit status

  invitation.status = "accepted";
  await invitation.save();

  return res.json({
    uuAppErrorMap: createErrorMap(unsupportedKeys, []),
    invitation: {
      id: invitation._id.toString(),
      listId: invitation.listId.toString(),
      inviteeEmail: invitation.inviteeEmail,
      status: invitation.status,
    },
  });
});

module.exports = router;