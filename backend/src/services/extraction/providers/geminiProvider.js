import fs from 'fs';

import { GoogleGenAI, createPartFromBase64, createUserContent } from '@google/genai';

import { GEMINI_API_KEY, GEMINI_MODEL } from '../../../configs/serverConfig.js';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const extractStructuredData = async (filePath, mimeType, prompt) => {
  const base64Data = fs.readFileSync(filePath, { encoding: 'base64' });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: createUserContent([prompt, createPartFromBase64(base64Data, mimeType)]),
    // temperature 0 → greedy decoding, so re-extracting the same document is far
    // more likely (though not guaranteed — see README's "known limitations") to
    // yield the same values instead of sampling a different answer each time.
    config: { responseMimeType: 'application/json', temperature: 0 }
  });

  return JSON.parse(response.text);
};
