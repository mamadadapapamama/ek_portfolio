function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function richText(items) {
  if (!Array.isArray(items)) return "";
  return items.map((item) => {
    let text = esc(item.plain_text);
    if (item.annotations?.code) text = `<code>${text}</code>`;
    if (item.annotations?.bold) text = `<strong>${text}</strong>`;
    if (item.annotations?.italic) text = `<em>${text}</em>`;
    if (item.href) text = `<a href="${esc(item.href)}" target="_blank" rel="noopener">${text}</a>`;
    return text;
  }).join("");
}

function getProperty(page, name) {
  const property = page.properties?.[name];
  if (!property) return null;

  switch (property.type) {
    case "title":
      return property.title?.map((item) => item.plain_text).join("") || "";
    case "rich_text":
      return property.rich_text?.map((item) => item.plain_text).join("") || "";
    case "date":
      return property.date?.start || "";
    case "checkbox":
      return Boolean(property.checkbox);
    case "files":
      return property.files || [];
    case "url":
      return property.url || "";
    default:
      return null;
  }
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fileUrl(file) {
  if (!file) return "";
  if (file.type === "external") return file.external?.url || "";
  return file.file?.url || "";
}

function extensionFromUrl(url, fallback = "jpg") {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop()?.toLowerCase();
    if (ext && ext.length <= 5) return ext;
  } catch {
    // ignore
  }
  return fallback;
}

module.exports = {
  esc,
  slugify,
  richText,
  getProperty,
  formatDate,
  fileUrl,
  extensionFromUrl,
};
