export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

export type EnvConfig = {
  notionApiKey: string;
  notionDatabaseId: string;
};

let cachedEnv: EnvConfig | null = null;

export const getEnv = (): EnvConfig => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const notionApiKey = process.env.NOTION_API_KEY?.trim() ?? '';
  const notionDatabaseId = process.env.NOTION_DATABASE_ID?.trim() ?? '';

  const missing: string[] = [];
  if (!notionApiKey) missing.push('NOTION_API_KEY');
  if (!notionDatabaseId) missing.push('NOTION_DATABASE_ID');

  if (missing.length > 0) {
    const message = `Missing environment variables: ${missing.join(', ')}`;
    console.error(`[env] ${message}`);
    throw new EnvValidationError(message);
  }

  cachedEnv = { notionApiKey, notionDatabaseId };
  return cachedEnv;
};
