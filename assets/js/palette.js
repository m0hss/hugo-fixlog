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
      !q || [p.title, p.summary, ...(p.tags || [])].join(" ").toLowerCase().includes(q)
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
