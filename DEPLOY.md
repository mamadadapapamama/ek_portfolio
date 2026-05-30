# ekkim.work production deploy

## Portfolio (`ekkim.work`)

Vercel deploys from `main` and serves the static site in `portfolio-byclaude/` via `vercel.json`.

After pushing to GitHub, confirm the Vercel project:

1. Connected repo: `mamadadapapamama/ek_portfolio`
2. Production branch: `main`
3. Framework preset: **Other** (no Astro build)
4. Custom domains: `ekkim.work`, `www.ekkim.work`

If an old Astro build still appears, trigger **Redeploy** on the latest `main` commit.

## Archive admin (`app.ekkim.work`)

The admin app needs the Node server in `server.js` (upload API + persistent disk).

### Render setup

1. Render Dashboard → New → Blueprint → select this repo
2. Render reads `render.yaml`
3. Add custom domain `app.ekkim.work`
4. Point DNS for `app` to Render

### Verify

- `https://ekkim.work` — new portfolio
- `https://app.ekkim.work` — admin page
- Save one entry in the admin and confirm it persists

## Local dev

```bash
npm install
npm start
```

## Self-host (Nginx)

Use `deploy/nginx/ekkim.work.conf` and run `npm start` behind Nginx + certbot.
