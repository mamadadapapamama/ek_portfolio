# ekkim.work

Portfolio site for [ekkim.work](https://ekkim.work).

## Layout

```
portfolio-byclaude/   Portfolio HTML/CSS/assets (edit here)
ek_byclaude/app/      Archive admin UI (app.ekkim.work)
server.js             Express server for Render / local dev
vercel.json           Static deploy config for ekkim.work on Vercel
```

## Branches

| Branch | Contents |
|--------|----------|
| `main` | Production portfolio + deploy config |
| `archive/astro-portfolio` | Previous Astro + Vercel portfolio |
| `archive/portfolio-byclaude` | Snapshot before promotion to `main` |

## Local development

```bash
npm install
npm start
```

- `http://localhost:3000` — portfolio
- `http://localhost:3000/app` — archive admin

## Deploy

- **ekkim.work** — Vercel auto-deploys from `main` (`vercel.json` → `portfolio-byclaude/`)
- **app.ekkim.work** — Render Node service (`render.yaml`) for the archive admin API

See `DEPLOY.md` for DNS details.
