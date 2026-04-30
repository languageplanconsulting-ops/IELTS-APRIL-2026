# IELTS Speaking App

This app now supports real Supabase-backed access control for:

- learner sign-in with email/password
- admin-managed learner access
- expiry dates
- feedback credits
- full mock credits
- admin sign-in with a single access code

The speaking/notebook UI still runs in React, while auth and admin actions go through the Express server.

## What Changed

- learners can no longer self-create accounts from the home page
- admins create or renew access inside the Admin panel
- credits are stored in Supabase, not browser localStorage
- assessment credits are consumed on the server when an assessment starts
- admin login uses the `ADMIN_PANEL_CODE` value from your server `.env`

## Setup

### 1. Create a Supabase project

Create a new project in Supabase, then copy:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Run the SQL schema

Open the Supabase SQL editor and run:

- [supabase/schema.sql](/Users/natchanon/Documents/IELTS%20SPEAKING/supabase/schema.sql)

This creates:

- `profiles`
- `learner_access`
- triggers to keep profiles in sync with `auth.users`

### 3. Create your `.env`

Copy [.env.example](/Users/natchanon/Documents/IELTS%20SPEAKING/.env.example) to `.env` and fill in the values.

Required for access control:

- `ADMIN_PANEL_CODE`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Required for the existing speaking features:

- `GEMINI_API_KEY`
- `DEEPGRAM_API_KEY`
- `IFLYTEK_APP_ID`
- `IFLYTEK_API_KEY`
- `IFLYTEK_API_SECRET`

Recommended Gemini defaults for faster reports:

- `GEMINI_ASSESSMENT_MODEL=gemini-2.5-flash`
- `GEMINI_TEXT_MODEL=gemini-2.5-flash`
- `GEMINI_CLEANUP_MODEL=gemini-2.5-flash-lite`
- `GEMINI_TRANSCRIPTION_MODEL=gemini-2.5-flash`

### 4. Set your admin code

Add this to `.env`:

```bash
ADMIN_PANEL_CODE=englishplanforeover
```

Then sign in through the app’s Admin Access form using only that code.

### 5. Install and run

```bash
npm install
npm run dev
```

Client:

- [http://localhost:5173](http://localhost:5173)

API:

- [http://localhost:8787](http://localhost:8787)

## Admin Workflow

After signing in as admin:

1. Open `Admin`
2. Fill in learner `name`, `email`, and `password`
3. Set:
   - `role`
   - `status`
   - `access until`
   - `feedback credits`
   - `full mock credits`
4. Click `Save Learner Access`

You can also:

- deactivate/reactivate learners
- add more feedback credits
- add more full mock credits
- change expiry dates

## Learner Workflow

1. Admin creates learner access
2. Learner signs in with the assigned email/password
3. The app checks:
   - active/inactive status
   - expiry date
   - remaining credits
4. When a learner starts an assessment, the server deducts credits from Supabase

## Notes

- notebook entries and latest topic scores are still stored locally per signed-in email
- credits and access rights are now authoritative in Supabase
- if you deploy this app, keep `SUPABASE_SERVICE_ROLE_KEY` on the server only

## Deploy

For the easiest no-code deployment path, use Render + Supabase:

- Step-by-step guide: [DEPLOY_RENDER.md](/Users/natchanon/Documents/IELTS%20SPEAKING/DEPLOY_RENDER.md)
- Render blueprint file: [render.yaml](/Users/natchanon/Documents/IELTS%20SPEAKING/render.yaml)

## Verification

The current codebase was verified with:

```bash
npm run build
node --check server/index.mjs
```
