"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_BASE_URL10 = "http://localhost:3000";
const PORTFOLIO_ENDPOINT = `${API_BASE_URL}/api/portfolio`;
// ---- DOM references ----
const topbarDateEl10 = document.getElementById("topbarDate");
const userNameEl10 = document.getElementById("userName");
const userRoleEl10 = document.getElementById("userRole");
const userAvatarEl10 = document.getElementById("userAvatar");
const investedValueEl = document.getElementById("investedValue");
const currentValueEl = document.getElementById("currentValue");
const currentValueDeltaEl = document.getElementById("currentValueDelta");
const profitValueEl = document.getElementById("profitValue");
const profitDeltaEl = document.getElementById("profitDelta");
const holdingsListEl = document.getElementById("holdingsList");
// ---- Helpers ----
function formatCurrency10(value) {
    return `$${Math.round(value).toLocaleString()}`;
}
function formatTopbarDate10(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
// ---- API call ----
async function fetchPortfolio() {
    const response = await fetch(PORTFOLIO_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
// ---- Rendering ----
function renderUser10(user) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.initials;
}
function renderStats10(stats) {
    investedValueEl.textContent = formatCurrency(stats.invested);
    currentValueEl.textContent = formatCurrency(stats.currentValue);
    currentValueDeltaEl.textContent = stats.currentValueDeltaLabel;
    profitValueEl.textContent = `+${formatCurrency(stats.profit)}`;
    profitDeltaEl.textContent = stats.profitDeltaLabel;
}
function renderHoldingRow(holding) {
    const li = document.createElement("li");
    li.className = "holding-row";
    const changeClass = holding.changePercent >= 0 ? "positive" : "negative";
    const changeSign = holding.changePercent >= 0 ? "+" : "";
    li.innerHTML = `
    <div class="holding-badge">${holding.symbol}</div>
    <div class="holding-info">
      <div class="holding-name">${holding.name}</div>
      <div class="holding-sub">${holding.subtitle}</div>
    </div>
    <div class="holding-figures">
      <div class="holding-amount">${formatCurrency(holding.amount)}</div>
      <div class="holding-change ${changeClass}">${changeSign}${holding.changePercent.toFixed(1)}%</div>
    </div>
  `;
    return li;
}
function renderHoldings(holdings) {
    holdingsListEl.innerHTML = "";
    if (holdings.length === 0) {
        const li = document.createElement("li");
        li.className = "table-message";
        li.textContent = "No holdings yet.";
        holdingsListEl.appendChild(li);
        return;
    }
    holdings.forEach((holding) => {
        holdingsListEl.appendChild(renderHoldingRow(holding));
    });
}
function renderGrowthChart10(growthChart) {
    const growthCanvas = document.getElementById("growthChart");
    const growthCtx = growthCanvas.getContext("2d");
    const growthGradient = growthCtx.createLinearGradient(0, 0, 0, 220);
    growthGradient.addColorStop(0, "rgba(20, 106, 79, 0.18)");
    growthGradient.addColorStop(1, "rgba(20, 106, 79, 0)");
    new Chart(growthCtx, {
        type: "line",
        data: {
            labels: growthChart.labels,
            datasets: [
                {
                    label: "Portfolio value",
                    data: growthChart.portfolioValues,
                    borderColor: "#146a4f",
                    backgroundColor: growthGradient,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    tension: 0.35,
                    fill: true,
                },
                {
                    label: "Contributions",
                    data: growthChart.contributionValues,
                    borderColor: "#c7cdd6",
                    borderDash: [4, 4],
                    borderWidth: 1.5,
                    pointRadius: 0,
                    tension: 0.2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#1a2233",
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#7b8494", font: { size: 11 } },
                },
                y: {
                    ticks: {
                        color: "#7b8494",
                        font: { size: 11 },
                        callback: (value) => `$${value / 1000}k`,
                    },
                    grid: { color: "#eef0f3" },
                },
            },
        },
    });
}
// ---- Sidebar navigation (active state) ----
function setupNav10() {
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
async function init10() {
    topbarDateEl.textContent = formatTopbarDate(new Date());
    setupNav();
    try {
        const data = await fetchPortfolio();
        renderUser(data.user);
        renderStats10(data.stats);
        renderHoldings(data.holdings);
        renderGrowthChart10(data.growthChart);
    }
    catch (err) {
        console.error("Failed to load portfolio data:", err);
        userNameEl.textContent = "—";
        userRoleEl.textContent = "";
        holdingsListEl.innerHTML = `<li class="table-message">Could not load holdings. Check that the backend is running, then refresh.</li>`;
    }
}
init();
//# sourceMappingURL=Portfolio.js.map