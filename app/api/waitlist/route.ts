import { NextResponse } from 'next/server';
import { z } from 'zod';
import { APIResponseError } from '@notionhq/client';
import { getEnv, EnvValidationError } from '@/lib/env';
import { getNotionClient } from '@/lib/notion';

const SOURCE_FALLBACK = 'Actionpackd CLI Waitlist';

const waitlistSchema = z
  .object({
    email: z.string({ required_error: 'Email is required.' }).email('Email address is invalid.'),
    phone: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim();
        return trimmed?.length ? trimmed : undefined;
      }),
    source: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim();
        return trimmed?.length ? trimmed : undefined;
      }),
  })
  .strict();

const jsonError = (message: string, status: number) => NextResponse.json({ error: message }, { status });

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    console.error('[waitlist] Failed to parse JSON payload', error);
    return jsonError('Invalid JSON payload.', 400);
  }

  const parsed = waitlistSchema.safeParse(body);

  if (!parsed.success) {
    console.error('[waitlist] Request validation failed', parsed.error.flatten());
    return jsonError('Invalid request payload.', 400);
  }

  const { email, phone, source } = parsed.data;

  try {
    const env = getEnv();
    const notion = getNotionClient(env.notionApiKey);
    const createdAt = new Date().toISOString();
    const sourceContent = source || SOURCE_FALLBACK;

    const existingByEmail = await notion.databases.query({
      database_id: env.notionDatabaseId,
      filter: {
        property: 'Email',
        email: { equals: email },
      },
      page_size: 1,
    });

    if (existingByEmail.results.length > 0) {
      return jsonError('This email is already on the waitlist.', 409);
    }

    if (phone) {
      const existingByPhone = await notion.databases.query({
        database_id: env.notionDatabaseId,
        filter: {
          property: 'Phone number',
          phone_number: { equals: phone },
        },
        page_size: 1,
      });

      if (existingByPhone.results.length > 0) {
        return jsonError('This phone number is already on the waitlist.', 409);
      }
    }

    const properties = {
      TimeStamp: {
        title: [
          {
            text: { content: createdAt },
          },
        ],
      },
      Email: {
        email,
      },
      'Phone number': {
        phone_number: phone ?? null,
      },
      'Created at': {
        date: {
          start: createdAt,
        },
      },
    };

    await notion.pages.create({
      parent: { database_id: env.notionDatabaseId },
      properties,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof EnvValidationError) {
      console.error('[waitlist] Missing environment configuration', error.message);
      return jsonError('Server misconfiguration. Please set required environment variables.', 500);
    }

    if (error instanceof APIResponseError) {
      if (error.status === 401) {
        console.error('[waitlist] Notion unauthorized error', error);
        return jsonError('Notion integration not authorized. Check API key and database sharing.', 502);
      }

      console.error('[waitlist] Notion API error', error);
      return jsonError('Notion is unavailable. Please try again later.', 502);
    }

    console.error('[waitlist] Unexpected server error', error);
    return jsonError('Unexpected server error.', 500);
  }
}

export async function GET() {
  return jsonError('Method not allowed.', 405);
}
