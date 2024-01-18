const mongoose = require("mongoose");
const app = require("../src/app");
const request = require("supertest");

describe("Test MongoDB Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await new Promise((resolve) =>
      mongoose.connection.on("connected", resolve)
    );
  });

  test("should connect to MongoDB", async () => {
    const isConnected = mongoose.connection.readyState;
    expect(isConnected).toBe(1);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app).get("/").expect(200);
  });
});
