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
      5. Use the googleMaps tool if the user asks for our location or farm address.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        tools: [{googleMaps: {}}],
      }
    });

    return response.text || "I didn't quite catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the farm right now. Please try again later.";
  }
};

export const generateProductImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K"): Promise<string | null> => {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: { 
                imageConfig: { 
                    aspectRatio: "1:1",
                    imageSize: size
                } 
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Generation Error:", error);
        return null;
    }
};

export const editProductImage = async (imageBase64: string, prompt: string): Promise<string | null> => {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    try {
        const ai = new GoogleGenAI({ apiKey });
        // Ensure base64 string doesn't have the header
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: 'image/png',
                        },
                    },
                    { text: prompt },
                ],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Edit Error:", error);
        return null;
    }
};