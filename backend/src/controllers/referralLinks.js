// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const User = require("../models/users");
const ReferralLink = require("../models/referralLink");

exports.generateReferralLink = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Extract the userId from the JWT token
    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;

    // Delete the existing referral link(s)
    await ReferralLink.deleteMany({ userId });

    // Get the current date
    const currentDate = new Date();

    // Set expiresAt to one month from the current date
    currentDate.setMonth(currentDate.getMonth() + 1);

    // Create a new referral link
    const referralLink = new ReferralLink({
      userId,
      code: uuid.v4(),
      expiresAt: currentDate, // One month from today
    });

    await referralLink.save();

    // Link the new referral link to the user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { referralLinks: [referralLink._id] }, // Use $set to replace the entire array
      },
      { new: true }
    );

    res.json({ referralLink: referralLink.code });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
