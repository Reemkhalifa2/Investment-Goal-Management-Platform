"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_BASE_URL14 = "http://localhost:3000";
const PROFILE_ENDPOINT = `${API_BASE_URL}/api/financial-profile`;
// ---- DOM references ----
const topbarDateEl4 = document.getElementById("topbarDate");
const userNameEl4 = document.getElementById("userName");
const userRoleEl4 = document.getElementById("userRole");
const userAvatarEl4 = document.getElementById("userAvatar");
const profileForm = document.getElementById("profileForm");
const monthlySalaryInput4 = document.getElementById("monthlySalary");
const monthlyExpensesInput4 = document.getElementById("monthlyExpenses");
const currentSavingsInput4 = document.getElementById("currentSavings");
const desiredSavingAmountInput = document.getElementById("desiredSavingAmount");
const investmentDurationInput = document.getElementById("investmentDuration");
const financialGoalInput = document.getElementById("financialGoal");
const riskToggle = document.getElementById("riskToggle");
const riskOptions = riskToggle.querySelectorAll(".risk-option");
const saveBtn = document.getElementById("saveBtn");
const saveBtnLabel = saveBtn.querySelector(".btn-save-label");
let selectedRisk = "Medium";
// ---- Date: computed locally from the user's own device clock ----
function formatTopbarDate(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
// ---- Risk toggle behavior ----
function setSelectedRisk(risk) {
    selectedRisk = risk;
    riskOptions.forEach((btn) => {
        btn.classList.toggle("selected", btn.dataset.risk === risk);
    });
}
riskOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
        setSelectedRisk(btn.dataset.risk);
    });
});
// ---- API calls ----
async function fetchProfile() {
    const response = await fetch(PROFILE_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
async function saveProfile(payload) {
    const response = await fetch(PROFILE_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
}
// ---- Rendering ----
function renderUser4(user) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.initials;
}
function renderProfile(profile) {
    monthlySalaryInput.value = String(profile.monthlySalary);
    monthlyExpensesInput.value = String(profile.monthlyExpenses);
    currentSavingsInput.value = String(profile.currentSavings);
    desiredSavingAmountInput.value = String(profile.desiredSavingAmount);
    investmentDurationInput.value = String(profile.investmentDuration);
    financialGoalInput.value = profile.financialGoal;
    setSelectedRisk(profile.riskLevel);
}
// ---- Form submit ----
profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
        monthlySalary: Number(monthlySalaryInput.value),
        monthlyExpenses: Number(monthlyExpensesInput.value),
        currentSavings: Number(currentSavingsInput.value),
        desiredSavingAmount: Number(desiredSavingAmountInput.value),
        investmentDuration: Number(investmentDurationInput.value),
        financialGoal: financialGoalInput.value.trim(),
        riskLevel: selectedRisk,
    };
    saveBtn.disabled = true;
    saveBtnLabel.textContent = "Saving...";
    try {
        await saveProfile(payload);
        saveBtnLabel.textContent = "Saved ✓";
        setTimeout(() => {
            saveBtnLabel.textContent = "Save financial profile";
        }, 1800);
    }
    catch (err) {
        console.error("Failed to save financial profile:", err);
        saveBtnLabel.textContent = "Save financial profile";
        alert("Could not save your profile. Please check the server and try again.");
    }
    finally {
        saveBtn.disabled = false;
    }
});
// ---- Sidebar navigation (active state) ----
function setupNav() {
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
async function init() {
    topbarDateEl.textContent = formatTopbarDate(new Date());
    setupNav();
    setSelectedRisk("Medium"); // sensible default while data loads
    try {
        const data = await fetchProfile();
        renderUser(data.user);
        renderProfile(data.profile);
    }
    catch (err) {
        console.error("Failed to load financial profile:", err);
        userNameEl.textContent = "—";
        userRoleEl.textContent = "";
    }
}
init();
//# sourceMappingURL=FinancialProfile.js.map