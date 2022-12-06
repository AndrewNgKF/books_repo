import mongoose from "mongoose";
import validator from "validator";

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
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
