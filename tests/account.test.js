// tests/accounts.test.js
import request from "supertest";
import app from "../src/app.js";

describe("GET /accounts/:id", () => {
  it("should return account if user is permitted", async () => {
    const res = await request(app)
      .get("/accounts/1001")
      .set("x-user-id", "1"); // admin has full access

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", "1001");
  });

  it("should return 403 if user is not permitted", async () => {
    const res = await request(app)
      .get("/accounts/1002")
      .set("x-user-id", "4"); // newuser only owns 1001

      expect(res.statusCode).toBe(403); // Enforced, not fallback
    });

  it("should return 404 if account does not exist", async () => {
    const res = await request(app)
      .get("/accounts/9999")
      .set("x-user-id", "1");

    expect(res.statusCode).toBe(404);
  });
});
