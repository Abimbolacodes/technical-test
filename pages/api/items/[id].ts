import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectMongo } from "@/src/config/mongoose";
import { Item } from "@/server/models/item";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  await connectMongo();

  const {
    query: { id },
  } = req;

  if (req.method === "DELETE") {
    try {
      await Item.deleteOne({ _id: id, userId: session.user.id });
      return res.status(200).json({ message: "Item deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Delete failed" });
    }
  }

  

if (req.method === "PUT") {
  try {
    const { name, amount, comment } = req.body;

    const updated = await Item.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name, amount, comment },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Update failed" });
  }
}


  res.setHeader("Allow", ["DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);

}
