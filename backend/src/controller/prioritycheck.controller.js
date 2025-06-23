import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const detectMimeType = (url) => {
    if (url.endsWith(".png")) return "image/png";
    if (url.endsWith(".webp")) return "image/webp";
    return "image/jpeg";
};

export const imageUrlToBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
};

// PRIORITY AI CHECK
export const getPriorityFromGemini = async (title, description) => {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `Given the following complaint, return only the priority (High, Medium, Low) in JSON format without any extra text.
Title: ${title}
Description: ${description}
Respond only in this format:
{"priority":"High"}`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return parsed.priority || "Medium";
    } catch (err) {
        console.error("Priority JSON Parse Error:", err.message);
        return "Medium";
    }
};

export const checkImageAuthenticity = async (imageUrl, description) => {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const mimeType = detectMimeType(imageUrl);
    const base64Image = await imageUrlToBase64(imageUrl);

    const result = await model.generateContent([
        {
            inlineData: {
                mimeType,
                data: base64Image,
            },
        },
        {
            text: `This image is attached to a citizen complaint with the description: "${description}".
Judge if the image is VALID, AI-GENERATED, COPIED_FROM_WEB, or UNRELATED_TO_DESCRIPTION.
Respond ONLY with one of these options: VALID, AI-GENERATED, COPIED_FROM_WEB, UNRELATED_TO_DESCRIPTION.`,
        },
    ]);

    return (await result.response.text()).trim();
};
