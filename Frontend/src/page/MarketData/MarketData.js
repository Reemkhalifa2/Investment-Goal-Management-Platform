"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MARKET_DATA_ENDPOINT = `${API_BASE_URL}/api/market-data`;
const REFRESH_ENDPOINT = `${API_BASE_URL}/api/market-data/refresh`;
// ---- DOM references ----
const topbarDateEl9 = document.getElementById("topbarDate");
const userNameEl9 = document.getElementById("userName");
const userRoleEl9 = document.getElementById("userRole");
const userAvatarEl9 = document.getElementById("userAvatar");
const connectedSourcesEl = document.getElementById("connectedSources");
const latestUpdateEl = document.getElementById("latestUpdate");
const historyRecordsEl = document.getElementById("historyRecords");
const marketTableBody = document.getElementById("marketTableBody");
const refreshBtn = document.getElementById("refreshBtn");
const refreshBtnLabel = document.getElementById("refreshBtnLabel");
// ---- Helpers ----
function formatTopbarDate9(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
function formatPrice(value) {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
// ---- API calls ----
async function fetchMarketData() {
    const response = await fetch(MARKET_DATA_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
async function refreshSources() {
    const response = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
// ---- Rendering ----
function renderUser9(user) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.initials;
}
function renderStats9(stats) {
    connectedSourcesEl.textContent = String(stats.connectedSources);
    latestUpdateEl.textContent = stats.lastUpdatedLabel;
    historyRecordsEl.textContent = stats.historyRecords.toLocaleString();
}
function renderSourceRow(source) {
    const tr = document.createElement("tr");
    const statusClass = source.status === "Healthy" ? "status-healthy" : "status-unhealthy";
    tr.innerHTML = `
    <td class="market-asset">${source.assetName}</td>
    <td class="market-provider">${source.provider}</td>
    <td><span class="source-pill">${source.source}</span></td>
    <td class="market-endpoint">${source.endpoint}</td>
    <td class="market-price">${formatPrice(source.latestPrice)}</td>
    <td><span class="${statusClass}">${source.status}</span></td>
  `;
    return tr;
}
function renderSourcesTable(sources) {
    marketTableBody.innerHTML = "";
    if (sources.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="6" class="table-message">No connected sources.</td>`;
        marketTableBody.appendChild(tr);
        return;
    }
    sources.forEach((source) => {
        marketTableBody.appendChild(renderSourceRow(source));
    });
}
function showTableMessage9(message) {
    marketTableBody.innerHTML = `<tr><td colspan="6" class="table-message">${message}</td></tr>`;
}
// ---- Refresh button ----
refreshBtn.addEventListener("click", async () => {
    refreshBtn.disabled = true;
    refreshBtnLabel.textContent = "Refreshing...";
    try {
        const result = await refreshSources();
        latestUpdateEl.textContent = result.lastUpdatedLabel;
        renderSourcesTable(result.sources);
        refreshBtnLabel.textContent = "Refreshed ✓";
        setTimeout(() => {
            refreshBtnLabel.textContent = "Refresh sources";
        }, 1800);
    }
    catch (err) {
        console.error("Failed to refresh sources:", err);
        refreshBtnLabel.textContent = "Refresh sources";
        alert("Could not refresh sources. Please check the server and try again.");
    }
    finally {
        refreshBtn.disabled = false;
    }
});
// ---- Sidebar navigation (active state) ----
function setupNav9() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            if (item.getAttribute("href") !== "#")
                return; // allow real page links to navigate
            event.preventDefault();
            navItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
        });
    });
}
// ---- Init ----
async function init9() {
    topbarDateEl.textContent = formatTopbarDate(new Date());
    setupNav();
    showTableMessage("Loading market sources...");
    try {
        const data = await fetchMarketData();
        renderUser(data.user);
        renderStats9(data.stats);
        renderSourcesTable(data.sources);
    }
    catch (err) {
        console.error("Failed to load market data:", err);
        userNameEl.textContent = "—";
        userRoleEl.textContent = "";
        showTableMessage("Could not load market data. Check that the backend is running and reachable, then refresh.");
    }
}
init();
//# sourceMappingURL=MarketData.js.map