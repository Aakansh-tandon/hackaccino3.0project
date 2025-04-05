// app/api/recipe/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Set up Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: Request) {
  try {
    const { ingredients, preferences = [] } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "Ingredients are required and must be an array" }, { status: 400 });
    }

    const ingredientsList = ingredients.join(", ");
    const preferencesText = preferences.length
      ? `Consider these dietary preferences: ${preferences.join(", ")}.`
      : "";

    const prompt = `
      Create a recipe using some or all of these ingredients: ${ingredientsList}.
      ${preferencesText}
      Format the recipe with:
      1. A creative title
      2. A brief description
      3. List of ingredients with quantities
      4. Step-by-step cooking instructions
      5. Cooking time and difficulty level
    `;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      recipe: text,
    });
  } catch (error) {
    console.error("Gemini generation error:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
