const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  blockExpires: {
    type: Date,
    default: Date.now(),
  },
});

// User model
const User = mongoose.model("User", userSchema);

module.exports = User;
