/**
 * Questify — Shared Chrome
 * Injects the top navbar and side navigation into every page.
 * Pages just need: <div id="questify-nav"></div> and <div id="questify-sidebar"></div>
 * plus <script src="js/nav.js"></script> after data.js.
 */

const QNav = (() => {
  const NAV_ITEMS = [
    { href: "index.html", label: "Dashboard", icon: "home" },
    { href: "tasks.html", label: "Tasks", icon: "check" },
    { href: "calendar.html", label: "Calendar", icon: "calendar" },
    { href: "garden.html", label: "Garden", icon: "leaf" },
    { href: "shop.html", label: "Shop", icon: "bag" },
  ];

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
    check: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="m8 12 3 3 5-6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    leaf: '<path d="M5 21c0-9 6-15 15-15 0 9-6 15-15 15Z"/><path d="M5 21c3-5 6-8 12-11"/>',
    bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    flame: '<path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-1-2-1-2 2 1 3 3 3 5a5 5 0 0 1-10 0c0-5 3-6 5-12Z"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  };

  function icon(name, cls = "w-5 h-5") {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
  }

  function currentPage() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    return path;
  }

  function renderTopbar() {
    const mount = document.getElementById("questify-nav");
    if (!mount) return;
    const name = QData.getUserName();
    const stats = QData.getStats();

    mount.innerHTML = `
      <header class="sticky top-0 z-40 px-4 sm:px-6 pt-4">
        <div class="glass-card flex items-center justify-between gap-4 px-5 py-3 rounded-3xl">
          <button id="q-menu-btn" class="lg:hidden p-2 rounded-xl hover:bg-white/40 transition" aria-label="Open menu">
            ${icon("home", "w-5 h-5 hidden")}
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>

          <a href="index.html" class="flex items-center gap-2 select-none">
            <span class="text-2xl">🌿</span>
            <span class="font-semibold text-lg tracking-tight text-slate-700">Questify</span>
          </a>

          <div class="hidden md:flex items-center gap-2 text-sm text-slate-500 mr-auto ml-6">
            Welcome back, <span class="font-medium text-slate-700">${name}</span>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <div class="hidden sm:flex items-center gap-1.5 bg-white/60 rounded-full px-3 py-1.5 text-sm font-medium text-amber-600">
              ${icon("coin", "w-4 h-4")} <span id="q-coins">${stats.coins}</span>
            </div>
            <div class="hidden sm:flex items-center gap-1.5 bg-white/60 rounded-full px-3 py-1.5 text-sm font-medium text-orange-500">
              ${icon("flame", "w-4 h-4")} <span id="q-streak">${stats.streak}</span>
            </div>
            <div class="flex items-center gap-2 bg-white/60 rounded-full pl-1.5 pr-3 py-1.5">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-mint to-lavender flex items-center justify-center text-xs font-semibold text-white">
                ${name.charAt(0).toUpperCase()}
              </div>
              <span id="q-level" class="text-sm font-medium text-slate-600">Lv.${stats.level}</span>
            </div>
          </div>
        </div>
      </header>
    `;

    document.getElementById("q-menu-btn")?.addEventListener("click", () => {
      document.getElementById("questify-sidebar")?.classList.toggle("q-sidebar-open");
      document.getElementById("q-sidebar-backdrop")?.classList.toggle("hidden");
    });
  }

  function renderSidebar() {
    const mount = document.getElementById("questify-sidebar");
    if (!mount) return;
    const page = currentPage();

    const links = NAV_ITEMS.map((item) => {
      const active = item.href === page;
      return `
        <a href="${item.href}" class="q-navlink group ${active ? "q-navlink-active" : ""}">
          ${icon(item.icon, "w-5 h-5 shrink-0")}
          <span>${item.label}</span>
        </a>`;
    }).join("");

    mount.innerHTML = `
      <div id="q-sidebar-backdrop" class="hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"></div>
      <aside id="q-sidebar-panel" class="q-sidebar fixed lg:sticky top-0 lg:top-4 left-0 h-screen lg:h-[calc(100vh-2rem)] w-64 z-40 p-4">
        <div class="glass-card h-full rounded-3xl p-5 flex flex-col">
          <div class="flex items-center gap-2 mb-8 px-1">
            <span class="text-2xl">🌿</span>
            <span class="font-semibold text-lg text-slate-700">Questify</span>
          </div>

          <nav class="flex flex-col gap-1.5 flex-1">
            ${links}
          </nav>

          <div class="mt-6 p-4 rounded-2xl bg-white/50">
            <p class="text-xs text-slate-500 mb-2">Level progress</p>
            <div class="q-progress-track">
              <div id="q-xp-bar" class="q-progress-fill" style="width:${QData.getStats().xpPercent}%"></div>
            </div>
            <p class="text-xs text-slate-500 mt-2"><span id="q-xp-text">${QData.getStats().xpIntoLevel}/${QData.getStats().xpForNextLevel} XP</span></p>
          </div>
        </div>
      </aside>
    `;

    document.getElementById("q-sidebar-backdrop")?.addEventListener("click", () => {
      mount.querySelector("#q-sidebar-panel")?.classList.remove("q-sidebar-open");
      document.getElementById("q-sidebar-backdrop")?.classList.add("hidden");
      mount.classList.remove("q-sidebar-open");
    });
  }

  function refreshStatsUI() {
    const stats = QData.getStats();
    const coinsEl = document.getElementById("q-coins");
    const streakEl = document.getElementById("q-streak");
    const levelEl = document.getElementById("q-level");
    const xpBar = document.getElementById("q-xp-bar");
    const xpText = document.getElementById("q-xp-text");
    if (coinsEl) coinsEl.textContent = stats.coins;
    if (streakEl) streakEl.textContent = stats.streak;
    if (levelEl) levelEl.textContent = `Lv.${stats.level}`;
    if (xpBar) xpBar.style.width = `${stats.xpPercent}%`;
    if (xpText) xpText.textContent = `${stats.xpIntoLevel}/${stats.xpForNextLevel} XP`;
  }

  function init() {
    renderTopbar();
    renderSidebar();
    window.addEventListener("questify:update", refreshStatsUI);
  }

  return { init, refreshStatsUI, icon };
})();

document.addEventListener("DOMContentLoaded", QNav.init);
