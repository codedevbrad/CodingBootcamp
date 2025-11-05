import InspirationCreate from "./client.create";
import InspirationList from "./client.list";

export default async function InspirationsPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inspirations</h1>
        <InspirationCreate />
      </div>

      <InspirationList />
    </main>
  );
}
