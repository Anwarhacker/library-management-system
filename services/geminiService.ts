
import { GoogleGenAI, Type } from "@google/genai";
import { Book } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateBookSummary(title: string, author: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a concise, engaging summary (around 100-150 words) for the book "${title}" by ${author}.`,
        config: {
            temperature: 0.7,
            topP: 0.95,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating book summary:", error);
    return "Could not generate summary at this time.";
  }
}

export async function findSimilarBooks(title: string, author: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `List 3 books that are similar to "${title}" by ${author}. For each book, provide the title and author, separated by a pipe (|). For example: "Book Title A | Author A". Separate each entry with a newline.`,
        config: {
            temperature: 0.8,
        }
    });
    const text = response.text;
    return text.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error("Error finding similar books:", error);
    return ["Could not find similar books at this time."];
  }
}

export async function generateNewBook(prompt: string): Promise<Book | null> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following prompt, create a fictional book entry. Prompt: "${prompt}". Generate a plausible title, author, ISBN-13, a compelling description (around 50-70 words), a primary category, a publication date (YYYY-MM-DD), and 3 relevant tags. The ISBN should be a valid-looking 13-digit number.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        author: { type: Type.STRING },
                        isbn: { type: Type.STRING, description: "A plausible 13-digit ISBN." },
                        description: { type: Type.STRING },
                        category: { type: Type.STRING },
                        publishedDate: { type: Type.STRING, description: "Format: YYYY-MM-DD" },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "author", "isbn", "description", "category", "publishedDate", "tags"]
                },
            },
        });

        const jsonStr = response.text;
        const generatedData = JSON.parse(jsonStr);

        const newBook: Book = {
            id: crypto.randomUUID(),
            title: generatedData.title,
            author: generatedData.author,
            isbn: generatedData.isbn,
            description: generatedData.description,
            category: generatedData.category,
            publishedDate: generatedData.publishedDate,
            coverImageUrl: `https://picsum.photos/seed/${encodeURIComponent(generatedData.title)}/400/600`,
            tags: generatedData.tags,
        };
        return newBook;
    } catch (error) {
        console.error("Error generating new book:", error);
        return null;
    }
}
