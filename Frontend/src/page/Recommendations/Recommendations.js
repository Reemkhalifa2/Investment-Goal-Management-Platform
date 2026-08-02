"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_BASE_URL11 = "http://localhost:3000";
const AI_PLAN_ENDPOINT = `${API_BASE_URL}/api/ai-plan`;
// ---- DOM references ----
const topbarDateEl = document.getElementById("topbarDate");
const userNameEl = document.getElementById("userName");
const userRoleEl = document.getElementById("userRole");
const userAvatarEl = document.getElementById("userAvatar");
const planSubtitleEl = document.getElementById("planSubtitle");
const aiHeadlineEl = document.getElementById("aiHeadline");
const aiSubEl = document.getElementById("aiSub");
const aiSplitEl = document.getElementById("aiSplit");
const allocationLegendEl = document.getElementById("allocationLegend");
const fitListEl = document.getElementById("fitList");
const scenarioRangeEl = document.getElementById("scenarioRange");
const scenarioSubEl = document.getElementById("scenarioSub");
const scenarioNoteEl = document.getElementById("scenarioNote");
// ---- Helpers ----
function formatCurrency11(value) {
    return `$${value.toLocaleString()}`;
}
function formatTopbarDate11(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
// ---- API call ----
async function fetchAiPlan() {
    const response = await fetch(AI_PLAN_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
// ---- Rendering ----
function renderUser11(user) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.initials;
}
function renderPlan(data) {
    planSubtitleEl.textContent = data.subtitle;
    aiHeadlineEl.textContent = `Invest ${formatCurrency(data.plan.monthlyAmount)} monthly`;
    aiSubEl.textContent = data.plan.description;
    aiSplitEl.innerHTML = "";
    data.plan.split.forEach((item) => {
        const div = document.createElement("div");
        div.className = "ai-split-item";
        div.innerHTML = `<div class="ai-split-value">${item.percent}%</div><div class="ai-split-label">${item.label}</div>`;
        aiSplitEl.appendChild(div);
    });
}
function renderAllocationLegend11(allocation) {
    allocationLegendEl.innerHTML = "";
    allocation.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="dot" style="background:${item.color}"></span>${item.label} <b>${item.percent}%</b>`;
        allocationLegendEl.appendChild(li);
    });
}
function renderAllocationChart11(allocation) {
    const canvas = document.getElementById("allocationChart");
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: allocation.map((a) => a.label),
            datasets: [
                {
                    data: allocation.map((a) => a.percent),
                    backgroundColor: allocation.map((a) => a.color),
                    borderWidth: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#1a2233",
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
                    },
                },
            },
        },
    });
}
function renderFitList(items) {
    fitListEl.innerHTML = "";
    items.forEach((text) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <svg class="fit-check" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>${text}</span>
    `;
        fitListEl.appendChild(li);
    });
}
function renderScenario(scenario) {
    scenarioRangeEl.textContent = scenario.rangeLabel;
    scenarioSubEl.textContent = scenario.rangeSub;
    scenarioNoteEl.textContent = scenario.note;
}
// ---- Sidebar navigation (active state) ----
function setupNav11() {
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
async function init11() {
    topbarDateEl.textContent = formatTopbarDate(new Date());
    setupNav();
    try {
        const data = await fetchAiPlan();
        renderUser(data.user);
        renderPlan(data);
        renderAllocationLegend11(data.allocation);
        renderAllocationChart11(data.allocation);
        renderFitList(data.whyThisFits);
        renderScenario(data.historicalScenario);
    }
    catch (err) {
        console.error("Failed to load AI plan data:", err);
        userNameEl.textContent = "—";
        userRoleEl.textContent = "";
        planSubtitleEl.textContent = "Could not load your plan. Check that the backend is running, then refresh.";
    }
}
init();
//# sourceMappingURL=Recommendations.js.map