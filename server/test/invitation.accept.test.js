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

describe("invitation/accept", () => {
  test("happy day – přijme pozvánku", async () => {
    // 1) vytvoříme seznam
    const listRes = await request(app)
      .post("/shoppingList/create")
      .send({ name: "Invite accept" });

    expect(listRes.status).toBe(200);
    const listId = listRes.body.id;

    // 2) vytvoříme pozvánku
    const invRes = await request(app)
      .post("/invitation/create")
      .send({ listId, inviteeEmail: "petr@example.com" });

    expect(invRes.status).toBe(200);

    const token = invRes.body.invitation.token; // 👈 DŮLEŽITÉ

    // 3) accept
    const res = await request(app)
      .post("/invitation/accept")
      .send({ token });

    expect(res.status).toBe(200);
    // případně můžeš přidat:
    // expect(res.body.invitation.status).toBe("accepted");
  });

  test("alternative – neplatný token", async () => {
    const res = await request(app)
      .post("/invitation/accept")
      .send({ token: "fake-token" });

    expect([400, 404]).toContain(res.status);
  });
});