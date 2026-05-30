# ekkim.work production deploy

## Portfolio (`ekkim.work`)

Vercel deploys from `main` and serves the static site in `site/` via `vercel.json`.

After pushing to GitHub, confirm the Vercel project:

1. Connected repo: `mamadadapapamama/ek_portfolio`
2. Production branch: `main`
3. Framework preset: **Other** (no Astro build)
4. Custom domains: `ekkim.work`, `www.ekkim.work`

Environment variables (Settings → Environment Variables):

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`

If writing posts do not appear, redeploy after fixing env vars.

## Verify

- `https://ekkim.work` — portfolio
- `https://ekkim.work/writing` — Notion posts

## Local dev

```bash
npm install
npm run dev
```
