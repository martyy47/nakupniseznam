// server/models/Invitation.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvitationSchema = new Schema({
  listId: {
    type: Schema.Types.ObjectId,
    ref: "ShoppingList",
    required: true,
  },
  inviterId: { type: String, required: true },
  inviteeEmail: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model("Invitation", InvitationSchema);