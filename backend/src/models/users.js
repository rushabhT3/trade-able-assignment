const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true, // Add index for efficient email-based retrieval
  },
  password: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    default: 0,
  },
  referralLinks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralLink",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
