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

describe("invitation/create", () => {
  test("happy day – vytvoří pozvánku", async () => {
    const list = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Invite" });

    expect(list.status).toBe(200);
    const listId = list.body.id;

    const res = await request(app)
      .post("/invitation/create")
      .send({ listId, inviteeEmail: "petr@example.com" });

    expect(res.status).toBe(200);

    // 🔥 podle reálné odpovědi:
    expect(res.body).toHaveProperty("invitation");
    expect(res.body.invitation).toHaveProperty("id");
    expect(res.body.invitation).toHaveProperty("token");
    expect(res.body.invitation).toHaveProperty("listId", listId);
    expect(res.body.invitation).toHaveProperty(
      "inviteeEmail",
      "petr@example.com"
    );
    expect(res.body.invitation).toHaveProperty("status", "pending");
  });

  test("alternative – neexistující listId", async () => {
    const res = await request(app)
      .post("/invitation/create")
      .send({
        listId: "ffffffffffffffffffffffff",
        inviteeEmail: "petr@example.com",
      });

    expect([400, 404]).toContain(res.status);
  });
});