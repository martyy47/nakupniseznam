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

describe("shoppingList/delete", () => {
  test("happy day – smaže existující seznam", async () => {
    const createRes = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Smazat mě" });

    const id = createRes.body.id;

    const deleteRes = await request(app)
      .post("/shoppingList/delete")
      .send({ id });

    expect(deleteRes.status).toBe(200);

    // Po smazání GET vrátí chybu
    const getRes = await request(app)
      .get(`/shoppingList/get?id=${id}`);

    expect([400, 404]).toContain(getRes.status);
  });

  test("alternative – mazání neexistujícího id", async () => {
    const res = await request(app)
      .post("/shoppingList/delete")
      .send({ id: "ffffffffffffffffffffffff" });

    expect([400, 404]).toContain(res.status);
  });
});