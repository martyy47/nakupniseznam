// server/models/Item.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  listId: {
    type: Schema.Types.ObjectId,
    ref: "ShoppingList",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },     // nepovinné, pro budoucnost
  unit: { type: String, default: "ks" },      // "ks", "kg", ...
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
  addedBy: { type: String },                  // userId, co položku přidal
});

module.exports = mongoose.model("Item", ItemSchema);