import { Client } from '@notionhq/client';

let notionClient: Client | null = null;
let cachedKey: string | null = null;

export const getNotionClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('Expected a Notion API key.');
  }

  if (!notionClient || cachedKey !== apiKey) {
    notionClient = new Client({
      auth: apiKey,
    });
    cachedKey = apiKey;
  }

  return notionClient;
};
