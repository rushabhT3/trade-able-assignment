const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app"); // Import your Express app
const User = require("../../src/models/users");
const ReferralLink = require("../../src/models/referralLink");

describe("ReferralLink Generation Test", () => {
  let user;
  let token;

  beforeAll(async () => {
    user = new User({
      name: "Test",
      email: "test@testx.com",
      password: "test123x",
      credits: 10,
    });
    await user.save();

    // Generate a JWT token
    token = jwt.sign({ userId: user._id }, "your_secret_key");
  });

  test("generate referral link successfully", async () => {
    const response = await request(app)
      .post("/api/referral/generate")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const referralLink = await ReferralLink.findOne({ userId: user._id });

    expect(response.body.referralLink).toBe(referralLink.code);
  });

  afterAll(async () => {
    await User.deleteOne({ _id: user._id });
    await ReferralLink.deleteMany({ userId: user._id });
  });
});
