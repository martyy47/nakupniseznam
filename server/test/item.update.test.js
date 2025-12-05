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

describe("item/update", () => {
  test("happy day – označí položku jako hotovou", async () => {
    // 1) vytvoříme seznam
    const listRes = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Update položky" });

    expect(listRes.status).toBe(200);
    const listId = listRes.body.id;

    // 2) přidáme položku
    const addRes = await request(app)
      .post("/item/add")
      .send({ listId, name: "Chléb" });

    expect(addRes.status).toBe(200);
    // 👇 DŮLEŽITÉ: id bereme z addRes.body.item.id
    const itemId = addRes.body.item.id;

    // 3) update položky
    const res = await request(app)
      .post("/item/update")
      .send({ id: itemId, isDone: true });

    expect(res.status).toBe(200);

    // předpokládám, že vracíš { item: { ... } }
    expect(res.body).toHaveProperty("item");
    expect(res.body.item).toHaveProperty("id", itemId);
    expect(res.body.item).toHaveProperty("isDone", true);
  });

  test("alternative – neexistující id", async () => {
    const res = await request(app)
      .post("/item/update")
      .send({ id: "ffffffffffffffffffffffff", isDone: true });

    expect([400, 404]).toContain(res.status);
  });
});