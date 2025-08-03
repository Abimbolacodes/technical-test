
import { useState } from "react";
// import { Item, updateItem, deleteItem } from "@/server/service/item.service";
import { Button } from "@/src/layout/button";
import { Input } from "@/src/layout/input";
import {Modal} from "@/src/layout/modal"

type Item = {
  id: string;
  name: string;
  amount: number;
  comment?: string;
  order: number;
  userId: string;
};

type Props = { 
  item: Item; 
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export default function ProductItem({ item, setItems }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [editData, setEditData] = useState({
    name:item .name,
    amount: item.amount,
    comment: item.comment || ""
  });

  const handleSave = async () => {
    await fetch(`/api/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
  
    setIsEditing(false);
    setItems(prev => prev.map(it => it.id === item.id ? { ...it, ...editData } : it));
  };
  console.log("Rendering Item:", item);

  
  const handleDelete = async () => {
    if (!item.id) {
      console.error("Item ID is undefined. Cannot delete.");
      return;
    }
  
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });
  
      setItems((prev) => prev.filter((it) => it.id !== item.id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  
  
  

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600">Amount: {item.amount}</p>
            {item.comment && (
              <p className="text-sm text-gray-500 mt-1">{item.comment}</p>
            )}
          </div>

          <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsViewing(!isViewing)}>
           {isViewing ? "Hide" : "View"}
            </Button>

            <Button onClick={() => setIsEditing(true)}>
              Edit
            </Button>

          <Modal isOpen={isViewing} onClose={() => setIsViewing(false)}>
              <h2 className="text-xl font-semibold mb-2">Product Details</h2>
              <p><strong>ID:</strong> {item.id}</p>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Amount:</strong> {item.amount}</p>
              <p><strong>Comment:</strong> {item.comment || "None"}</p>
              <p><strong>Order:</strong> {item.order}</p>
              <p><strong>User ID:</strong> {item.userId}</p>
          </Modal>


            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}