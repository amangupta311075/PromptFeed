
import { GoogleGenAI, Type } from "@google/genai";
import type { Prompt } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const promptSchema = {
    type: Type.OBJECT,
    properties: {
        prompts: {
            type: Type.ARRAY,
            description: "An array of 20 creative and effective AI prompts.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: {
                        type: Type.STRING,
                        description: "A unique identifier for the prompt, e.g., 'prompt-1'."
                    },
                    promptText: {
                        type: Type.STRING,
                        description: "The full text of the AI prompt."
                    },
                    category: {
                        type: Type.STRING,
                        description: "The category of the prompt, e.g., 'Image Generation', 'Writing', 'Code', 'Viral Trends'."
                    },
                    targetModel: {
                        type: Type.STRING,
                        description: "The suggested AI model for this prompt, e.g., 'Midjourney v6', 'Gemini 2.5 Pro', 'DALL-E 3', 'ChatGPT-4o'."
                    },
                },
                required: ["id", "promptText", "category", "targetModel"],
            },
        },
    },
    required: ["prompts"],
};


export const generatePrompts = async (): Promise<Prompt[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 20 diverse AI prompts. Cover these categories: Image Generation, Writing, Code, and Viral Trends. For each prompt, specify a target AI model (like Midjourney, Gemini 2.5 Pro, DALL-E 3, ChatGPT-4o, etc.) and a unique ID starting with 'prompt-'.",
            config: {
                responseMimeType: "application/json",
                responseSchema: promptSchema,
                systemInstruction: "You are an expert AI prompt engineer. Your task is to generate a list of creative, effective, and trending prompts for various AI models. Provide the response in a valid JSON format according to the provided schema."
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson && Array.isArray(parsedJson.prompts)) {
            return parsedJson.prompts;
        } else {
            console.error("Generated JSON does not match expected structure:", parsedJson);
            throw new Error("Invalid data structure received from AI.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not fetch prompts from Gemini.");
    }
};
