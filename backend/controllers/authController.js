/**
 * Authentication Controller
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ============================
// Generate Token (IMPORTANT)
// ============================
const generateToken = (id) => {
  return jwt.sign(
    { id }, // MUST MATCH middleware: decoded.id
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "7d" }
  );
};

// ============================
// REGISTER
// ============================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// LOGIN
// ============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET ME
// ============================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// UPDATE PROFILE
// ============================
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// CHANGE PASSWORD
// ============================
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(
      req.body.currentPassword
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};