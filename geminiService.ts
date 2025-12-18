
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeVideoLink = async (url: string) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this video URL: ${url}. 
    1. Identify the social media platform (TikTok, Instagram, YouTube, Twitter).
    2. Since you are an AI assistant, provide a mock summary of what this video likely contains based on the URL structure or common trends.
    3. Provide instructions in Arabic on how to download from this platform without a watermark.
    4. Return the result in a JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            suggestedTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            instructions: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["platform", "suggestedTitle", "summary", "instructions"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
