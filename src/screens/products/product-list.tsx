'use client';
import { useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy,arrayMove } from "@dnd-kit/sortable";
// import { Item } from "@/server/service/item.service";
import ProductItem from "./product-item";
// import { reorderItems } from "@/server/service/item.service";

type Item = {
  id: string;
  name: string;
  amount: number;
  comment?: string | null;
  order: number;
  userId: string;
};

type Props = { initialItems: Item[] };

export default function ProductList({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
  
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
  
    await fetch("/api/items/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((item, index) => ({ id: item.id, order: index })) }),
    });
  };
  

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <ProductItem key={item.id} item={item} setItems={setItems} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}