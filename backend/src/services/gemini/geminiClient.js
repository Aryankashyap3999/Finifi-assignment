import fs from 'fs';

import { GoogleGenAI, createPartFromBase64, createUserContent } from '@google/genai';

import { GEMINI_API_KEY, GEMINI_MODEL } from '../../configs/serverConfig.js';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const extractStructuredData = async (filePath, mimeType, prompt) => {
  const base64Data = fs.readFileSync(filePath, { encoding: 'base64' });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: createUserContent([prompt, createPartFromBase64(base64Data, mimeType)]),
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text);
};
