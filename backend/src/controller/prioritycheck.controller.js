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

            **Critically assess this image's origin. Prioritize "COPIED_FROM_WEB" unless there are clear indicators of originality.**

            **Possible Categories:**
            - **COPIED_FROM_WEB:** Does this image appear to be a generic, widely available, or professionally taken image found online (e.g., stock photo, news article image, general web content)? Look for: lack of unique context, general subject matter, absence of personal touch, or a clean/staged look often associated with internet imagery. Assume this if there's no strong evidence of it being an original, spontaneous capture.
            - **VALID:** Does this image strongly suggest it's a unique, original photograph taken directly by a citizen (e.g., showing very specific local context, a clear personal perspective, or unedited, raw details typical of a mobile phone capture)? Only choose VALID if the evidence for originality is compelling.
            - **AI-GENERATED:** Does the image exhibit any unnatural features, distortions, or patterns characteristic of AI synthesis?
            - **UNRELATED_TO_DESCRIPTION:** Is the visual content of the image completely irrelevant to the provided complaint description?

            **Respond ONLY with one of these exact words:** VALID, AI-GENERATED, COPIED_FROM_WEB, UNRELATED_TO_DESCRIPTION.`,
        },
    ]);

    return (await result.response.text()).trim();
};
