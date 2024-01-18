const express = require("express");
const router = express.Router();
const referralLinksController = require("../controllers/referralLinks");

// Generate Referral Link: /api/referral/generate - POST
router.post("/generate", referralLinksController.generateReferralLink);

// Expire Referral Link: /api/referral/expire - POST
// router.post("/expire", referralLinksController.expireReferralLink);

// Verify and Use Referral Link: /api/referral/verify - POST
// router.post("/verify", referralLinksController.verifyAndUseReferralLink);

module.exports = router;
