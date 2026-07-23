import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in .env");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const MODEL = "gemini-3.1-flash-lite";

export default ai;
