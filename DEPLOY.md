# ekkim.work production deploy

This app serves both domains from one Node process:

- `ekkim.work` -> portfolio site (static HTML at repo root)
- `app.ekkim.work` -> archive admin app (write image/title/date/body)

## Option A) Render (recommended)

### 1) Connect this GitHub repo

Render deploys from the `main` branch of [ek_portfolio](https://github.com/mamadadapapamama/ek_portfolio).

### 2) Create web service from `render.yaml`

- Render Dashboard -> New -> Blueprint
- Select this repository
- Render reads `render.yaml` automatically

### 3) Add custom domains

In Render service settings -> Custom Domains:

- `ekkim.work`
- `www.ekkim.work`
- `app.ekkim.work`

### 4) Update DNS

At your DNS provider, point apex/root `ekkim.work`, `www`, and `app` to the Render targets shown in the custom domain screen.

### 5) Verify

- `https://ekkim.work` loads the portfolio
- `https://app.ekkim.work` loads the admin page
- save one entry in the app page and confirm it persists

---

## Option B) Self-host with Nginx

Use `deploy/nginx/ekkim.work.conf`.

```bash
npm install
npm start
```

Then install and enable the Nginx config, point DNS to your server, and add HTTPS with certbot. See the nginx config file for host routing.
