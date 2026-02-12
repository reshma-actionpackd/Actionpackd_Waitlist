# Actionpackd CLI Waitlist

Join the Actionpackd CLI waitlist and get notified as soon as the developer-first agent platform is ready for you.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in the following values:
     - `NOTION_API_KEY` – internal integration token with write access to the database
     - `NOTION_DATABASE_ID` – target database ID for storing waitlist entries

3. **Create the Notion database**
   - Create a database with the following properties (names must match exactly):
     - `Email` – type *Title*
     - `Phone` – type *Phone number*
     - `Source` – type *Rich text*
     - `Timestamp` – type *Date*
   - Share the database with your Notion integration to grant access.

4. **Fixing Notion 401 errors**
   1. Create an [internal Notion integration](https://www.notion.so/my-integrations) (needs `pages.write`).
   2. Copy the integration secret into `.env.local` as `NOTION_API_KEY`.
   3. Share the target database with your integration ("Share" → select your integration → invite).
   4. Double-check the database ID matches `NOTION_DATABASE_ID` in `.env.local`.

5. **Run the dev server**
   ```bash
   npm run dev
   ```

6. **Production build**
   ```bash
   npm run build && npm run start
   ```

## Tech Stack
- Next.js App Router
- React Server + Client Components
- Official Notion SDK

## Project Structure
```
app/
  api/waitlist/route.ts     # Notion submission endpoint
  layout.tsx                # Root layout
  page.tsx                  # Landing page
  globals.css               # Global styles
components/
  WaitlistForm.tsx          # Client-side form logic
lib/
  env.ts                    # Runtime environment validation
  notion.ts                 # Notion client helper
public/
  actionpackd-logo.png.png  # Provided logo (embedded directly)
```

## Common Errors

- **401 Notion error** – API key is invalid or database wasn’t shared. Follow the “Fixing Notion 401 errors” steps above.
- **500 API error** – Usually missing `NOTION_*` env vars. Check server logs; the API responds with `Server misconfiguration` if validation fails.
- **Invalid request payload (400)** – The API expects valid JSON with an `email`. Ensure the frontend sends `Content-Type: application/json`.
