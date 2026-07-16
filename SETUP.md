# Mwangiz Rating System Setup

This guide covers the backend setup for the V1 customer feedback submission flow.

## 1. Create a Supabase Project

1. Go to the Supabase dashboard.
2. Create a new project.
3. Save the project URL, anon public key, and service role key from Project Settings > API.
4. Keep the service role key private. Never expose it in client code.

## 2. Run the SQL Migration

Run the customer ratings migration in:

```text
supabase/migrations/20260715020000_create_ratings_table.sql
```

You can run it using either:

- Supabase SQL Editor: paste the migration and run it.
- Supabase CLI: link the project and run migrations.

Then run the admin whitelist migration:

```text
supabase/migrations/20260715040000_create_admin_whitelist_and_policies.sql
```

Finally, edit the placeholder email in the seed file and run it:

```text
supabase/seed/20260715041000_seed_first_admin.sql
```

Then run the branch migration:

```text
supabase/migrations/20260716090000_add_branches_and_branch_ratings.sql
```

The migrations create the `ratings`, `admin_whitelist`, and `branches` tables, indexes, constraints, Row Level Security, anonymous insert-only policies, active-branch public reads, and authenticated whitelist-based admin policies.

## 3. Configure Environment Variables

Create a local `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://rate-mwangiz.vercel.app
SUPABASE_SERVICE_ROLE_KEY=
IP_HASH_SECRET=
```

Use a long random value for `IP_HASH_SECRET`. This value is used as a server-only pepper before hashing IP addresses with SHA-256.

On Windows, make sure the file is named exactly `.env.local` with the leading dot. A file named `env.local` will not be loaded by Next.js. Restart `npm run dev` after creating or changing environment variables.

## 4. Start Locally

```bash
npm install
npm run dev
```

Visit:

```text
http://127.0.0.1:3000
```

Customer rating pages are branch-specific:

```text
http://127.0.0.1:3000/b/main-branch
```

## 5. Verify the Backend

Submit feedback from the rating page. A successful request should:

- Return HTTP `201`.
- Insert a row into `public.ratings`.
- Store `device_id`.
- Store only `ip_hash`, never a raw IP address.
- Return HTTP `429` for the same `device_id` within 24 hours.

You can also test the endpoint directly:

```bash
curl -X POST http://127.0.0.1:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d "{\"rating\":5,\"comment\":\"Lovely visit\",\"deviceId\":\"mwangiz:test-device-0001\",\"branchId\":\"BRANCH_UUID_FROM_SUPABASE\"}"
```

Expected success response:

```json
{
  "success": true
}
```

Expected duplicate response:

```json
{
  "success": false,
  "message": "You've already submitted feedback today. Thank you!"
}
```

## 6. Deploy to Vercel

1. Push the project to your Git provider.
2. Import the project into Vercel.
3. Add the required environment variables in Vercel Project Settings > Environment Variables.
4. Deploy.

Required Vercel variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://rate-mwangiz.vercel.app
SUPABASE_SERVICE_ROLE_KEY=
IP_HASH_SECRET=
```

After deployment, submit feedback from the production URL and confirm the row appears in Supabase.

## 7. Configure Supabase Auth for Admin Magic Links

In Supabase Authentication settings:

1. Enable email Magic Link sign-in.
2. Add your local callback URL to the allowed redirect URLs:

```text
http://localhost:3000/auth/callback
```

3. Add your production callback URL after deployment:

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback
```

Admins must sign in at `/admin/login` using an email that exists in `admin_whitelist`. Non-whitelisted users are signed out and redirected back to the login page with an access denied message.

## 8. Create Branch QR Codes

After signing in as an admin:

1. Open `/admin/branches`.
2. Create each salon branch by name.
3. Copy the generated public rating URL, such as `/b/eldoret-cbd`.
4. Download the PNG or SVG QR code for printing at that branch.

Generated branch URLs and QR codes use `NEXT_PUBLIC_SITE_URL`. For production, set it to:

```text
https://rate-mwangiz.vercel.app
```

Dashboard analytics can be viewed for all branches or filtered to a single branch.
