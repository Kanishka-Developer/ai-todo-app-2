import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Todo } from '$lib/stores/todoStore';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeProductivity(todos: Todo[]) {
  const prompt = `Analyze these todos and provide insights:
    ${JSON.stringify(todos)}
    
    Provide insights in this JSON format:
    {
      "completionRate": number,
      "mostProductiveCategory": string,
      "suggestedImprovements": string[],
      "timeManagementTips": string[]
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Analysis error:', error);
    return null;
  }
}