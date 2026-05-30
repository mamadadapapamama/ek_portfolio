const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
app.set("trust proxy", true);

const rootDir = __dirname;
const portfolioDir = path.join(rootDir, "portfolio-byclaude");
const appDir = path.join(rootDir, "ek_byclaude", "app");
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(rootDir, "data");
const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(rootDir, "uploads");
const entriesPath = path.join(dataDir, "entries.json");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(entriesPath)) {
  fs.writeFileSync(entriesPath, "[]\n", "utf8");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname || "").toLowerCase();
    const ext = safeExt || ".jpg";
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

function readEntries() {
  try {
    const raw = fs.readFileSync(entriesPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEntries(entries) {
  fs.writeFileSync(entriesPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

function sortedEntries() {
  const entries = readEntries();
  return entries.sort((a, b) => {
    const aTime = new Date(a.date || a.createdAt || 0).getTime();
    const bTime = new Date(b.date || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

function wantsAppHost(req) {
  const forwarded = String(req.headers["x-forwarded-host"] || "")
    .split(",")[0]
    .trim();
  const host = (forwarded || req.hostname || "").toLowerCase();
  return host === "app.ekkim.work" || host.startsWith("app.ekkim.work:");
}

app.use(express.json());
app.use("/uploads", express.static(uploadDir));

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/api/entries", (_req, res) => {
  res.json({ items: sortedEntries() });
});

app.get("/api/entries/latest", (_req, res) => {
  const [latest] = sortedEntries();
  if (!latest) {
    res.status(404).json({ message: "No archive entries yet." });
    return;
  }
  res.json(latest);
});

app.post("/api/entries", upload.single("image"), (req, res) => {
  const { title, date, body } = req.body;
  const image = req.file;

  if (!title || !date || !body || !image) {
    res.status(400).json({
      message: "title, date, body, and image are required.",
    });
    return;
  }

  const entry = {
    id: `${Date.now()}`,
    title: String(title).trim(),
    date: String(date).trim(),
    body: String(body).trim(),
    imageUrl: `/uploads/${image.filename}`,
    createdAt: new Date().toISOString(),
  };

  const entries = readEntries();
  entries.push(entry);
  writeEntries(entries);

  res.status(201).json(entry);
});

app.get("/app", (_req, res) => {
  res.sendFile(path.resolve(appDir, "index.html"));
});

app.get("/", (req, res) => {
  if (wantsAppHost(req)) {
    res.sendFile(path.resolve(appDir, "index.html"));
    return;
  }
  res.sendFile(path.resolve(portfolioDir, "index.html"));
});

app.use(express.static(portfolioDir, { index: false }));

app.listen(PORT, () => {
  console.log(`ekkim.work running on http://localhost:${PORT}`);
});
