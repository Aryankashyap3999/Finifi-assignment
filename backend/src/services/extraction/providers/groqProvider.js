import fs from 'fs';

import { GROQ_API_KEY, GROQ_MODEL } from '../../../configs/serverConfig.js';

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ponytail: Groq's vision models take image_url content (input_modalities:
// ["text","image"] per their /v1/models response) — there's no documented PDF
// input the way Gemini's inlineData supports. This works as-is for PNG/JPEG
// uploads; a PDF upload would need a page-render-to-image step first if this
// provider is ever made the default. Not built, since Gemini remains the
// configured provider and this exists to prove the provider abstraction works.
export const extractStructuredData = async (filePath, mimeType, prompt) => {
  const base64Data = fs.readFileSync(filePath, { encoding: 'base64' });

  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Groq extraction failed');
  }

  return JSON.parse(payload.choices[0].message.content);
};
