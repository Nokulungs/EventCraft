import { GoogleGenAI } from "@google/genai";
import { PosterConfig, GeneratedPoster, TokenUsage } from "../types";

// Helper to calculate prompt
const constructPrompt = (config: PosterConfig): string => {
  // If the user provided a detailed custom prompt, prioritize it.
  // We append style directives to ensure quality.
  
  let basePrompt = config.prompt;
  
  if (config.style && config.style !== 'None') {
    basePrompt += `\n\nVisual Style: ${config.style}`;
  }
  
  if (config.colorPalette) {
    basePrompt += `\nColor Palette: ${config.colorPalette}`;
  }
  
  if (config.tone) {
    basePrompt += `\nMood/Tone: ${config.tone}`;
  }

  // Add system-level quality enforcers
  return `
    Create a professional, high-quality event poster.
    
    User Description: "${basePrompt}"
    
    Requirements:
    - The image should be a complete poster design.
    - High resolution, visually striking composition.
    - Text should be minimal or abstract unless specified.
    - Ensure professional typography aesthetics (even if text is illegible).
  `.trim();
};

export const generatePosterImage = async (config: PosterConfig): Promise<GeneratedPoster> => {
  const startTime = Date.now();
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = constructPrompt(config);

    // Using gemini-2.5-flash-image for efficient image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio || "1:1"
        }
      }
    });

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    let imageUrl = '';

    // Extract image from response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from the API.");
    }

    // Extract token usage if available
    const usage = response.usageMetadata;
    const tokenUsage: TokenUsage | undefined = usage ? {
      inputTokens: usage.promptTokenCount || 0,
      outputTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0,
    } : undefined;

    return {
      id: crypto.randomUUID(),
      ...config,
      // Ensure we map back the prompt used for reference, even if constructed
      promptUsed: prompt, 
      // If title wasn't provided, default to a generic one
      eventName: config.title || "Untitled Design", 
      imageUrl,
      generatedAt: new Date().toISOString(),
      generationTimeMs: durationMs,
      tokenUsage,
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};