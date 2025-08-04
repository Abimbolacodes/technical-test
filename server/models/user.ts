import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export const User =  mongoose.model("User", UserSchema);