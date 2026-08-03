const CONTACT_EMAIL = "eunkyung.ek.kim@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/ekeunkyung/";

function assetPath(path, root) {
  return `${root}${path}`;
}

/** Gmail compose — mailto often does nothing when no desktop mail app is set. */
function emailHref(email = CONTACT_EMAIL) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

const EMAIL_LINK_ATTRS = `href="${emailHref()}" target="_blank" rel="noopener"`;

export function renderNav({ root = "", workHref = "index.html#work" } = {}) {
  return `
<nav class="nav" aria-label="Primary">
      <div class="nav__inner wrap">
    <a class="nav__brand" href="${assetPath("index.html", root)}">
      <img class="nav__logo" src="${assetPath("assets/ek_favicon.png", root)}" alt="EK" width="36" height="36" />
    </a>
    <div class="nav__links">
      <a href="${workHref}">Work</a>
      <a href="${assetPath("writing.html", root)}">Writing</a>
      <a ${EMAIL_LINK_ATTRS} class="nav__cta">Contact</a>
    </div>
  </div>
</nav>`;
}

export function renderFooter({ root = "", variant = "default" } = {}) {
  if (variant === "writing") {
    return `
<footer class="foot">
  <div class="wrap">
    <p class="foot__big"><a ${EMAIL_LINK_ATTRS}>Let's make it<br />real <span class="arr">↗</span></a></p>
    <div class="foot__meta">
      <span>© <span data-year></span> Eunkyung Kim</span>
      <div class="foot__social">
        <a ${EMAIL_LINK_ATTRS}>Email</a>
        <a href="${LINKEDIN_URL}" target="_blank" rel="noopener">LinkedIn</a>
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
      <a ${EMAIL_LINK_ATTRS}>Let's make it real together <span class="arr">↗</span></a>
    </p>
    <div class="foot__cta" data-reveal data-delay="2">
      <a class="btn btn--accent" ${EMAIL_LINK_ATTRS}>Send me an email <span class="arr">↗</span></a>
    </div>
    <div class="foot__meta">
      <span>© <span data-year></span> Eunkyung (EK) Kim</span>
      <div class="foot__social">
        <a ${EMAIL_LINK_ATTRS}>Email</a>
        <a href="${LINKEDIN_URL}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${assetPath("writing.html", root)}">Writing</a>
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
