const mongoose = require("mongoose");

const referralLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
    index: true, // Add index for efficient code-based retrieval
  },
  uses: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    // Add expiration date field
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("ReferralLink", referralLinkSchema);
