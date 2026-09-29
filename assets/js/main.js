// Command palette: ⌘K / Ctrl+K / "/" opens a search over the home JSON index.
const root = document.getElementById("palette");
if (root) {
  const input = root.querySelector(".palette-input");
  const list = root.querySelector(".palette-results");
  let index = null;
  let items = [];
  let sel = 0;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  async function load() {
    if (index || !root.dataset.index) return;
    try { index = await (await fetch(root.dataset.index)).json(); } catch { index = []; }
  }

  function render() {
    const q = input.value.trim().toLowerCase();
    items = (index || []).filter((p) =>
      !q || [p.title, p.summary, p.outcome, ...(p.tags || [])].join(" ").toLowerCase().includes(q)
    ).slice(0, 8);
    sel = 0;
    list.innerHTML = items.length
      ? items.map((p, i) => `<li role="option" aria-selected="${i === sel}"><a href="${esc(p.url)}">${esc(p.title)}<small>${esc(p.date)}${p.tags?.length ? " · #" + p.tags.map(esc).join(" #") : ""}</small></a></li>`).join("")
      : `<li class="empty">No matches.</li>`;
  }

  function move(d) {
    if (!items.length) return;
    sel = (sel + d + items.length) % items.length;
    list.querySelectorAll("li").forEach((li, i) => li.setAttribute("aria-selected", i === sel));
    list.children[sel].scrollIntoView({ block: "nearest" });
  }

  async function open() {
    root.hidden = false;
    input.value = "";
    input.focus();
    await load();
    render();
  }
  const close = () => { root.hidden = true; };

  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing && root.hidden)) {
      e.preventDefault();
      root.hidden ? open() : close();
    } else if (!root.hidden) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter" && items[sel]) location.href = items[sel].url;
    }
  });
  input.addEventListener("input", render);
  document.querySelectorAll("[data-palette-open]").forEach((b) => b.addEventListener("click", open));
  root.querySelectorAll("[data-palette-close]").forEach((b) => b.addEventListener("click", close));
}

// Outcome filter chips + archive grep. Both act on [data-outcome] items inside [data-filter-target].
const target = document.querySelector("[data-filter-target]");
if (target) {
  const chips = document.querySelectorAll("[data-filter]");
  const grep = document.querySelector("[data-grep]");
  const shown = document.querySelector("[data-shown]");
  const none = document.querySelector("[data-no-results]");
  let outcome = "";

  const apply = () => {
    const q = (grep?.value || "").trim().toLowerCase();
    let count = 0;
    target.querySelectorAll("[data-outcome]").forEach((el) => {
      const ok = (!outcome || el.dataset.outcome === outcome) &&
        (!q || (el.dataset.text || el.textContent.toLowerCase()).includes(q));
      el.hidden = !ok;
      if (ok) count++;
    });
    target.querySelectorAll("[data-year]").forEach((y) => {
      y.hidden = !y.querySelector("[data-outcome]:not([hidden])");
    });
    if (shown) shown.textContent = count;
    if (none) none.hidden = count > 0;
  };

  chips.forEach((c) => c.addEventListener("click", () => {
    outcome = c.dataset.filter;
    chips.forEach((o) => o.setAttribute("aria-pressed", o === c));
    apply();
  }));
  grep?.addEventListener("input", apply);
  grep?.addEventListener("keydown", (e) => { if (e.key === "Escape") { grep.value = ""; apply(); } });
}

// Copy buttons on code blocks.
document.querySelectorAll("[data-copy]").forEach((btn) => btn.addEventListener("click", async () => {
  const code = btn.closest(".codeblock")?.querySelector("pre code, pre");
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code.innerText);
    btn.textContent = "Copied";
  } catch {
    btn.textContent = "Failed";
  }
  setTimeout(() => { btn.textContent = "Copy"; }, 1500);
}));

// Highlight the TOC entry for the section in view.
const tocLinks = [...document.querySelectorAll(".toc nav a")];
if (tocLinks.length && "IntersectionObserver" in window) {
  const byId = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      tocLinks.forEach((a) => a.classList.remove("active"));
      byId.get(en.target.id)?.classList.add("active");
    });
  }, { rootMargin: "-80px 0px -70% 0px" });
  byId.forEach((_, id) => { const h = document.getElementById(id); if (h) io.observe(h); });
}
