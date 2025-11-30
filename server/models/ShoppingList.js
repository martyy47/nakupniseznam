// server/models/ShoppingList.js
const mongoose = require("mongoose");

const ShoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  archived: { type: Boolean, default: false },
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);