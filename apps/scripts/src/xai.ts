import OpenAI from 'openai';

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (_client) return _client;
  _client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  });
  return _client;
}

interface ImagesResponse {
  data: Array<{ url?: string; b64_json?: string }>;
}

/**
 * Calls xAI's image generation endpoint. Uses the low-level `.post` helper
 * rather than `client.images.generate` because the OpenAI SDK types don't
 * know about xAI-specific params like `aspect_ratio`.
 *
 * If the model name or params drift, this is the single file to edit.
 * See: https://docs.x.ai/developers/model-capabilities/images/generation
 */
export interface GenerateImageOptions {
  aspectRatio?: '1:1' | '3:2' | '2:3' | '16:9' | '9:16';
  n?: number;
}

export async function generateImage(
  prompt: string,
  opts?: GenerateImageOptions,
): Promise<string> {
  const res = (await getClient().post('/images/generations', {
    body: {
      model: 'grok-imagine-image',
      prompt,
      n: opts?.n ?? 1,
      response_format: 'url',
      aspect_ratio: opts?.aspectRatio ?? '9:16',
    },
  })) as ImagesResponse;

  const url = res.data?.[0]?.url;
  if (!url) {
    throw new Error(`xAI response missing image url: ${JSON.stringify(res)}`);
  }
  return url;
}
