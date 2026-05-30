# ekkim.work

Portfolio site for [ekkim.work](https://ekkim.work), served by a small Node app on Render.

## Branches

| Branch | Contents |
|--------|----------|
| `main` | Production portfolio (static HTML) + Render server |
| `archive/astro-portfolio` | Previous Astro + Vercel portfolio |
| `archive/portfolio-byclaude` | Snapshot of the static portfolio before promotion to `main` |

## Local development

```bash
npm install
npm start
```

Open `http://localhost:3000` for the portfolio. The archive admin UI is at `http://localhost:3000/app`.

## Deploy

Render reads `render.yaml` and deploys from `main`. Custom domains:

- `ekkim.work` — portfolio
- `app.ekkim.work` — archive admin

See `DEPLOY.md` for DNS and setup details.
