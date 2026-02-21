import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function completeDream(text: string, images: string[] = [], audio?: string) {
  const model = "gemini-3-flash-preview";
  
  const parts: any[] = [];
  
  if (text) {
    parts.push({ text: `Here is a description of a dream I had: ${text}` });
  }
  
  if (images.length > 0) {
    images.forEach((img, index) => {
      // Remove data:image/png;base64, prefix if present
      const base64Data = img.split(',')[1] || img;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      });
    });
    parts.push({ text: "I've also provided some images from my dream." });
  }

  if (audio) {
    const base64Audio = audio.split(',')[1] || audio;
    parts.push({
      inlineData: {
        mimeType: "audio/webm", // Assuming webm from browser
        data: base64Audio
      }
    });
    parts.push({ text: "I've also provided a voice recording describing my dream." });
  }

  parts.push({ text: "Please complete this dream for me. Make it immersive, surreal, and emotionally resonant. Return only the completed story text." });

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
  });

  return response.text;
}

export async function generateDreamVoice(text: string) {
  const model = "gemini-2.5-flash-preview-tts";
  
  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Narrate this dream completion with a soft, ethereal, and mysterious tone: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Soft voice
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
}
