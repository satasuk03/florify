import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (_client) return _client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  _client = new GoogleGenAI({ apiKey });
  return _client;
}

export type GeminiModel =
  | "gemini-3.1-flash-image-preview"
  | "gemini-3-pro-image-preview"
  | "gemini-2.5-flash-image";

export type AspectRatio =
  | "1:1" | "2:3" | "3:2" | "3:4" | "4:3"
  | "4:5" | "5:4" | "9:16" | "16:9" | "21:9"
  | "1:4" | "4:1" | "1:8" | "8:1";

export type ImageSize = "512" | "1K" | "2K" | "4K";

export interface GenerateImageOptions {
  model?: GeminiModel;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
}

/**
 * Generate an image from a text prompt using Gemini's native image generation.
 * Returns the raw PNG image data as a Buffer.
 */
export async function generateImage(
  prompt: string,
  opts?: GenerateImageOptions,
): Promise<Buffer> {
  const model = opts?.model ?? "gemini-3.1-flash-image-preview";
  const ai = getClient();

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: opts?.aspectRatio ?? "1:1",
        ...(model !== "gemini-2.5-flash-image" && opts?.imageSize
          ? { imageSize: opts.imageSize }
          : {}),
      },
    },
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("Gemini returned no candidates");
  }

  const parts = candidates[0]!.content?.parts;
  if (!parts) {
    throw new Error("Gemini response missing parts");
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  throw new Error("Gemini response contained no image data");
}
