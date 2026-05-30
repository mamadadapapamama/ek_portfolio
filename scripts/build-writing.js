const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const { blocksToHtml } = require("./notion-to-html");
const {
  esc,
  slugify,
  getProperty,
  formatDate,
  fileUrl,
  extensionFromUrl,
} = require("./notion-utils");

const ROOT = path.join(__dirname, "..");
const SITE_DIR = path.join(ROOT, "portfolio-byclaude");
const WRITING_DIR = path.join(SITE_DIR, "writing");
const MEDIA_DIR = path.join(SITE_DIR, "assets", "writing");

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const PROP = {
  title: process.env.NOTION_PROP_TITLE || "title",
  slug: process.env.NOTION_PROP_SLUG || "slug",
  date: process.env.NOTION_PROP_DATE || "date",
  published: process.env.NOTION_PROP_PUBLISHED || "published",
  summary: process.env.NOTION_PROP_SUMMARY || "summary",
  cover: process.env.NOTION_PROP_COVER || "cover",
};

function navLinks(basePath = "") {
  const workHref = basePath ? `${basePath}index.html#work` : "index.html#work";
  return `
<nav class="nav">
  <a class="brand" href="${basePath}index.html">EK<span class="dot"></span></a>
  <div class="links">
    <a href="${workHref}">Work</a>
    <a href="${basePath}writing.html">Writing</a>
    <a href="mailto:eunkyung.ek.kim@gmail.com" class="cta">Contact</a>
  </div>
</nav>`;
}

function footer(basePath = "") {
  return `
<footer class="foot">
  <div class="wrap">
    <p class="big"><a href="mailto:eunkyung.ek.kim@gmail.com">Let's make it<br />real <span class="arr">↗</span></a></p>
    <div class="meta">
      <span>© ${new Date().getFullYear()} Eunkyung Kim</span>
      <div class="social">
        <a href="mailto:eunkyung.ek.kim@gmail.com">Email</a>
        <a href="${basePath}writing.html">Writing</a>
        <a href="${basePath}index.html#work">Work</a>
      </div>
    </div>
  </div>
</footer>
<script src="${basePath}assets/main.js"></script>`;
}

function pageShell({ title, basePath, body, extraHead = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<link rel="stylesheet" href="${basePath}assets/style.css" />
<link rel="stylesheet" href="${basePath}assets/writing.css" />
${extraHead}
</head>
<body>
${navLinks(basePath)}
${body}
${footer(basePath)}
</body>
</html>`;
}

async function saveImage(url, name, slug) {
  if (!url) return "";

  const dir = path.join(MEDIA_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  const ext = extensionFromUrl(url);
  const filename = `${name}.${ext}`;
  const absolute = path.join(dir, filename);
  const publicPath = `assets/writing/${slug}/${filename}`;

  if (fs.existsSync(absolute)) {
    return publicPath;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(absolute, buffer);
  return publicPath;
}

function emptyWritingSite() {
  fs.mkdirSync(WRITING_DIR, { recursive: true });
  fs.mkdirSync(MEDIA_DIR, { recursive: true });

  const body = `
<main class="wrap">
  <section class="wr-index-hero" data-reveal>
    <span class="eyebrow">Writing</span>
    <h1 class="display">Notes &amp; <span class="it">essays</span></h1>
    <p class="lede">Longer thoughts on building, design, and making things real.</p>
  </section>
  <section class="wr-empty">
    <p>No published posts yet. Add entries in Notion and mark them as Published.</p>
  </section>
</main>`;

  fs.writeFileSync(
    path.join(SITE_DIR, "writing.html"),
    pageShell({ title: "Writing — EK", basePath: "", body }),
    "utf8",
  );
}

async function fetchPosts(notion, databaseId) {
  const posts = [];
  let cursor;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: PROP.published,
        checkbox: { equals: true },
      },
      sorts: [{ property: PROP.date, direction: "descending" }],
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      const title = getProperty(page, PROP.title);
      if (!title) continue;

      const customSlug = getProperty(page, PROP.slug);
      const slug = slugify(customSlug || title);
      const date = getProperty(page, PROP.date);
      const summary = getProperty(page, PROP.summary);
      const coverFiles = getProperty(page, PROP.cover) || [];
      const coverUrl = fileUrl(coverFiles[0]);

      posts.push({
        id: page.id,
        title,
        slug,
        date,
        dateLabel: formatDate(date),
        summary,
        coverUrl,
      });
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return posts;
}

function renderIndex(posts) {
  const items = posts
    .map(
      (post, index) => `
  <a class="wr-item" href="writing/${esc(post.slug)}.html" data-reveal${index < 4 ? ` data-delay="${index + 1}"` : ""}>
    <div class="wr-item-meta">
      <span class="wr-date">${esc(post.dateLabel)}</span>
    </div>
    <div class="wr-item-body">
      <h2>${esc(post.title)}</h2>
      ${post.summary ? `<p>${esc(post.summary)}</p>` : ""}
      <span class="wr-more">Read <span class="arr">↗</span></span>
    </div>
    ${
      post.coverPath
        ? `<div class="wr-item-cover"><img src="${esc(post.coverPath)}" alt="" loading="lazy" /></div>`
        : ""
    }
  </a>`,
    )
    .join("\n");

  const body = `
<main class="wrap">
  <section class="wr-index-hero" data-reveal>
    <span class="eyebrow">Writing</span>
    <h1 class="display">Notes &amp; <span class="it">essays</span></h1>
    <p class="lede">Longer thoughts on building, design, and making things real.</p>
  </section>
  <section class="wr-list-page">
    ${items || '<p class="wr-empty">No published posts yet.</p>'}
  </section>
</main>`;

  return pageShell({ title: "Writing — EK", basePath: "", body });
}

function renderPost(post) {
  const cover = post.coverPath
    ? `<figure class="wr-cover"><img src="../${esc(post.coverPath)}" alt="" loading="lazy" /></figure>`
    : "";

  const body = `
<main class="wrap">
  <a class="cs-back" href="../writing.html"><span class="arr">←</span> All writing</a>
  <article class="wr-post">
    <header class="wr-post-head" data-reveal>
      <span class="eyebrow">${esc(post.dateLabel)}</span>
      <h1>${esc(post.title)}</h1>
      ${post.summary ? `<p class="wr-deck">${esc(post.summary)}</p>` : ""}
    </header>
    ${cover}
    <div class="wr-content">
      ${post.contentHtml}
    </div>
  </article>
</main>`;

  return pageShell({
    title: `${post.title} — EK`,
    basePath: "../",
    body,
  });
}

async function build() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  fs.rmSync(WRITING_DIR, { recursive: true, force: true });
  fs.rmSync(MEDIA_DIR, { recursive: true, force: true });
  fs.mkdirSync(WRITING_DIR, { recursive: true });
  fs.mkdirSync(MEDIA_DIR, { recursive: true });

  if (!apiKey || !databaseId) {
    console.warn("NOTION_API_KEY or NOTION_DATABASE_ID missing — writing pages skipped.");
    emptyWritingSite();
    return;
  }

  const notion = new Client({ auth: apiKey });
  const posts = await fetchPosts(notion, databaseId);

  for (const post of posts) {
    const ctx = {
      saveImage: (url, name) => saveImage(url, name, post.slug),
    };

    if (post.coverUrl) {
      post.coverPath = await saveImage(post.coverUrl, "cover", post.slug);
    }

    post.contentHtml = await blocksToHtml(notion, post.id, ctx);
    fs.writeFileSync(
      path.join(WRITING_DIR, `${post.slug}.html`),
      renderPost(post),
      "utf8",
    );
  }

  fs.writeFileSync(
    path.join(SITE_DIR, "writing.html"),
    renderIndex(posts),
    "utf8",
  );

  console.log(`Generated writing.html and ${posts.length} post(s).`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
