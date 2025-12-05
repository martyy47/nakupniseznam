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

describe("shoppingList/get", () => {
  test("happy day – vrátí existující seznam", async () => {
    // 1) nejdřív vytvoříme seznam, ať máme platné id
    const createRes = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Seznam pro GET" })
      .set("Content-Type", "application/json");

    expect(createRes.status).toBe(200);

    const created = createRes.body;
    const id = created.id;

    // 2) GET na /shoppingList/get?id=...
    const res = await request(app).get(`/shoppingList/get?id=${id}`);

    expect(res.status).toBe(200);

    // Strukturou se řiď podle toho, co ti opravdu vrací BE.
    // Podle dřívější ukázky jsi měl něco jako:
    // { uuAppErrorMap: {}, shoppingList: {...}, items: [], members: [] }

    expect(res.body).toHaveProperty("shoppingList");
    expect(res.body.shoppingList).toHaveProperty("id", id);
    expect(res.body.shoppingList).toHaveProperty("name", "Seznam pro GET");
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("members");
  });

  test("alternative – neexistující id vrátí chybu", async () => {
    const fakeId = "ffffffffffffffffffffffff";

    const res = await request(app).get(`/shoppingList/get?id=${fakeId}`);

    // Reálně to bude asi 400 nebo 404
    expect([400, 404]).toContain(res.status);
  });
});