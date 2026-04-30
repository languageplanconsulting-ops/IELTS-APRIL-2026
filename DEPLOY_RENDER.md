# Deploy English Plan on Render

This is the easiest way to deploy the app if you do not code.

You will deploy:

- 1 Supabase project for database + authentication
- 1 Render web service for both the website and the API

The app is already prepared so Render can run the frontend and backend together.

## Before You Start

You need:

- a GitHub account
- a Render account
- a Supabase account
- your API keys ready:
  - `GEMINI_API_KEY`
  - `DEEPGRAM_API_KEY`
  - `IFLYTEK_APP_ID`
  - `IFLYTEK_API_KEY`
  - `IFLYTEK_API_SECRET`

## Part 1: Put the project on GitHub

1. Open [https://github.com](https://github.com)
2. Log in
3. Click the `+` icon at the top right
4. Click `New repository`
5. Repository name: `ielts-speaking` or `english-plan`
6. Keep it `Private`
7. Click `Create repository`

Then upload this project folder to that repo.

If you want the simplest route, use GitHub Desktop:

1. Install GitHub Desktop
2. Click `Add an Existing Repository from your Hard Drive`
3. Choose this project folder
4. Click `Publish repository`
5. Keep it `Private`
6. Click `Publish Repository`

## Part 2: Create Supabase

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click `New project`
3. Choose your organization
4. Project name: `english-plan`
5. Set a database password and save it somewhere
6. Choose a region close to you
7. Click `Create new project`
8. Wait until the project finishes provisioning

### Run the database schema

1. In Supabase, click `SQL Editor`
2. Click `New query`
3. Open the local file [supabase/schema.sql](/Users/natchanon/Documents/IELTS%20SPEAKING/supabase/schema.sql)
4. Copy everything
5. Paste it into Supabase
6. Click `Run`

### Copy the 3 Supabase keys you need

1. In Supabase, click `Project Settings`
2. Click `Data API`
3. Copy:
   - `Project URL`
   - `anon public`
   - `service_role secret`

Save them in a note temporarily.

## Part 3: Create the Render Web Service

1. Open [https://dashboard.render.com](https://dashboard.render.com)
2. Click `New +`
3. Click `Web Service`
4. Connect your GitHub account if Render asks
5. Select the GitHub repo for this project
6. Click `Connect`

On the setup page, use:

- `Name`: `english-plan`
- `Region`: closest to your users
- `Branch`: `main`
- `Root Directory`: leave empty
- `Runtime`: `Node`
- `Build Command`: `npm install && npm run build`
- `Start Command`: `npm start`

Then set the environment variables.

## Part 4: Add Environment Variables in Render

In the `Environment Variables` section, add these one by one:

- `PORT` = `10000`
- `REQUEST_BODY_LIMIT` = `25mb`
- `ADMIN_PANEL_CODE` = `englishplanforeover`
- `SUPABASE_URL` = your Supabase Project URL
- `SUPABASE_ANON_KEY` = your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key
- `GEMINI_API_KEY` = your Gemini key
- `DEEPGRAM_API_KEY` = your Deepgram key
- `DEEPGRAM_TTS_MODEL` = `aura-2-asteria-en`
- `DEEPGRAM_STT_MODEL` = `nova-3`
- `IFLYTEK_APP_ID` = your iFlytek app id
- `IFLYTEK_API_KEY` = your iFlytek api key
- `IFLYTEK_API_SECRET` = your iFlytek api secret
- `IFLYTEK_IAT_LANGUAGE` = `en_us`
- `IFLYTEK_IAT_DOMAIN` = `iat`
- `IFLYTEK_IAT_HOST` = `iat-api-sg.xf-yun.com`
- `IFLYTEK_IAT_PATH` = `/v2/iat`
- `IFLYTEK_ISE_HOST` = `ise-api-sg.xf-yun.com`
- `IFLYTEK_ISE_PATH` = `/v2/ise`
- `IFLYTEK_ISE_CATEGORY` = `read_sentence`
- `IFLYTEK_ISE_LANGUAGE` = `en_us`
- `IFLYTEK_ISE_ENT` = `en_vip`
- `IFLYTEK_ISE_CMD` = `ssb`
- `IFLYTEK_ISE_TTE` = `utf-8`

Then:

1. Click `Create Web Service`
2. Wait for the deploy to finish

When it is done, Render will give you a URL like:

- `https://english-plan.onrender.com`

## Part 5: First Live Check

Open your Render URL.

You should see:

- learner login on the left
- admin code login on the right

Use this admin code:

- `englishplanforeover`

Then:

1. Open `Admin`
2. Create a learner
3. Upload a reading exam
4. Test sign-in as the learner

## Part 6: If Something Fails

### If the website opens but login fails

Usually this means one of these is wrong:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### If speaking analysis fails

Usually this means one of these is wrong:

- `GEMINI_API_KEY`
- `DEEPGRAM_API_KEY`
- iFlytek keys

### If admin panel works but reading upload fails

Usually the SQL schema was not fully run in Supabase.

Run [supabase/schema.sql](/Users/natchanon/Documents/IELTS%20SPEAKING/supabase/schema.sql) again.

## Part 7: Every Time You Change the App

1. Push the new code to GitHub
2. Open Render
3. Open your service
4. Click `Manual Deploy`
5. Click `Deploy latest commit`

That’s it.
