function hardenDarkMode() {
  // Don’t “toggle” themes; just pin a single dark presentation.
  document.documentElement.dataset.theme = "dark";
  document.documentElement.classList.remove("light");
  document.documentElement.classList.add("dark");
}

function removeThemeToggle(root = document) {
  // Remove anything that looks like a theme toggle control.
  const selectors = [
    // common ids / classes
    "#theme-toggle",
    "#themeToggle",
    ".theme-toggle",
    ".themeToggle",
    ".swagger-theme-toggle",
    ".swagger-ui-theme-toggle",

    // common button/accessibility patterns
    'button[aria-label*="theme" i]',
    'button[title*="theme" i]',
    'button[data-testid*="theme" i]',
    '[role="switch"][aria-label*="theme" i]',
    '[role="switch"][title*="theme" i]',
    '[role="switch"][aria-label*="dark" i]',
    '[role="switch"][aria-label*="light" i]',

    // icon-based toggles
    'button svg[aria-label*="theme" i]',
    'button svg[title*="theme" i]',

    // checkbox/radio style toggles
    'input[type="checkbox"][aria-label*="theme" i]',
    'input[type="checkbox"][aria-label*="dark" i]',
    'input[type="checkbox"][aria-label*="light" i]',
  ];

  for (const selector of selectors) {
    root.querySelectorAll(selector).forEach((el) => {
      const removable =
        el.closest("button") ??
        el.closest('[role="switch"]') ??
        el.closest("label") ??
        el;

      removable.remove?.();
    });
  }
}

function ensureHomeLink() {
  const topbarWrapper = document.querySelector(".swagger-ui .topbar .wrapper");
  if (!topbarWrapper || document.querySelector(".topbar-home-link")) return;

  const homeLink = document.createElement("a");
  homeLink.href = "/";
  homeLink.className = "topbar-home-link";
  homeLink.textContent = "← Home";

  topbarWrapper.insertBefore(homeLink, topbarWrapper.firstChild);
}

document.addEventListener("DOMContentLoaded", () => {
  hardenDarkMode();
  removeThemeToggle(document);

  // Wait for Swagger UI to render, then inject link + strip toggle.
  const interval = setInterval(() => {
    ensureHomeLink();
    removeThemeToggle(document);

    const topbarWrapper = document.querySelector(".swagger-ui .topbar .wrapper");
    if (topbarWrapper) clearInterval(interval);
  }, 100);

  // Keep toggle removed even if Swagger re-renders parts of the DOM.
  const observer = new MutationObserver((mutations) => {
    hardenDarkMode();
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        removeThemeToggle(node);
      }
    }
  });

  observer.observe(document.documentElement, { subtree: true, childList: true });
});
