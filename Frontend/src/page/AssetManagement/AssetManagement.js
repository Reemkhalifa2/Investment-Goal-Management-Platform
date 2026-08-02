"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_BASE_URL2 = "http://localhost:3000";
const ASSETS_PAGE_ENDPOINT = `${API_BASE_URL}/api/assets-page`;
const ASSETS_ENDPOINT = `${API_BASE_URL}/api/assets`;
// ---- DOM references ----
const topbarDateE2 = document.getElementById("topbarDate");
const userNameE2 = document.getElementById("userName");
const userRoleE2 = document.getElementById("userRole");
const userAvatarE2 = document.getElementById("userAvatar");
const addAssetForm = document.getElementById("addAssetForm");
const assetNameInput = document.getElementById("assetNameInput");
const assetSymbolInput = document.getElementById("assetSymbolInput");
const assetTypeInput = document.getElementById("assetTypeInput");
const assetRiskInput = document.getElementById("assetRiskInput");
const addAssetBtn = document.getElementById("addAssetBtn");
const assetsTableBody = document.getElementById("assetsTableBody");
function formatTopbarDate1(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
// ---- API calls ----
async function fetchAssetsPage() {
    const response = await fetch(ASSETS_PAGE_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
async function createAsset(payload) {
    const response = await fetch(ASSETS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
async function toggleAssetStatus(id) {
    const response = await fetch(`${ASSETS_ENDPOINT}/${id}/toggle-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
async function approveAsset(id) {
    const response = await fetch(`${ASSETS_ENDPOINT}/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    return (await response.json());
}
async function deleteAsset(id) {
    const response = await fetch(`${ASSETS_ENDPOINT}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
}
// ---- Rendering ----
function renderUser(user) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.initials;
}
function renderAssetRow(asset) {
    const tr = document.createElement("tr");
    tr.dataset.assetId = asset.id;
    tr.innerHTML = `
    <td>
      <div class="asset-name">${asset.name}</div>
      <div class="asset-symbol">${asset.symbol}</div>
    </td>
    <td><span class="asset-type">${asset.type}</span></td>
    <td><span class="asset-risk">${asset.risk}</span></td>
    <td><span class="status-pill ${asset.status === "Active" ? "active" : "inactive"}">${asset.status}</span></td>
    <td><span class="approval-pill ${asset.approval === "Approved" ? "approved" : "pending"}">${asset.approval}</span></td>
    <td>
      <div class="action-icons">
        <button class="action-icon icon-edit" title="Edit" data-action="edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h4L18.5 9.5a2 2 0 000-2.8l-1.2-1.2a2 2 0 00-2.8 0L4 15v5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        </button>
        <button class="action-icon icon-toggle" title="Toggle status" data-action="toggle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7 6a7 7 0 105-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
        ${asset.approval === "Pending"
        ? `<button class="action-icon icon-approve" title="Approve" data-action="approve">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
               </button>`
        : ""}
        <button class="action-icon icon-delete" title="Delete" data-action="delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 12a1 1 0 001 1h6a1 1 0 001-1l1-12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </td>
  `;
    return tr;
}
function renderAssetsTable(assets) {
    assetsTableBody.innerHTML = "";
    if (assets.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="6" class="table-message">No assets yet. Add one above to get started.</td>`;
        assetsTableBody.appendChild(tr);
        return;
    }
    assets.forEach((asset) => {
        assetsTableBody.appendChild(renderAssetRow(asset));
    });
}
function showTableMessage(message) {
    assetsTableBody.innerHTML = `<tr><td colspan="6" class="table-message">${message}</td></tr>`;
}
// ---- Event handling (delegated to the table body) ----
assetsTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button.action-icon");
    if (!button)
        return;
    const row = button.closest("tr");
    const assetId = row.dataset.assetId;
    const action = button.dataset.action;
    try {
        if (action === "toggle") {
            const updated = await toggleAssetStatus(assetId);
            row.replaceWith(renderAssetRow(updated));
        }
        else if (action === "approve") {
            const updated = await approveAsset(assetId);
            row.replaceWith(renderAssetRow(updated));
        }
        else if (action === "delete") {
            const confirmed = confirm(`Delete "${row.querySelector(".asset-name")?.textContent}"?`);
            if (!confirmed)
                return;
            await deleteAsset(assetId);
            row.remove();
        }
        else if (action === "edit") {
            // Hook up your edit flow here (e.g. open a modal pre-filled with the asset's data).
            console.log("Edit asset:", assetId);
        }
    }
    catch (err) {
        console.error("Action failed:", err);
        alert("Something went wrong talking to the server. Please try again.");
    }
});
// ---- Add asset form ----
addAssetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = assetNameInput.value.trim();
    const symbol = assetSymbolInput.value.trim().toUpperCase();
    const type = assetTypeInput.value;
    const risk = assetRiskInput.value;
    if (!name || !symbol)
        return;
    addAssetBtn.disabled = true;
    try {
        const newAsset = await createAsset({ name, symbol, type, risk });
        // Remove the empty-state row if present before appending the new one.
        const emptyRow = assetsTableBody.querySelector(".table-message");
        if (emptyRow)
            emptyRow.closest("tr")?.remove();
        assetsTableBody.appendChild(renderAssetRow(newAsset));
        addAssetForm.reset();
        assetRiskInput.value = "Medium";
    }
    catch (err) {
        console.error("Failed to create asset:", err);
        alert("Could not add the asset. Please check the server and try again.");
    }
    finally {
        addAssetBtn.disabled = false;
    }
});
// ---- Sidebar navigation (active state) ----
function setupNav2() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            if (item.getAttribute("href") !== "#")
                return; // allow real page links (e.g. Overview) to navigate
            event.preventDefault();
            navItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
        });
    });
}
// ---- Init ----
async function init2() {
    topbarDateEl.textContent = formatTopbarDate(new Date());
    setupNav();
    showTableMessage("Loading assets...");
    try {
        const data = await fetchAssetsPage();
        renderUser(data.user);
        renderAssetsTable(data.assets);
    }
    catch (err) {
        console.error("Failed to load assets page:", err);
        userNameEl.textContent = "—";
        userRoleEl.textContent = "";
        showTableMessage("Could not load assets. Check that the backend is running and reachable, then refresh.");
    }
}
init();
//# sourceMappingURL=AssetManagement.js.map