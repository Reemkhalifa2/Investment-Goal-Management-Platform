"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_BASE_URL6 = "http://localhost:3000";
const GOAL_ENDPOINT = `${API_BASE_URL}/api/investment-goal`;
// ---- DOM references ----
const topbarDateEl6 = document.getElementById("topbarDate");
const userNameEl6 = document.getElementById("userName");
const userRoleEl6 = document.getElementById("userRole");
const userAvatarEl6 = document.getElementById("userAvatar");
const monthlySalaryInput = document.getElementById("monthlySalary");
const monthlyExpensesInput = document.getElementById("monthlyExpenses");
const currentSavingsInput = document.getElementById("currentSavings");
const targetAmountInput = document.getElementById("targetAmount");
const monthlyContributionInput = document.getElementById("monthlyContribution");
const availableAmountEl = document.getElementById("availableAmount");
const monthlyCapacityEl = document.getElementById("monthlyCapacity");
const capacityPercentEl = document.getElementById("capacityPercent");
const savingProgressEl = document.getElementById("savingProgress");
const savingRemainingEl = document.getElementById("savingRemaining");
const goalTimelineMonthsEl = document.getElementById("goalTimelineMonths");
const goalTimelineYearsEl = document.getElementById("goalTimelineYears");
const achievementAmountsEl = document.getElementById("achievementAmounts");
const achievementFillEl = document.getElementById("achievementFill");
const achievementNoteEl = document.getElementById("achievementNote");
// ---- Helpers ----
function formatCurrency6(value) {
    return `$${Math.round(value).toLocaleString()}`;
}
function formatTopbarDate6(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}
// ---- API call ----
async function fetchGoal() {
    const response = await fetch(GOAL_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
// ---- Live calculation (client-side, recalculates as the user types) ----
function recalculate() {
    const monthlySalary = Number(monthlySalaryInput.value) || 0;
    const monthlyExpenses = Number(monthlyExpensesInput.value) || 0;
    const currentSavings = Number(currentSavingsInput.value) || 0;
    const targetAmount = Number(targetAmountInput.value) || 0;
    const monthlyContribution = Number(monthlyContributionInput.value) || 0;
    // Available investment amount
    const availableAmount = monthlySalary - monthlyExpenses;
    availableAmountEl.textContent = formatCurrency(availableAmount);
    // Monthly investment capacity (same figure, shown as % of income)
    const capacityPercent = monthlySalary > 0 ? (availableAmount / monthlySalary) * 100 : 0;
    monthlyCapacityEl.textContent = formatCurrency(availableAmount);
    capacityPercentEl.textContent = `${capacityPercent.toFixed(0)}% of income`;
    // Saving progress
    const progressPercent = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
    const remaining = Math.max(targetAmount - currentSavings, 0);
    savingProgressEl.textContent = `${progressPercent.toFixed(1)}%`;
    savingRemainingEl.textContent = `${formatCurrency(remaining)} remaining`;
    // Goal timeline
    const monthsRemaining = monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : 0;
    const years = Math.floor(monthsRemaining / 12);
    const months = monthsRemaining % 12;
    goalTimelineMonthsEl.textContent = monthlyContribution > 0 ? `${monthsRemaining} months` : "—";
    goalTimelineYearsEl.textContent = monthlyContribution > 0 ? `${years} years, ${months} months` : "Add a monthly contribution";
    // Goal achievement bar
    const clampedPercent = Math.min(Math.max(progressPercent, 0), 100);
    achievementAmountsEl.textContent = `${formatCurrency(currentSavings)} / ${formatCurrency(targetAmount)}`;
    achievementFillEl.style.width = `${clampedPercent}%`;
    if (monthlyContribution > 0 && remaining > 0) {
        const targetDate = addMonths(new Date(), monthsRemaining);
        const monthName = MONTH_NAMES[targetDate.getMonth()];
        achievementNoteEl.textContent = `At ${formatCurrency(monthlyContribution)}/month, you could reach this goal around ${monthName} ${targetDate.getFullYear()}. Returns are not included.`;
    }
    else if (remaining <= 0 && targetAmount > 0) {
        achievementNoteEl.textContent = "You've already reached this goal. 🎉";
    }
    else {
        achievementNoteEl.textContent = "Enter a monthly contribution to see an estimated timeline.";
    }
}
// ---- Rendering ----
function renderUser6(user) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.initials;
}
function renderGoalInputs(goal) {
    monthlySalaryInput.value = String(goal.monthlySalary);
    monthlyExpensesInput.value = String(goal.monthlyExpenses);
    currentSavingsInput.value = String(goal.currentSavings);
    targetAmountInput.value = String(goal.targetAmount);
    monthlyContributionInput.value = String(goal.monthlyContribution);
}
// ---- Wire up live recalculation on every input change ----
[
    monthlySalaryInput,
    monthlyExpensesInput,
    currentSavingsInput,
    targetAmountInput,
    monthlyContributionInput,
].forEach((input) => {
    input.addEventListener("input", recalculate);
});
// ---- Sidebar navigation (active state) ----
function setupNav6() {
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
async function init6() {
    topbarDateEl.textContent = formatTopbarDate(new Date());
    setupNav();
    try {
        const data = await fetchGoal();
        renderUser(data.user);
        renderGoalInputs(data.goal);
        recalculate();
    }
    catch (err) {
        console.error("Failed to load investment goal data:", err);
        userNameEl.textContent = "—";
        userRoleEl.textContent = "";
    }
}
init();
//# sourceMappingURL=Goals.js.map