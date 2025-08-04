import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectMongo } from "@/src/config/mongoose";
import { Item } from "@/server/models/item";
// import {Item} from "@/src/types/items";
import { User } from "@/server/models/user";

export interface Item{
  _id: string;
  name: string;
  amount: number;
  comment?: string | null; // Allow comment to be null
  userId: string;
  order: number;
}

export async function fetchItems(email: string): Promise<Item[]> {
  await connectMongo();
  const user = await User.findOne({ email });
  if (!user) return [];

  // return Item.find({ userId: user._id }).sort({ order: 1 });
  const items = await Item.find({ userId: user._id }).sort({ order: 1 });

  return items.map((item) => ({
    _id: item._id.toString(), 
    name: item.name,
    amount: item.amount,
    comment: item?.comment,
    userId: item.userId.toString(),
    order: item.order,
  }));

}

export async function createItem(data: { name: string; amount: number; comment?: string }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("User not found");

  const maxOrder = await Item.find({ userId: user._id }).sort({ order: -1 }).limit(1);
  const newOrder = maxOrder.length ? maxOrder[0].order + 1 : 0;

  const items = await Item.find({ userId: user._id }).sort({ order: 1 });

  return items.map((item) => ({
    id: item._id.toString(), // ✅ This is the fix
    name: item.name,
    amount: item.amount,
    comment: item.comment,
    userId: item.userId.toString(),
    order: item.order,
  }));

  
}

export async function updateItem(id: string, data: { name: string; amount: number; comment?: string }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("User not found");

  const item = await Item.findOne({ _id: id, userId: user._id });
  if (!item) throw new Error("Item not found");

  return Item.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
}

export async function deleteItem(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("User not found");

  const item = await Item.findOne({ _id: id, userId: user._id });
  if (!item) throw new Error("Item not found");

  return Item.findByIdAndDelete(id);
}

export async function reorderItems(items: { id: string; order: number }[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("User not found");

  const updates = items.map((item) =>
    Item.updateOne({ _id: item.id, userId: user._id }, { order: item.order })
  );
  return Promise.all(updates);
}