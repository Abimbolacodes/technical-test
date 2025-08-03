"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item } from "@/types/item"; // or wherever your type is
import ProductItem from "././s/product-item";

type Props = {
  item: Item;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export default function SortableProduct({ item, setItems }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ProductItem item={item} setItems={setItems} />
    </div>
  );
}
