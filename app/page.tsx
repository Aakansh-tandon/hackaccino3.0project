"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function GenerateRecipePage() {
  const [recipe, setRecipe] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateRecipe(ingredients: string[], preferences: string[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients, preferences }),
      });

      if (!res.ok) {
        // Agar API error deta hai, uska message capture kar
        const errorData = await res.json();
        throw new Error(errorData.error || "API Error");
      }

      const data = await res.json();
      setRecipe(data.recipe);
    } catch (err: any) {
      console.error("Error generating recipe:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Generate Recipe</h2>
      <Button onClick={() => generateRecipe(["tomato", "cheese"], ["vegan"])} disabled={loading}>
        {loading ? "Generating..." : "Generate Recipe"}
      </Button>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {recipe && (
        <pre className="mt-2 p-4 border border-gray-300 rounded bg-gray-100">
          {recipe}
        </pre>
      )}
    </div>
  );
}
