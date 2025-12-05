// server/app.js
const express = require("express");
const cors = require("cors");
const { connect } = require("./db");
const auth = require("./auth");

// Routers
const shoppingListRouter = require("./routes/shoppingList");
const itemRouter = require("./routes/item");
const invitationRouter = require("./routes/invitation");

const app = express();
const PORT = process.env.PORT || 3001;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// fake auth middleware – nastaví req.user (Authorities / Operatives)
app.use(auth);

// ===== uuCmd endpoints =====
app.use("/shoppingList", shoppingListRouter);
app.use("/item", itemRouter);
app.use("/invitation", invitationRouter);

// ===== Start server + Mongo =====
// Když NEběží testy, normálně se připojíme k DB a pustíme server.
if (process.env.NODE_ENV !== "test") {
  connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ BE listening on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to connect to MongoDB:", err);
      process.exit(1);
    });
}

// Tohle je klíčové pro testy:
module.exports = app;