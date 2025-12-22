import { GoogleGenAI } from "@google/genai";

// A list of fallbacks ensures variety even if the API Key is missing or fails
const FALLBACK_WISHES = [
  "Желаю счастья, здоровья и чтобы код жизни всегда компилировался без ошибок! 🎉🎂",
  "Пусть каждый день будет как пятничный релиз — успешным и без багов! 🚀",
  "С днем рождения! Желаю бесконечного запаса энергии и вдохновения! ✨",
  "Пусть удача всегда будет в твоем кэше, а счастье — в постоянной памяти! 💾",
  "Сияй ярче, чем новая видеокарта! С праздником! 🌟",
  "Пусть твоя жизнь будет такой же яркой, как этот фейерверк! 🎆",
  "Желаю, чтобы все мечты исполнялись со скоростью света! 💫",
  "Уровня 'Бог' тебе во всех начинаниях! 🎮"
];

const THEMES = [
  "смешное и остроумное",
  "в стиле программиста (про баги, фичи, релизы)",
  "философское и мудрое",
  "очень короткое и дерзкое",
  "космическое и масштабное",
  "в стиле киберпанк или будущего",
  "милое и душевное с кучей сердечек",
  "стихотворное (хокку или пирожок)",
  "как будто поздравляет искусственный интеллект",
  "в стиле эпического кинотрейлера"
];

export const generateBirthdayWish = async (): Promise<string> => {
  // Helper to get a random fallback
  const getRandomFallback = () => FALLBACK_WISHES[Math.floor(Math.random() * FALLBACK_WISHES.length)];

  try {
    const apiKey = process.env.API_KEY;
    
    // If no key is found, return a random pre-written wish immediately
    if (!apiKey) {
      console.warn("API Key missing, using random fallback.");
      return getRandomFallback();
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Select a random theme
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    
    // We add a timestamp to the prompt to force the model to generate something new and avoid caching
    const prompt = `Напиши поздравление с днем рождения на русском языке.
      Стиль: ${randomTheme}.
      Контекст запроса: ${Date.now()}.
      Требования: Не больше 2-3 предложений. Используй эмодзи. Будь максимально креативным.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 1.2, // Increased temperature for more randomness
        topP: 0.95,
      }
    });

    const text = response.text;
    return text || getRandomFallback();

  } catch (error) {
    console.error("Gemini API Error:", error);
    // If the API fails (e.g. quota, network), return a random fallback
    return getRandomFallback();
  }
};