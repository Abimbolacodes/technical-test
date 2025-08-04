'use client';
import { useState } from "react";
// import { Item, updateItem, deleteItem } from "@/server/service/item.service";
import { Button } from "@/src/layout/button";
import { Input } from "@/src/layout/input";
import {Modal} from "@/src/layout/modal"


type Item = {
  _id: string;
  name: string;
  amount: number;
  comment?: string | null;
  order: number;
  userId: string;
};

type ProductItemProps = { 
  item: Item; 
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  // index: number;
};

export default function ProductItem({ item, setItems }: ProductItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [editData, setEditData] = useState({
    name:item .name,
    amount: item.amount,
    comment: item.comment || ""
  });

  const handleSave = async () => {
    await fetch(`/api/items/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
  
    setIsEditing(false);
    setItems(prev => prev.map(it => it._id === item._id ? { ...it, ...editData } : it));
  };
  // console.log("Rendering Item:", item);

  
  const handleDelete = async () => {
    if (!item._id) {
      console.error("Item ID is undefined. Cannot delete.");
      return;
    }
  
    try {
      await fetch(`/api/items/${item._id}`, {
        method: "DELETE",
      });
  
      setItems((prev) => prev.filter((it) => it._id !== item._id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  
  // function handleDgraEnd (event: DragEvent){
  //   const {active, over} = event;

  //   if(!over)return;

  //  const itemId = active.id as string ;
  //  const newStatus = over.id as Item{'status'} 

  //  newStatus (( =>
  //   item.map (())
  //  ))
  // }
  const moveItem = (direction: "up" | "down") => {
    setItems((prevItems) => {
      const index = prevItems.findIndex((i) => i._id === item._id);
      if (index === -1) return prevItems;
  
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prevItems.length) return prevItems;
  
      const reordered = [...prevItems];
      const [movedItem] = reordered.splice(index, 1);
      reordered.splice(newIndex, 0, movedItem);
  
      // Update `order` values
      return reordered.map((it, i) => ({ ...it, order: i }));
    });
  };
  

  return (
    <div className="rounded-xl border p-5 bg-white shadow-md transition hover:shadow-lg">
  {isEditing ? (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          placeholder="Product name"
        />
        <Input
          type="number"
          value={editData.amount || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              amount: e.target.value === "" ? 0 : parseInt(e.target.value),
            })
          }
        />
        <Input
          value={editData.comment}
          onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
          placeholder="Comment"
        />
      </div>
      <div className="flex gap-3">
        <Button className="w-full md:w-auto" onClick={handleSave}>
          💾 Save
        </Button>
        <Button
          variant="secondary"
          className="w-full md:w-auto"
          onClick={() => setIsEditing(false)}
        >
          ❌ Cancel
        </Button>
      </div>
    </>
  ) : (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">Amount: <span className="font-medium">{item.amount}</span></p>
        {item.comment && (
          <p className="text-gray-500 mt-1 text-sm italic">{item.comment}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-start md:items-center">
        <Button variant="secondary" onClick={() => setIsViewing(!isViewing)}>
          {isViewing ? "🙈 Hide" : "👁️ View"}
        </Button>
        <Button onClick={() => setIsEditing(true)}>✏️ Edit</Button>
        <Button variant="danger" onClick={handleDelete}>🗑️ Delete</Button>
        <Button
          variant="ghost"
          onClick={() => moveItem("up")}
          className="text-blue-500 hover:bg-blue-100"
        >
          ⬆️
        </Button>
        <Button
          variant="ghost"
          onClick={() => moveItem("down")}
          className="text-blue-500 hover:bg-blue-100"
        >
          ⬇️
        </Button>
      </div>

      <Modal isOpen={isViewing} onClose={() => setIsViewing(false)}>
        <h2 className="text-xl font-bold mb-2">📦 Product Details</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {item.name}</p>
          <p><strong>Amount:</strong> {item.amount}</p>
          <p><strong>Comment:</strong> {item.comment || "None"}</p>
          <p><strong>Order:</strong> {item.order}</p>
        </div>
      </Modal>
    </div>
  )}
</div>

  );
}