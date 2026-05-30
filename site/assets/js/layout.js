const CONTACT_EMAIL = "eunkyung.ek.kim@gmail.com";

function assetPath(path, root) {
  return `${root}${path}`;
}

export function renderNav({ root = "", workHref = "index.html#work" } = {}) {
  return `
<nav class="nav" aria-label="Primary">
  <a class="nav__brand" href="${assetPath("index.html", root)}">EK<span class="nav__dot"></span></a>
  <div class="nav__links">
    <a href="${workHref}">Work</a>
    <a href="${assetPath("writing.html", root)}">Writing</a>
    <a href="mailto:${CONTACT_EMAIL}" class="nav__cta">Contact</a>
  </div>
</nav>`;
}

export function renderFooter({ root = "", variant = "default" } = {}) {
  if (variant === "writing") {
    return `
<footer class="foot">
  <div class="wrap">
    <p class="foot__big"><a href="mailto:${CONTACT_EMAIL}">Let's make it<br />real <span class="arr">↗</span></a></p>
    <div class="foot__meta">
      <span>© <span data-year></span> Eunkyung Kim</span>
      <div class="foot__social">
        <a href="mailto:${CONTACT_EMAIL}">Email</a>
        <a href="${assetPath("writing.html", root)}">Writing</a>
        <a href="${assetPath("index.html#work", root)}">Work</a>
      </div>
    </div>
  </div>
</footer>`;
  }

  return `
<footer class="foot" id="contact">
  <div class="wrap">
    <span class="eyebrow foot__eyebrow" data-reveal>Want to build something?</span>
    <p class="foot__big" data-reveal data-delay="1">
      <a href="mailto:${CONTACT_EMAIL}">Let's make it real together <span class="arr">↗</span></a>
    </p>
    <div class="foot__cta" data-reveal data-delay="2">
      <a class="btn btn--on-dark" href="mailto:${CONTACT_EMAIL}">Send me an email <span class="arr">↗</span></a>
    </div>
    <div class="foot__meta">
      <span>© <span data-year></span> Eunkyung (EK) Kim</span>
      <div class="foot__social">
        <a href="mailto:${CONTACT_EMAIL}">Email</a>
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
        <a href="https://twitter.com" target="_blank" rel="noopener">Twitter</a>
      </div>
      <span>Idea → v1</span>
    </div>
  </div>
</footer>`;
}

export function mountLayout() {
  document.querySelectorAll("[data-site-nav]").forEach((slot) => {
    slot.outerHTML = renderNav({
      root: slot.dataset.root || "",
      workHref: slot.dataset.workHref || "index.html#work",
    });
  });

  document.querySelectorAll("[data-site-footer]").forEach((slot) => {
    slot.outerHTML = renderFooter({
      root: slot.dataset.root || "",
      variant: slot.dataset.variant || "default",
    });
  });
}
