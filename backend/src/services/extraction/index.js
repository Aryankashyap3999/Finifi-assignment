import { AI_PROVIDER } from '../../configs/serverConfig.js';
import { extractStructuredData as extractWithGemini } from './providers/geminiProvider.js';
import { extractStructuredData as extractWithGroq } from './providers/groqProvider.js';

export { getPromptForDocumentType } from './prompts.js';

// The provider contract: every entry here is (filePath, mimeType, prompt) => Promise<object>,
// same shape as documentService's parseWithRetry already expects — no business logic anywhere
// depends on which provider is selected or its SDK. Adding a new provider is: write a new file
// under providers/ with this same function shape, add one line here, set AI_PROVIDER in .env.
const PROVIDERS = {
  gemini: extractWithGemini,
  groq: extractWithGroq
};

export const extractStructuredData = (filePath, mimeType, prompt) => {
  const provider = PROVIDERS[AI_PROVIDER];
  if (!provider) {
    throw new Error(`Unknown AI_PROVIDER "${AI_PROVIDER}" — expected one of: ${Object.keys(PROVIDERS).join(', ')}`);
  }
  return provider(filePath, mimeType, prompt);
};
