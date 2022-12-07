import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      unique: true,
      trim: true,
      maxlength: [30, "A user name must have less or equal then 30 characters"],
      validate: [validator.isAlphanumeric, "names must be alphanumeric"],
    },
    role: {
      type: String,
      enum: ["admin", "editor", "member"],
      default: "member",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    dateJoined: {
      type: Date,
      default: Date.now(),
    },
    pendingChanges: {
      name: {
        type: String,
        trim: true,
        unique: true,
        maxlength: [
          30,
          "A user name must have less or equal then 30 characters",
        ],
        validate: [validator.isAlphanumeric, "names must be alphanumeric"],
      },
      role: {
        type: String,
        enum: ["admin", "editor", "member"],
      },
    },
    isPendingApproval: {
      type: Boolean,
      default: false,
    },
    wasApprovedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    approvedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) return next();
  this._update.password = await bcrypt.hash(this._update.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
