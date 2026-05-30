const { richText, esc } = require("./notion-utils");

async function listAllBlocks(notion, blockId) {
  const blocks = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

async function renderBlocks(notion, blocks, ctx) {
  const parts = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const ordered = block.type === "numbered_list_item";
      const tag = ordered ? "ol" : "ul";
      const items = [];

      while (
        index < blocks.length &&
        blocks[index].type === block.type
      ) {
        const item = blocks[index];
        const itemHtml = richText(item[item.type].rich_text);
        const nested = item.has_children
          ? await renderBlocks(
              notion,
              await listAllBlocks(notion, item.id),
              ctx,
            )
          : "";
        items.push(`<li>${itemHtml}${nested}</li>`);
        index += 1;
      }

      parts.push(`<${tag} class="wr-list">${items.join("")}</${tag}>`);
      continue;
    }

    parts.push(await renderBlock(notion, block, ctx));
    index += 1;
  }

  return parts.join("\n");
}

async function renderBlock(notion, block, ctx) {
  const type = block.type;

  switch (type) {
    case "paragraph": {
      const text = richText(block.paragraph.rich_text);
      return text ? `<p>${text}</p>` : "";
    }
    case "heading_1":
      return `<h2>${richText(block.heading_1.rich_text)}</h2>`;
    case "heading_2":
      return `<h3>${richText(block.heading_2.rich_text)}</h3>`;
    case "heading_3":
      return `<h4>${richText(block.heading_3.rich_text)}</h4>`;
    case "quote":
      return `<blockquote>${richText(block.quote.rich_text)}</blockquote>`;
    case "divider":
      return `<hr />`;
    case "code":
      return `<pre><code>${esc(block.code.rich_text.map((item) => item.plain_text).join(""))}</code></pre>`;
    case "callout": {
      const icon = block.callout.icon?.emoji ? `${block.callout.icon.emoji} ` : "";
      return `<aside class="wr-callout">${icon}${richText(block.callout.rich_text)}</aside>`;
    }
    case "image": {
      const image = block.image;
      const source = image.type === "external" ? image.external.url : image.file.url;
      const local = await ctx.saveImage(source, `block-${block.id}`);
      const caption = richText(image.caption);
      return `<figure class="wr-figure"><img src="${esc(local)}" alt="${esc(caption || "")}" loading="lazy" />${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    }
    case "video": {
      const video = block.video;
      const source = video.type === "external" ? video.external.url : video.file?.url;
      if (!source) return "";
      return `<div class="wr-video"><a href="${esc(source)}" target="_blank" rel="noopener">Watch video ↗</a></div>`;
    }
    case "bookmark": {
      const url = block.bookmark.url;
      const caption = richText(block.bookmark.caption) || esc(url);
      return `<p class="wr-bookmark"><a href="${esc(url)}" target="_blank" rel="noopener">${caption} ↗</a></p>`;
    }
    case "embed": {
      const url = block.embed.url;
      return `<div class="wr-embed"><a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)} ↗</a></div>`;
    }
    default:
      if (block.has_children) {
        const children = await renderBlocks(
          notion,
          await listAllBlocks(notion, block.id),
          ctx,
        );
        return children ? `<div class="wr-group">${children}</div>` : "";
      }
      return "";
  }
}

async function blocksToHtml(notion, pageId, ctx) {
  const blocks = await listAllBlocks(notion, pageId);
  return renderBlocks(notion, blocks, ctx);
}

module.exports = {
  blocksToHtml,
};
