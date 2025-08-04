
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

  await connectMongo();

  if (req.method === "GET") {
    try {
      const items = await Item.find({ userId: session.user.id }).sort({ order: 1 });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, amount, comment } = req.body;
      
      const lastItem = await Item.findOne({ userId: session.user.id }).sort({ order: -1 });
      const order = lastItem ? lastItem.order + 1 : 0;
      
      const item = await Item.create({
        name,
        amount,
        comment,
        userId: session.user.id,
        order,
      });
      
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to create item" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}