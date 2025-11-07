
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generationConfig = (modelName: 'gemini-2.5-flash' | 'gemini-2.5-pro') => {
    return {
        // safetySettings: ...
        // stopSequences: ...
        // temperature: ...
        // topP: ...
        // topK: ...
    };
};

export const geminiService = {
  async runChat(history: ChatMessage[], message: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
        model,
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        })),
    });
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  },

  async analyzeImage(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType,
        },
    };
    const textPart = { text: prompt };
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  },

  async groundedSearch(prompt: string): Promise<{ text: string; chunks: any[] | undefined }> {
    const model = 'gemini-2.5-flash';
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    const text = response.text;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return { text, chunks };
  },

  async complexQuery(prompt: string): Promise<string> {
    const model = 'gemini-2.5-pro';
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
  },

  async getCodeExplanation(code: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the following code snippet. Provide a clear, concise explanation suitable for a developer learning this concept. Use markdown for formatting.\n\n\`\`\`\n${code}\n\`\`\``;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  },

  async refactorCode(code: string): Promise<string> {
    const model = 'gemini-2.5-pro';
    const prompt = `Refactor the following code for better performance, readability, and adherence to best practices. Return only the refactored code block in markdown format.\n\n\`\`\`\n${code}\n\`\`\``;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  }
};
