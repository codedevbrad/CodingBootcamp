"use client"

import { useConcepts } from "../../hooks/useConcepts"
import ConceptModal from "./(concepts)/modal"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CartoonCard from "@/components/custom/cartoonCard"

export default function ConceptsAdminPage() {
  const { concepts, isLoading, mutate } = useConcepts();

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">        
    
      <CartoonCard label="Concepts" title="What are concepts?">
          Concepts are the foundational ideas or principles that form the basis
          of a subject or field of study. 
          They help in understanding and organizing knowledge.
      </CartoonCard>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Concepts</h1>
        <ConceptModal mode="create" onSaved={() => mutate()} />
      </div>

      {isLoading && (
        <p className="text-zinc-500">Loading concepts...</p>
      )}

      <div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concepts?.map((concept: any) => (
              <Card key={concept.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {concept.title}
                    <ConceptModal mode="edit" concept={concept} onSaved={() => mutate()} />
                  </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-zinc-600">
                      <strong>Key:</strong> {concept.key}
                    </p>
                    <p className="mt-2 text-sm text-zinc-700">
                      {concept.description}
                    </p>

                    <div className="flex flex-row justify-end py-4">
                        <Button variant={'default'}>
                            <Link href={`/creator/concepts/${ concept.id }`}>
                                Work on concept
                            </Link>
                        </Button>
                    </div>
                </CardContent>
              </Card>
            ))} 
         </div>
       </div>

    </div>
  );
}
