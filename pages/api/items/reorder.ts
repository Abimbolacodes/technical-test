
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectMongo } from "@/src/config/mongoose";
import { Item } from "@/server/models/item";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  await connectMongo();

  try {
    const { items } = req.body;
    
    for (const { id, order } of items) {
      await Item.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        { order }
      );
    }
    
    res.status(200).json({ message: "Items reordered" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reorder items" });
  }

  
}