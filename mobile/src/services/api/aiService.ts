import { GEMINI_KEY } from '../../config/env';
import { getProducts } from '../supabase/products';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const SYSTEM_PROMPT = `
You are the Official AI Assistant for Sindh Hunar, a premium marketplace for traditional Sindhi handicrafts and artisan products.

Your goal is to provide helpful, accurate, and concise information to customers.

KNOWLEDGE BASE:
- App Name: Sindh Hunar
- Mission: Promoting Sindhi culture, crafts like Ajrak, Sindhi Topi, Rilli work, and Blue Pottery also with food like sindhi mangoes of larkana, khairpur dates, ghotki special pera and shikarpur achar.
- Language: You can speak English, Urdu, and Sindhi. Respond in the language the user uses.

GUIDELINES:
1. Provide REAL and accurate responses based on the product data provided below.
2. Be extremely professional and cultural.
3. DO NOT ask extra questions or follow-up questions unless absolutely necessary for clarity.
4. If asked about prices or product details, use the data provided in the context.
5. If a product is not in the list, politely inform the user and offer to help with available items.
6. Keep responses short and to the point.

CURRENT PRODUCT CATALOG:
{{PRODUCTS_CONTEXT}}
`;

export const generateAIResponse = async (userMessage: string, history: ChatMessage[] = [], language?: string) => {
  try {
    if (!GEMINI_KEY) {
      console.error('Gemini API Key is missing');
      return 'I am sorry, but the AI service is currently unavailable. Please try again later.';
    }

    // Fetch latest products for context
    const { products } = await getProducts({ limit: 50 });
    const productsContext = products.map(p => 
      `- ${p.name}: $${p.price} | Category: ${p.category} | Description: ${p.description || 'Traditional craft'}`
    ).join('\n');

    let languageInstruction = '';
    if (language === 'sd') {
      languageInstruction = '\nIMPORTANT: The user has selected SINDHI as their preferred language. You MUST respond ONLY in Sindhi language (using Arabic/Sindhi script). Even if the user asks in English or Urdu, respond in Sindhi to maintain the cultural vibe.';
    } else if (language === 'ur') {
      languageInstruction = '\nIMPORTANT: The user has selected URDU as their preferred language. You MUST respond in Urdu.';
    }

    const fullSystemPrompt = SYSTEM_PROMPT.replace('{{PRODUCTS_CONTEXT}}', productsContext) + languageInstruction;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: fullSystemPrompt }]
        },
        ...history,
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    let data = await response.json();

    // Fallback if flash-latest is not available or quota exceeded
    if (data.error && (data.error.message.includes('not found') || data.error.message.includes('quota') || data.error.message.includes('plan'))) {
      console.warn('Gemini Flash latest not available or quota hit, falling back to pro-latest');
      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      data = await fallbackResponse.json();
    }

    if (data.error) {
      console.error('Gemini API Error:', data.error);
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'Assalam-o-Alaikum! I am having some trouble connecting right now. How else can I assist you with our Sindhi handicrafts?';
  }
};
