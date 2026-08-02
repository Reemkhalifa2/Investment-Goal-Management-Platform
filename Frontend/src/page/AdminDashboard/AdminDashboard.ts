// =============================
// Interfaces
// =============================
interface AdminDashboardResponse {
  totalUsers: number;
  activeUsers: number;
  totalInvestments: number;
  activeInvestments: number;
  totalInvestmentAmount: number;
  totalCurrentValue: number;
  totalProfit: number;
}

// =============================
// API Configuration
// =============================
const API_URL: string = "http://localhost:8080/api/admin/dashboard";

// =============================
// Fetch & Render Logic
// =============================
async function fetchAdminOverview(): Promise<AdminDashboardResponse> {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
}

function renderStats(data: AdminDashboardResponse): void {
  const totalUsersEl = document.getElementById("totalUsers");
  const totalUsersDeltaEl = document.getElementById("totalUsersDelta");
  const totalAssetsEl = document.getElementById("totalAssets");
  const totalAssetsDeltaEl = document.getElementById("totalAssetsDelta");
  const activeAssetsEl = document.getElementById("activeAssets");
  const activeAssetsPercentEl = document.getElementById("activeAssetsPercent");
  const categoriesCountEl = document.getElementById("categoriesCount");
  const categoriesListEl = document.getElementById("categoriesList");

  if (totalUsersEl) totalUsersEl.textContent = data.totalUsers.toLocaleString();
  if (totalUsersDeltaEl) totalUsersDeltaEl.textContent = `${data.activeUsers} Active Users`;

  if (totalAssetsEl) totalAssetsEl.textContent = data.totalInvestments.toString();
  if (totalAssetsDeltaEl) totalAssetsDeltaEl.textContent = `Amount: $${data.totalInvestmentAmount.toFixed(2)}`;

  if (activeAssetsEl) activeAssetsEl.textContent = data.activeInvestments.toString();
  if (activeAssetsPercentEl) activeAssetsPercentEl.textContent = `Current Value: $${data.totalCurrentValue.toFixed(2)}`;

  if (categoriesCountEl) categoriesCountEl.textContent = `$${data.totalProfit.toFixed(2)}`;
  if (categoriesListEl) categoriesListEl.textContent = "Total Profit";
}

async function init(): Promise<void> {
  const topbarDateEl = document.getElementById("topbarDate");
  const userNameEl = document.getElementById("userName");
  const userRoleEl = document.getElementById("userRole");
  const userAvatarEl = document.getElementById("userAvatar");

  if (topbarDateEl) {
    topbarDateEl.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  try {
    const data = await fetchAdminOverview();
    renderStats(data);

    if (userNameEl) userNameEl.textContent = "Admin";
    if (userRoleEl) userRoleEl.textContent = "Administrator";
    if (userAvatarEl) userAvatarEl.textContent = "AD";
  } catch (error) {
    console.error("Failed to load admin dashboard:", error);
    if (userNameEl) userNameEl.textContent = "Error Loading Data";
  }
}

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  init();
});
