/**
 * User Model - MongoDB Schema
 * Handles user data and password hashing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    avatar: {
      type: String,
      default: '',
    },

    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },

      notifications: {
        type: Boolean,
        default: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// HASH PASSWORD BEFORE SAVE
// ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }

  try {

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();

  } catch (error) {

    next(error);

  }

});

// ─────────────────────────────────────────────
// COMPARE PASSWORD
// ─────────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword
) {

  return bcrypt.compare(
    candidatePassword,
    this.password
  );

};

// ─────────────────────────────────────────────
// GENERATE JWT TOKEN
// ─────────────────────────────────────────────
userSchema.methods.generateToken = function () {

  return jwt.sign(

    {
      id: this._id,
      email: this.email,
    },

    process.env.JWT_SECRET || 'secretkey',

    {
      expiresIn: '7d',
    }

  );

};

// ─────────────────────────────────────────────
// REMOVE PASSWORD FROM RESPONSE
// ─────────────────────────────────────────────
userSchema.methods.toPublicJSON = function () {

  const obj = this.toObject();

  delete obj.password;

  return obj;

};

module.exports = mongoose.model(
  'User',
  userSchema
);