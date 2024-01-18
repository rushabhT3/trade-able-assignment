const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../../src/models/users");

let savedUser;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

test("create & save user successfully", async () => {
  const userData = {
    name: "Test",
    email: "test@test199999.com",
    password: "test12399991",
    credits: 10,
  };
  const validUser = new User(userData);
  savedUser = await validUser.save();

  expect(savedUser._id).toBeDefined();
  expect(savedUser.name).toBe(userData.name);
  expect(savedUser.email).toBe(userData.email);
  expect(savedUser.password).toBe(userData.password);
  expect(savedUser.credits).toBe(userData.credits);
});

// other tests can go here

afterAll(async () => {
  if (savedUser) {
    await User.deleteOne({ _id: savedUser._id });
  }
  await mongoose.connection.close();
});
