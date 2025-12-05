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

describe("item/add", () => {
  test("happy day – přidá položku", async () => {
    const list = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Seznam pro položky" });

    const listId = list.body.id;

    const res = await request(app)
      .post("/item/add")
      .send({ listId, name: "Mléko" });

    expect(res.status).toBe(200);

    // 👍 podle reálné odpovědi:
    expect(res.body).toHaveProperty("item");
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item).toHaveProperty("name", "Mléko");
    expect(res.body.item).toHaveProperty("listId", listId);
    expect(res.body.item).toHaveProperty("isDone", false);
  });

  test("alternative – neexistující listId", async () => {
    const res = await request(app)
      .post("/item/add")
      .send({ listId: "ffffffffffffffffffffffff", name: "Mléko" });

    expect([400, 404]).toContain(res.status);
  });
});