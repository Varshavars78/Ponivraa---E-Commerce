import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Helper to safely get API key
const getApiKey = () => process.env.API_KEY || '';

export const generateChatResponse = async (
  userMessage: string, 
  products: Product[]
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return "I'm sorry, I cannot connect to the AI service right now (Missing API Key). Please contact support directly.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Construct system context with product knowledge
    const productContext = products.map(p => 
      `${p.name} (${p.category}): ₹${p.discountPrice || p.price} - ${p.description} [Stock: ${p.stock}]`
    ).join('\n');

    const systemInstruction = `
      You are "Poni", the helpful AI assistant for Ponivraa, a farm-fresh e-commerce platform.
      Our mission: Delivering direct-to-consumer farm produce with 25+ years of expertise.
      Tone: Friendly, earthy, professional, and concise.
      
      Here is our current product catalog:
      ${productContext}
      
      Rules:
      1. Only answer questions related to our products, farming, healthy eating, or order processes.
      2. If a user asks about stock, refer to the list above.
      3. We only accept UPI payments currently.
      4. Keep answers short (under 50 words if possible) unless explaining a recipe or benefit.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I didn't quite catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the farm right now. Please try again later.";
  }
};
