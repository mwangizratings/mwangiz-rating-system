# Mwangiz Beauty Parlor Customer Rating System

Production-ready Version 1 foundation for the Mwangiz Beauty Parlor customer feedback flow.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide React
- Framer Motion
- Supabase
- Zod

## Routes

- `/` - mobile-first customer rating page
- `/thank-you` - post-submission thank-you page
- `POST /api/feedback` - customer feedback submission endpoint

## Local Development

Copy the environment template first:

```bash
cp .env.example .env.local
```

Fill in the Supabase values and `IP_HASH_SECRET`, then run:

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Backend Contract

The implemented endpoint is:

- `POST /api/feedback`

Expected JSON payload:

```json
{
  "rating": 5,
  "comment": "Optional customer feedback text",
  "deviceId": "mwangiz:anonymous-device-id"
}
```

Expected success response:

```json
{
  "success": true
}
```

See [SETUP.md](./SETUP.md) for Supabase setup, migration instructions, Vercel environment variables, and backend verification.
