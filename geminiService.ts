
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeVideoLink = async (url: string) => {
  // جلب المفتاح مع فحص الأمان
  const apiKey = (window as any).process?.env?.API_KEY || "";
  
  if (!apiKey || apiKey === "") {
    throw new Error("API Key is missing or invalid. Please ensure it's set in the environment.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  // استخدام موديل Pro لتحليل أعمق لروابط يوتيوب وتيك توك
  const modelName = "gemini-3-pro-preview";
  
  const prompt = `
    أنت خبير في معالجة روابط الفيديو. حلل الرابط: ${url}
    
    المطلوب بدقة:
    1. ما هي المنصة؟ (TikTok, YouTube, Instagram).
    2. ابحث عن الطريقة الأحدث والآمنة لتحميل هذا الفيديو بجودة 4K أو 1080p بدون علامة مائية.
    3. إذا كان الرابط يوتيوب، اقترح أفضل جودة متاحة.
    4. قدم تقريراً تقنياً مختصراً عن محتوى الفيديو (عنوان، وصف، تاغات).
    5. أعطِ رابطاً مباشراً أو أداة مساعدة إذا كانت متاحة في سياق البحث.
    
    الرد يجب أن يكون JSON فقط.
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
            suggestedFileName: { type: Type.STRING }
          },
          required: ["platform", "title", "summary", "downloadInstructions"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Empty response from Gemini");
    
    const data = JSON.parse(textOutput);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { ...data, sources };
  } catch (error) {
    console.error("Gemini Service Detailed Error:", error);
    throw error;
  }
};
