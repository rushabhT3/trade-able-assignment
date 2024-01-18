const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../../src/models/users");
const ReferralLink = require("../../src/models/referralLink");

let savedReferralLink;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);

  user = new User({
    name: "Test",
    email: "test@test199992.com",
    password: "test123199922",
    credits: 10,
  });
  await user.save();
});

test("create & save referral link successfully", async () => {
  const referralLinkData = {
    userId: user._id,
    code: "testcode12",
    uses: 0,
    expiresAt: new Date(),
  };
  const validReferralLink = new ReferralLink(referralLinkData);
  savedReferralLink = await validReferralLink.save();

  expect(savedReferralLink._id).toBeDefined();
  expect(savedReferralLink.userId.toString()).toBe(user._id.toString());
  expect(savedReferralLink.code).toBe(referralLinkData.code);
  expect(savedReferralLink.uses).toBe(referralLinkData.uses);
  expect(savedReferralLink.expiresAt).toBeDefined();
});

// other tests can go here

afterAll(async () => {
  if (savedReferralLink) {
    await ReferralLink.deleteOne({ _id: savedReferralLink._id });
  }
  await User.deleteOne({ _id: user._id });
  await mongoose.connection.close();
});
