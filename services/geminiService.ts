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
                    platform: {
                        type: Type.STRING,
                        description: "For 'Viral Trends' category only. The social media platform where the trend is popular, e.g., 'TikTok', 'Instagram', 'X'."
                    },
                    country: {
                        type: Type.STRING,
                        description: "For 'Viral Trends' category only. The country where the trend is popular, e.g., 'India', 'USA', 'Global'."
                    },
                    trendingDate: {
                        type: Type.STRING,
                        description: "For 'Viral Trends' category only. The approximate date the prompt was trending, in 'YYYY-MM-DD' format."
                    },
                    tags: {
                        type: Type.ARRAY,
                        description: "An array of 2-4 relevant tags for the prompt, e.g., 'sci-fi', 'portrait', 'productivity', 'summary'.",
                        items: {
                            type: Type.STRING
                        }
                    }
                },
                required: ["id", "promptText", "category", "targetModel"],
            },
        },
    },
    required: ["prompts"],
};


export const generatePrompts = async (country: string, dateRange?: { start: string; end: string }): Promise<Prompt[]> => {
    let contentRequest = `Generate 20 diverse AI prompts. Cover these categories: Image Generation, Writing, Code, and Viral Trends. For each prompt, specify a target AI model, a unique ID, and an array of 2-4 relevant tags.`;

    const viralTrendInstructions = `For prompts in the 'Viral Trends' category, also specify the social media platform (like 'TikTok', 'Instagram', or 'X'), the country where it is trending, and the approximate date it was trending in 'YYYY-MM-DD' format.`

    if (country && country !== 'Global') {
        contentRequest += ` Focus the 'Viral Trends' prompts on trends popular in ${country}. ${viralTrendInstructions}`;
    } else {
        contentRequest += ` Include 'Viral Trends' from various countries (e.g., 'India', 'USA', 'Global'). ${viralTrendInstructions}`;
    }

    if (dateRange && dateRange.start && dateRange.end) {
        contentRequest += ` The 'Viral Trends' must have been popular between ${dateRange.start} and ${dateRange.end}.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contentRequest,
            config: {
                responseMimeType: "application/json",
                responseSchema: promptSchema,
                systemInstruction: "You are an expert AI prompt engineer. Your task is to generate a list of creative, effective, and trending prompts. Adhere strictly to the category, country, and date range constraints provided in the user's request. Provide the response in a valid JSON format according to the provided schema."
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