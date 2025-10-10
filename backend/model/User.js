// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String }, // may be filled later
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String }, // only for email/password users
    googleId: { type: String },     // only for Google users
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isProfileComplete: { type: Boolean, default: false },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Virtual
userSchema.virtual("fullName").get(function () {
  const f = this.firstName || "";
  const l = this.lastName || "";
  return [f, l].filter(Boolean).join(" ");
});

// Keep completion flag in sync
userSchema.pre("save", function (next) {
  this.isProfileComplete = Boolean((this.firstName && this.firstName.trim()) || (this.lastName && this.lastName.trim()));
  next();
});

module.exports = mongoose.model("User", userSchema);
