const request = require("supertest");
const app = require("../app");
const { connect } = require("../db");
const mongoose = require("mongoose");

jest.setTimeout(20000);

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("shoppingList/create", () => {
  test("happy day – vytvoří nový seznam", async () => {
    const res = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Testovací seznam" })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(200);

    // --- TVOJE REÁLNÁ STRUKTURA ODPOVĚDI ---
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("ownerId");
    expect(res.body).toHaveProperty("createdAt");

    expect(res.body.name).toBe("Testovací seznam");
  });

  test("alternative – chybějící name vrátí chybu", async () => {
    const res = await request(app)
      .post("/shoppingList/create")
      .send({})
      .set("Content-Type", "application/json");

    expect([400, 422]).toContain(res.status);
  });
});