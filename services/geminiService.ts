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
                        description: "The category of the prompt. This must match the requested category."
                    },
                    targetModel: {
                        type: Type.STRING,
                        description: "The suggested AI model for this prompt, e.g., 'Midjourney v6', 'Gemini 2.5 Pro', 'DALL-E 3', 'ChatGPT-4o'."
                    },
                    tags: {
                        type: Type.ARRAY,
                        description: "An array of 2-4 relevant tags for the prompt, e.g., 'sci-fi', 'portrait', 'productivity', 'summary'.",
                        items: {
                            type: Type.STRING
                        }
                    }
                },
                required: ["id", "promptText", "category", "targetModel", "tags"],
            },
        },
    },
    required: ["prompts"],
};


export const generatePrompts = async (category: string): Promise<Prompt[]> => {
    let contentRequest: string;

    if (category === 'All') {
        contentRequest = `Generate 20 diverse AI prompts, but only for these categories: Image Generation, Writing, and Code. For each prompt, provide a target AI model, a unique ID, the correct category, and an array of 2-4 relevant tags.`;
    } else {
        contentRequest = `Generate 20 diverse AI prompts strictly for the '${category}' category. For each prompt, provide a target AI model, a unique ID, ensure the category is '${category}', and an array of 2-4 relevant tags.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contentRequest,
            config: {
                responseMimeType: "application/json",
                responseSchema: promptSchema,
                systemInstruction: "You are an expert AI prompt engineer. Your task is to generate a list of creative and effective prompts. Adhere strictly to the category constraints provided in the user's request. Provide the response in a valid JSON format according to the provided schema."
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson && Array.isArray(parsedJson.prompts)) {
            // Ensure the category is correctly assigned, Gemini can sometimes miss this instruction
            return parsedJson.prompts.map((p: Prompt) => ({ ...p, category: category === 'All' ? p.category : category }));
        } else {
            console.error("Generated JSON does not match expected structure:", parsedJson);
            throw new Error("Invalid data structure received from AI.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not fetch prompts from Gemini.");
    }
};
