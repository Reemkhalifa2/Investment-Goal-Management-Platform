"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_BASE_URL7 = "http://localhost:3000";
const HISTORY_ENDPOINT = `${API_BASE_URL}/api/investment-history`;
// ---- DOM references ----
const topbarDateEl7 = document.getElementById("topbarDate");
const userNameEl7 = document.getElementById("userName");
const userRoleEl7 = document.getElementById("userRole");
const userAvatarEl7 = document.getElementById("userAvatar");
const historyTableBody = document.getElementById("historyTableBody");
// ---- Helpers ----
function formatTopbarDate7(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
function formatHistoryDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}
function formatCurrency7(value) {
    return `$${value.toFixed(2)}`;
}
// ---- API call ----
async function fetchHistory() {
    const response = await fetch(HISTORY_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
// ---- Rendering ----
function renderUser7(user) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.initials;
}
function renderHistoryRow(entry) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td class="history-date">${formatHistoryDate(entry.date)}</td>
    <td class="history-asset">${entry.assetName}</td>
    <td><span class="type-pill">${entry.type}</span></td>
    <td class="align-right history-amount">${formatCurrency(entry.amount)}</td>
  `;
    return tr;
}
function renderHistoryTable(history) {
    historyTableBody.innerHTML = "";
    if (history.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="4" class="table-message">No investment activity yet.</td>`;
        historyTableBody.appendChild(tr);
        return;
    }
    history.forEach((entry) => {
        historyTableBody.appendChild(renderHistoryRow(entry));
    });
}
function showTableMessage7(message) {
    historyTableBody.innerHTML = `<tr><td colspan="4" class="table-message">${message}</td></tr>`;
}
// ---- Sidebar navigation (active state) ----
function setupNav7() {
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
async function init7() {
    topbarDateEl.textContent = formatTopbarDate(new Date());
    setupNav();
    showTableMessage("Loading history...");
    try {
        const data = await fetchHistory();
        renderUser(data.user);
        renderHistoryTable(data.history);
    }
    catch (err) {
        console.error("Failed to load investment history:", err);
        userNameEl.textContent = "—";
        userRoleEl.textContent = "";
        showTableMessage("Could not load history. Check that the backend is running and reachable, then refresh.");
    }
}
init();
//# sourceMappingURL=InvestmentHistory.js.map