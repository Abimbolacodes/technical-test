
import { useForm } from "react-hook-form";
import { Button } from "@/src/layout/button";
import { Input } from "@/src/layout/input";
import { Label } from "@/src/layout/label";
// import { createItem } from "@/server/service/item.service";

type FormData = {
  name: string;
  amount: number;
  comment?: string | null;
};

export default function ProductForm() {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
      <div>
      <Label>Product Name</Label>
        <Input {...register("name", { required: true })} placeholder="Enter product name" />
      </div>
      <div>
      <Label>Amount</Label>
        <Input
          type="number"
          {...register("amount", { required: true, valueAsNumber: true })}
          placeholder="Enter amount"
        />
      </div>
      <div>
      <Label>Comment (optional)</Label>
        <Input {...register("comment")} placeholder="Add a comment" />
      </div>
      <Button type="submit">Add Product</Button>
    </form>
  );
}
