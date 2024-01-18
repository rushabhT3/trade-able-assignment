const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const uuid = require("uuid");

const User = require("../models/users");
const ReferralLink = require("../models/referralLink");

exports.registerUser = async (req, res) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // Ensure unique username and password
    const existingUserWithUsername = await User.findOne({
      username: req.body.username,
    });
    const existingUserWithPassword = await User.findOne({
      password: req.body.password,
    });
    if (existingUserWithUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }
    if (existingUserWithPassword) {
      return res.status(400).json({ error: "Password already exists" });
    }

    // Create the new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // Find the referrer (if any)
    const referralLinkCode = req.body.referralLink;
    console.log({ referralLinkCode });

    if (referralLinkCode) {
      const referralLink = await ReferralLink.findOne({
        code: referralLinkCode,
      });
      if (!referralLink) {
        res.status(400).json({ error: "Invalid referral link." });
        return;
      }
      if (referralLink.uses >= 5 || referralLink.expiresAt <= Date.now()) {
        res.status(400).json({ error: "Referral link is expired." });
        return;
      }
      console.log({ referralLink });
      const referrer = await User.findOne({
        referralLinks: referralLink._id,
      });
      if (referrer) {
        console.log({ referrer });
        // Update referrer's balance
        referrer.credits += 5000;
        // Increment referral link uses
        referralLink.uses++;
        await referralLink.save();

        await referrer.save();
      }
    }
    // Save the new user
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    // Verify the provided token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_secret_key"); // Replace with your actual secret key
    const userId = decoded.userId;

    const user = await User.findById(userId)
      .populate("referralLinks")
      .select("credits referralLinks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activeLink = user.referralLinks.find(
      (link) => !link.expiresAt || link.expiresAt > Date.now()
    );

    res.json({
      balance: user.credits,
      referralLink: activeLink
        ? {
            code: activeLink.code,
            isExpired: activeLink.expiresAt <= Date.now(),
            uses: activeLink.uses,
          }
        : null,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token" }); // Handle invalid token errors
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
