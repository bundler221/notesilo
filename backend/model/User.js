const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String }, // may be filled later
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String }, // only for email/password users
    googleId: { type: String },     // only for Google users
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isProfileComplete: { type: Boolean, default: false }, // new field
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
