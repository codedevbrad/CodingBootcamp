import CartoonCard from "@/components/custom/cartoonCard";
import InspirationCreate from "./client.create";
import InspirationList from "./client.list";

export default async function InspirationsPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 space-y-6">

      <CartoonCard label="Inspiration" title="What are inspirations?">
          <p> 
            Inspirations are ideas or examples that one could try recreating or find useful. 
           </p>
      </CartoonCard>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inspirations</h1>
        <InspirationCreate />
      </div>

      <InspirationList />
    </main>
  );
}
