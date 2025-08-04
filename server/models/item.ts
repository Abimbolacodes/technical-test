
import mongoose, { Schema } from "mongoose";

const ItemSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  comment: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Item =  mongoose.model("Item", ItemSchema);
