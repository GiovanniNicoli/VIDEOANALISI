

import { GoogleGenAI, Type } from "@google/genai";
// Fix: Use the 'AnnotationItem' type for transcription results, now defined in '../types'.
import { AnnotationItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Fix: Updated the return type to use AnnotationItem.
export const generateTranscription = async (prompt: string): Promise<AnnotationItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            timestamp: {
                                type: Type.NUMBER,
                                description: "Il timestamp in secondi dall'inizio del video."
                            },
                            text: {
                                type: Type.STRING,
                                description: "Il testo trascritto in quel momento."
                            }
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString);

        if (Array.isArray(parsedResult)) {
            // Fix: Cast the parsed result to AnnotationItem[].
            return parsedResult as AnnotationItem[];
        } else {
            console.error("Gemini response is not an array:", parsedResult);
            return [];
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate transcription from Gemini API.");
    }
};