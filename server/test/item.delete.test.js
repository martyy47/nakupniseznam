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

describe("item/delete", () => {
  test("happy day – smaže položku", async () => {
    // 1) vytvoříme seznam
    const listRes = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Mazání položky" });

    expect(listRes.status).toBe(200);
    const listId = listRes.body.id;

    // 2) přidáme položku
    const addRes = await request(app)
      .post("/item/add")
      .send({ listId, name: "Máslo" });

    expect(addRes.status).toBe(200);
    const itemId = addRes.body.item.id; // 👈 zase item.id

    // 3) smažeme položku
    const delRes = await request(app)
      .post("/item/delete")
      .send({ id: itemId });

    expect(delRes.status).toBe(200);
    // můžeš přidat další kontroly podle toho, co delete vrací
  });

  test("alternative – neexistující id", async () => {
    const res = await request(app)
      .post("/item/delete")
      .send({ id: "ffffffffffffffffffffffff" });

    expect([400, 404]).toContain(res.status);
  });
});