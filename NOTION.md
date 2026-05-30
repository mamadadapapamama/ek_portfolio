# Notion → /writing setup

Posts are written in Notion and published to `ekkim.work/writing` at build time.

## 1) Create a Notion integration

1. Open [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **New integration** → name it e.g. `ekkim-writing`
3. Copy the **Internal Integration Secret** → this is `NOTION_API_KEY`

## 2) Create the Writing database

Create a full-page database in Notion with these properties:

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| **Title** | Title | ✅ | Post title |
| **Date** | Date | ✅ | Shown on index + post header |
| **Published** | Checkbox | ✅ | Only checked posts go live |
| **Summary** | Text | optional | Short blurb on index page |
| **Slug** | Text | optional | URL slug (`my-post`). Auto-generated from title if empty |
| **Cover** | Files & media | optional | Cover image on index + post |

Share the database with your integration:

- Open the database → `···` → **Connections** → add `ekkim-writing`

Copy the database ID from the URL:

```
https://www.notion.so/yourworkspace/DATABASE_ID?v=...
                                      ^^^^^^^^^^^
```

## 3) Write a post

1. Add a row in the database
2. Fill **Title**, **Date**, **Summary** (optional), **Cover** (optional)
3. Open the page and write the body with normal Notion blocks (headings, lists, images, quotes, etc.)
4. Check **Published**
5. Push to GitHub or redeploy on Vercel → the post appears at `/writing/your-slug`

## 4) Environment variables

### Local

```bash
cp .env.example .env
# fill in NOTION_API_KEY and NOTION_DATABASE_ID
npm run build:writing
```

### Vercel

Project → **Settings** → **Environment Variables**:

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`

Add to **Production** (and Preview if you want preview deploys to include posts).

## 5) Deploy flow

Every Vercel deploy runs:

```bash
npm run build:writing
```

This generates:

- `portfolio-byclaude/writing.html` — index
- `portfolio-byclaude/writing/*.html` — posts
- `portfolio-byclaude/assets/writing/*` — downloaded images

The portfolio **hero is not affected**. Writing lives only under `/writing`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Empty writing page | Check `Published` is checked; verify env vars on Vercel |
| Build fails on Vercel | Confirm integration is connected to the database |
| Images missing | Re-deploy; images are downloaded at build time from Notion |
| Wrong slug | Set **Slug** explicitly in Notion |
