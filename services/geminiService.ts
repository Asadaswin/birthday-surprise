import { GoogleGenAI } from "@google/genai";

const FALLBACK_WISH = "Желаю счастья, здоровья и чтобы код жизни всегда компилировался без ошибок! 🎉🎂";

const THEMES = [
  "смешное и остроумное",
  "в стиле программиста (про баги, фичи, релизы)",
  "философское и мудрое",
  "очень короткое и дерзкое",
  "космическое и масштабное",
  "в стиле киберпанк или будущего",
  "милое и душевное с кучей сердечек",
  "стихотворное (хокку или пирожок)",
  "как будто поздравляет искусственный интеллект"
];

export const generateBirthdayWish = async (): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key missing, using fallback wish.");
      return FALLBACK_WISH;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Select a random theme to ensure variety
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: `Напиши поздравление с днем рождения на русском языке.
      Стиль: ${randomTheme}.
      Требования: Не больше 2-3 предложений. Используй эмодзи. Будь креативным и оригинальным.`,
      config: {
        temperature: 1.1, // High creativity
        topP: 0.95,
      }
    });

    const text = response.text;
    return text || FALLBACK_WISH;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_WISH;
  }
};