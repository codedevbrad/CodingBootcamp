"use server"

import { getUIInspirations } from "./db";
import UIInspirationGrid from "./client.list";

export default async function UIInspirationPage() {
  const inspirations = await getUIInspirations();

  return (
    <main className="min-h-screen px-6 py-12">
      <UIInspirationGrid inspirations={inspirations} />
    </main>
  );
}

