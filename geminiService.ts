
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeVideoLink = async (url: string) => {
  const apiKey = process.env.API_KEY || "";
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const modelName = "gemini-3-pro-preview";
  
  const prompt = `
    تحليل احترافي لرابط الفيديو: ${url}
    
    المهام:
    1. حدد المنصة (TikTok, Instagram, YouTube, etc.)
    2. ابحث عن أحدث طريقة لتحميل هذا المقطع خصيصاً "بدون علامة مائية" وبأعلى جودة (1080p/4K).
    3. إذا كان المقطع من إنستغرام (Reels/Video)، ابحث عن روابط توفر التحميل المباشر.
    4. لخص محتوى الفيديو في جملة جذابة.
    5. اقترح وسوماً (Tags) مناسبة لزيادة الانتشار.
    
    يجب أن يكون الرد بتنسيق JSON حصراً.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            bestQuality: { type: Type.STRING },
            downloadInstructions: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            downloadLink: { type: Type.STRING, description: "Direct download link if found" }
          },
          required: ["platform", "title", "summary", "downloadInstructions"]
        }
      }
    });

    const result = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { ...result, sources };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
