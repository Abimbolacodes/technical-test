"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import { ItemType } from "@/server/service/item.service";
import { Button } from "@/src/layout/button";
import { Input } from "@/src/layout/input";
import { Label } from "@/src/layout/label";
import ProductItem from "./product-item";


export interface Item {
  id: string;
  name: string;
  amount: number;
  comment?: string;
  userId: string;
  order: number;
  
}
export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", amount: 1, comment: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadItems();
    }
  }, [status, router]);


  const loadItems = async () => {
    try {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
  
      // 🛠️ Normalize backend `_id` to `id`
      const normalized = data.map((item:Item) => ({
        ...item,
        id: item.id , // fallback to _id
      }));
  
      setItems(normalized);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const createdItem = await res.json();
      setItems([...items, createdItem]);
      setNewItem({ name: "", amount: 1, comment: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };
  

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Product List</h1>
        <Button onClick={() => setShowAddForm(true)}>
          Add Product
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="comment">Comment</Label>
                <Input
                  id="comment"
                  value={newItem.comment}
                  onChange={(e) => setNewItem({ ...newItem, comment: e.target.value })}
                  placeholder="Optional comment"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Add Product</Button>
              <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <ProductItem
            key={item.id}
            item={item}
            setItems={setItems}
          />
        ))}
      </div>
    </div>
  );
}
   