# ekkim.work

Portfolio site for [ekkim.work](https://ekkim.work).

## Layout

```
site/                 Portfolio HTML/CSS/assets (edit here)
scripts/              Notion → /writing build
vercel.json           Vercel deploy config
```

## Writing (Notion)

Posts are published from a Notion database to `/writing` at deploy time.

See **[NOTION.md](./NOTION.md)** for database setup and Vercel env vars.

```bash
cp .env.example .env   # add NOTION_API_KEY + NOTION_DATABASE_ID
npm run build:writing  # generate writing.html + posts locally
npm run dev            # preview at localhost:3000
```

## Deploy

**ekkim.work** — Vercel auto-deploys from `main`:

1. `npm install`
2. `npm run build:writing` (pulls from Notion)
3. serves `site/`

Add `NOTION_API_KEY` and `NOTION_DATABASE_ID` in Vercel → Settings → Environment Variables.

## Branches

| Branch | Contents |
|--------|----------|
| `main` | Production portfolio + deploy config |
| `archive/astro-portfolio` | Previous Astro portfolio |
| `archive/portfolio-byclaude` | Static portfolio snapshot (old folder name) |
