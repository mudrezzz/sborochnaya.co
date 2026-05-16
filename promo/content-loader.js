(function () {
  function parseContent(raw) {
    const map = new Map();
    const lines = raw.split(/\r?\n/);

    for (const originalLine of lines) {
      const line = originalLine.trim();
      if (!line || line.startsWith('#')) continue;

      const eqIndex = line.indexOf('=');
      if (eqIndex <= 0) continue;

      const key = line.slice(0, eqIndex).trim();
      const value = line.slice(eqIndex + 1).trim().replace(/\\n/g, '\n');
      map.set(key, value);
    }

    return map;
  }

  function applyContent(contentMap) {
    document.querySelectorAll('[data-text-key]').forEach((el) => {
      const key = el.getAttribute('data-text-key');
      if (!contentMap.has(key)) return;

      const value = contentMap.get(key);
      const mode = el.getAttribute('data-text-mode');
      if (mode === 'html') {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-attr-key][data-attr-name]').forEach((el) => {
      const key = el.getAttribute('data-attr-key');
      const attr = el.getAttribute('data-attr-name');
      if (!contentMap.has(key)) return;
      el.setAttribute(attr, contentMap.get(key));
    });
  }

  async function loadContent() {
    try {
      const response = await fetch('content.txt', { cache: 'no-store' });
      if (!response.ok) return;

      const raw = await response.text();
      const contentMap = parseContent(raw);
      applyContent(contentMap);
    } catch (error) {
      console.warn('[content-loader] Failed to load content.txt:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent, { once: true });
  } else {
    loadContent();
  }
})();
