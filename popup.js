const $ = (id) => document.getElementById(id);

function ago(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function pageKey(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.href;
  } catch {
    return url;
  }
}

// Within each group of tabs showing the same page, keep one: pinned first,
// then the active tab, then the most recently viewed. The rest are duplicates.
function findDuplicates(tabs) {
  const groups = new Map();
  for (const t of tabs) {
    if (!t.url || t.url.startsWith("edge://") || t.url.startsWith("about:")) continue;
    const k = pageKey(t.url);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(t);
  }
  const dupes = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    group.sort((a, b) =>
      (b.pinned - a.pinned) || (b.active - a.active) || ((b.lastAccessed || 0) - (a.lastAccessed || 0)));
    dupes.push(...group.slice(1));
  }
  return dupes;
}

async function refresh() {
  const threshold = Number($("amount").value) * Number($("unit").value);
  const now = Date.now();
  const tabs = await chrome.tabs.query({});
  const keep = (t) => !t.active && !($("skipPinned").checked && t.pinned) && !($("skipAudible").checked && t.audible);

  const found = new Map(); // tab id -> {tab, reasons}
  const add = (t, reason) => {
    if (!keep(t)) return;
    if (!found.has(t.id)) found.set(t.id, { tab: t, reasons: [] });
    found.get(t.id).reasons.push(reason);
  };
  for (const t of tabs) {
    if (t.lastAccessed && now - t.lastAccessed >= threshold) add(t, "stale");
  }
  if ($("dupes").checked) {
    for (const t of findDuplicates(tabs)) add(t, "duplicate");
  }

  const rows = [...found.values()].sort((a, b) => (a.tab.lastAccessed || 0) - (b.tab.lastAccessed || 0));
  const list = $("list");
  list.textContent = "";
  for (const { tab: t, reasons } of rows) {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = true;
    cb.dataset.id = t.id;
    const title = document.createElement("span");
    title.className = "t";
    title.textContent = t.title || t.url;
    title.title = t.url;
    const age = document.createElement("span");
    age.className = "a";
    age.textContent = `${reasons.join(" + ")}${t.lastAccessed ? ", " + ago(now - t.lastAccessed) : ""}`;
    li.append(cb, title, age);
    list.append(li);
  }
  $("summary").textContent = `${rows.length} of ${tabs.length} tabs match.`;
  $("close").disabled = rows.length === 0;
}

$("close").addEventListener("click", async () => {
  const ids = [...document.querySelectorAll("#list input:checked")].map((c) => Number(c.dataset.id));
  if (ids.length) await chrome.tabs.remove(ids);
  refresh();
});

for (const id of ["amount", "unit", "dupes", "skipPinned", "skipAudible"]) {
  $(id).addEventListener("input", refresh);
}
refresh();
