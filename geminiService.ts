
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeVideoLink = async (url: string) => {
  // الحصول على المفتاح بأمان
  const apiKey = (window as any).process?.env?.API_KEY || "";
  if (!apiKey) throw new Error("API Key is missing");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    حلل رابط الفيديو التالي: ${url}
    
    المطلوب:
    1. حدد المنصة (TikTok, YouTube, Instagram).
    2. ابحث عن أفضل طريقة لتحميل هذا الفيديو تحديداً بأعلى جودة (1080p أو 4K) وبدون علامة مائية.
    3. إذا توفرت روابط "تحميل مباشر" من أدوات معروفة، اذكرها.
    4. قدم عنواناً احترافياً ووصفاً تقنياً للفيديو.
    5. استخرج الكلمات المفتاحية (Tags).
    
    يجب أن تكون النتيجة بتنسيق JSON حصراً.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // استخدام البحث للعثور على أفضل روابط التحميل
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

    const data = JSON.parse(response.text);
    // استخراج الروابط المرجعية إذا وجدت
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { ...data, sources };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
