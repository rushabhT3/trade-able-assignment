const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = require("../../src/app"); // Import your express app
const User = require("../../src/models/users");
const ReferralLink = require("../../src/models/referralLink");

describe("User Controller", () => {
  let user;
  let token;

  beforeAll(async () => {
    user = new User({
      username: "testusermmm",
      email: "testusermmm@example.com",
      password: await bcrypt.hash("password123mmm", 10),
      credits: 10,
    });
    await user.save();

    // Generate a JWT token
    token = jwt.sign({ userId: user._id }, "your_secret_key");
  });

  describe("registerUser", () => {
    // it("should register a new user", async () => {
    //   const newUser = {
    //     username: "newusermm",
    //     email: "newuser@examplemm.com",
    //     password: "password123mm",
    //     // referralLink: "refcode123",
    //   };

    //   const res = await request(app)
    //     .post("/api/register")
    //     .send(newUser)
    //     .expect(201);

    //   expect(res.body.username).toBe(newUser.username);
    //   expect(res.body.email).toBe(newUser.email);
    // });

    it("should return 400 if referral link is invalid", async () => {
      const newUser = {
        username: "newuser1",
        email: "newuser1@example.com",
        password: "password123",
        referralLink: "invalid_refcode",
      };

      const res = await request(app).post("/api/register").send(newUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid referral link.");
    });

    it("should return 400 if referral link is expired", async () => {
      const newUser = {
        username: "newuser2",
        email: "newuser2@example.com",
        password: "password123",
        referralLink: "expired_refcode",
      };

      const res = await request(app).post("/api/register").send(newUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid referral link.");
    });

    // Add more test cases for error handling
  });

  describe("signinUser", () => {
    it("should sign in a user and return a token", async () => {
      const reqBody = {
        email: "testusermmm@example.com",
        password: "password123mmm",
      };

      const res = await request(app)
        .post("/api/login")
        .send(reqBody)
        .expect(200);

      expect(res.body).toHaveProperty("token");
    });

    // Add more test cases for error handling
  });

  describe("getUserData", () => {
    it("should get user data", async () => {
      const res = await request(app)
        .get("/api/balance")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.balance).toBe(user.credits);
    });

    // Add more test cases for error handling
  });

  afterAll(async () => {
    await User.deleteOne({ _id: user._id });
    await ReferralLink.deleteMany({ userId: user._id });

    // Close Mongoose connection
    await mongoose.connection.close();
  });
});
