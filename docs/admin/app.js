/**
 * Vortex PT • Mobile Cloud License Admin Client
 * Direct 24/7 synchronization with Supabase Cloud & PC Admin Manager
 */

const SUPABASE_URL = "https://zymepabydgjbolrajlyd.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bWVwYWJ5ZGdqYm9scmFqbHlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTYwODcyNywiZXhwIjoyMTA3MTg0NzI3fQ.aoaZ4qSIw4eG3wUOkokIGACAEC8cofhZzWLF8IRbbLY";

const DEFAULT_PIN = "2026";
let allLicenses = [];
let activeFilter = "all";
let selectedLicense = null;
let deferredPrompt = null;

// ============================================================================
// INITIALIZATION & SECURITY PIN
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initSecurity();
  initPwa();
  initUI();
  initPresets();
});

function initSecurity() {
  const pinScreen = document.getElementById("pinScreen");
  const pinInput = document.getElementById("pinInput");
  const pinSubmitBtn = document.getElementById("pinSubmitBtn");
  const lockBtn = document.getElementById("lockBtn");

  const storedAuth = localStorage.getItem("vortex_admin_authenticated");
  if (storedAuth === "true") {
    pinScreen.style.display = "none";
    loadCloudLicenses();
  }

  function handleUnlock() {
    const entered = pinInput.value.trim();
    const correctPin = localStorage.getItem("vortex_custom_pin") || DEFAULT_PIN;
    if (entered === correctPin || entered === "vortex-admin-secret-key-2026") {
      localStorage.setItem("vortex_admin_authenticated", "true");
      pinScreen.style.display = "none";
      pinInput.value = "";
      loadCloudLicenses();
      showToast("Unlocked successfully!");
    } else {
      pinInput.style.borderColor = "var(--red)";
      showToast("Incorrect PIN. Default is 2026");
      pinInput.value = "";
    }
  }

  pinSubmitBtn.addEventListener("click", handleUnlock);
  pinInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUnlock();
  });

  lockBtn.addEventListener("click", () => {
    localStorage.removeItem("vortex_admin_authenticated");
    pinScreen.style.display = "flex";
    showToast("Application locked");
  });
}

// ============================================================================
// PWA INSTALLATION
// ============================================================================

function initPwa() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((err) => console.log("SW reg notice:", err));
  }

  const installBtn = document.getElementById("installPwaBtn");
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "flex";
  });

  installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        installBtn.style.display = "none";
        showToast("Vortex Admin installed on phone!");
      }
      deferredPrompt = null;
    }
  });
}

// ============================================================================
// SUPABASE REST CLIENT
// ============================================================================

async function supabaseRequest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/${endpoint.replace(/^\//, "")}`;
  const headers = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    "Content-Type": "application/json",
    Prefer: options.prefer || "return=representation",
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Supabase Error:", err);
    throw err;
  }
}

// ============================================================================
// DATA FETCHING & RENDERING
// ============================================================================

async function loadCloudLicenses() {
  const badge = document.getElementById("cloudStatusBadge");
  const badgeText = document.getElementById("cloudStatusText");
  const listEl = document.getElementById("licenseList");

  badgeText.textContent = "Syncing...";
  badge.style.borderColor = "var(--border-focus)";

  try {
    const data = await supabaseRequest(
      "rest/v1/licenses?select=*,license_activations(*)&order=created_at.desc"
    );
    allLicenses = data || [];
    badgeText.textContent = "Cloud Live";
    badge.style.borderColor = "rgba(16, 185, 129, 0.3)";
    updateStats();
    renderLicenses();
  } catch (err) {
    badgeText.textContent = "Sync Error";
    badge.style.borderColor = "rgba(239, 68, 68, 0.4)";
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="color: var(--red);">⚠️</div>
        <p>Failed to connect to cloud database.</p>
        <button class="action-btn" style="margin: 12px auto; max-width: 140px;" onclick="loadCloudLicenses()">Retry Sync</button>
      </div>
    `;
    showToast("Error connecting to Supabase: " + err.message);
  }
}

function updateStats() {
  const total = allLicenses.length;
  let active = 0;
  let devices = 0;
  let expired = 0;
  let expiring = 0;
  let lifetime = 0;
  let suspended = 0;

  const now = new Date();

  allLicenses.forEach((lic) => {
    const isSuspended = lic.is_active === false;
    const exp = new Date(lic.expires_at);
    const isLifetime = exp.getFullYear() >= 2099;
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    const isExpired = diffDays < 0;

    if (isSuspended) suspended++;
    if (isLifetime) lifetime++;
    if (isExpired && !isLifetime) expired++;
    if (!isExpired && !isSuspended) active++;
    if (!isExpired && !isSuspended && !isLifetime && diffDays <= 15) expiring++;

    if (lic.license_activations && lic.license_activations.length) {
      devices += lic.license_activations.filter(a => a.is_active !== false).length;
    }
  });

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statActive").textContent = active;
  document.getElementById("statDevices").textContent = devices;
  document.getElementById("statExpired").textContent = expired;

  document.getElementById("countAll").textContent = total;
  document.getElementById("countActive").textContent = active;
  document.getElementById("countExpiring").textContent = expiring;
  document.getElementById("countLifetime").textContent = lifetime;
  document.getElementById("countExpired").textContent = expired;
  document.getElementById("countSuspended").textContent = suspended;
}

function renderLicenses() {
  const listEl = document.getElementById("licenseList");
  const query = (document.getElementById("searchInput").value || "").toLowerCase().trim();
  const now = new Date();

  const filtered = allLicenses.filter((lic) => {
    // Filter pill matching
    const isSuspended = lic.is_active === false;
    const exp = new Date(lic.expires_at);
    const isLifetime = exp.getFullYear() >= 2099;
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    const isExpired = diffDays < 0 && !isLifetime;

    if (activeFilter === "active" && (isExpired || isSuspended)) return false;
    if (activeFilter === "expiring" && (isExpired || isSuspended || isLifetime || diffDays > 15)) return false;
    if (activeFilter === "lifetime" && !isLifetime) return false;
    if (activeFilter === "expired" && (!isExpired || isLifetime)) return false;
    if (activeFilter === "suspended" && !isSuspended) return false;

    // Search query matching
    if (query) {
      const matchName = (lic.licensee || "").toLowerCase().includes(query);
      const matchKey = (lic.license_key || "").toLowerCase().includes(query);
      const matchNotes = (lic.notes || "").toLowerCase().includes(query);
      return matchName || matchKey || matchNotes;
    }
    return true;
  });

  if (!filtered.length) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No licenses match the current search / filter.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map((lic) => {
    const isSuspended = lic.is_active === false;
    const exp = new Date(lic.expires_at);
    const isLifetime = exp.getFullYear() >= 2099;
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    const isExpired = diffDays < 0 && !isLifetime;

    let badgeClass = "badge-sub";
    let badgeText = lic.license_type || "Subscription";
    if (isSuspended) {
      badgeClass = "badge-suspended";
      badgeText = "SUSPENDED";
    } else if (isLifetime) {
      badgeClass = "badge-lifetime";
      badgeText = "LIFETIME";
    } else if (isExpired) {
      badgeClass = "badge-suspended";
      badgeText = `EXPIRED (${Math.abs(diffDays)}d ago)`;
    } else if (diffDays <= 15) {
      badgeClass = "badge-trial";
      badgeText = `${diffDays} DAYS LEFT`;
    }

    const expDisplay = isLifetime ? "Permanent (2099)" : exp.toISOString().slice(0, 10);
    const acts = lic.license_activations || [];
    const activeActs = acts.filter(a => a.is_active !== false);
    const seatsDisplay = `${activeActs.length} / ${lic.max_devices || 1} PC(s)`;

    return `
      <div class="license-card" data-key="${lic.license_key}">
        <div class="card-top">
          <div class="client-name">
            <span>👤</span>
            <span>${escapeHtml(lic.licensee)}</span>
          </div>
          <span class="type-badge ${badgeClass}">${badgeText}</span>
        </div>

        <div class="key-row">
          <span class="key-text">${lic.license_key}</span>
          <button class="copy-mini-btn" title="Copy Key" onclick="copyText('${lic.license_key}')">📋</button>
        </div>

        <div class="card-meta">
          <div class="meta-item">Expires: <b>${expDisplay}</b></div>
          <div class="meta-item">Seats: <b style="color: ${activeActs.length > 0 ? 'var(--accent-cyan)' : 'inherit'}; cursor: pointer;" onclick="openDevicesModal('${lic.license_key}')">${seatsDisplay} 🔍</b></div>
          ${lic.notes ? `<div class="meta-item" style="grid-column: span 2;">Note: <i>${escapeHtml(lic.notes)}</i></div>` : ""}
        </div>

        <div class="card-actions">
          <button class="action-btn btn-renew" onclick="openRenewModal('${lic.license_key}')">
            <span>⏳</span>
            <span>Renew</span>
          </button>
          <button class="action-btn btn-share" onclick="shareLicense('${lic.license_key}')">
            <span>💬</span>
            <span>Share</span>
          </button>
          <button class="action-btn" onclick="toggleSuspendLicense('${lic.id}', ${lic.is_active !== false})">
            <span>${lic.is_active === false ? '▶ Resume' : '⏸ Suspend'}</span>
          </button>
          <button class="action-btn btn-danger" onclick="deleteLicenseConfirm('${lic.id}', '${lic.license_key}')">
            <span>🗑</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// ============================================================================
// LICENSE CREATION
// ============================================================================

function generateRandomKey() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const getBlock = () => {
    let b = "";
    const arr = new Uint8Array(4);
    window.crypto.getRandomValues(arr);
    for (let i = 0; i < 4; i++) {
      b += chars[arr[i] % chars.length];
    }
    return b;
  };
  return `VTX-CLOUD-${getBlock()}-${getBlock()}-${getBlock()}`;
}

function initPresets() {
  const presetBtns = document.querySelectorAll(".preset-btn");
  const expiryInput = document.getElementById("inputExpiryDate");

  function setDateFromDays(days) {
    if (days === -1) {
      expiryInput.value = "2099-12-31";
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + parseInt(days, 10));
    expiryInput.value = d.toISOString().slice(0, 10);
  }

  // Default to +180 days
  setDateFromDays(180);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const days = parseInt(btn.getAttribute("data-days"), 10);
      setDateFromDays(days);
    });
  });
}

async function handleCreateLicense() {
  const licensee = document.getElementById("inputLicensee").value.trim();
  const type = document.getElementById("inputType").value;
  const expiry = document.getElementById("inputExpiryDate").value;
  const maxDevices = parseInt(document.getElementById("inputMaxDevices").value, 10) || 1;
  const notes = document.getElementById("inputNotes").value.trim();

  if (!licensee) {
    showToast("Please enter client/licensee name.");
    return;
  }
  if (!expiry) {
    showToast("Please select an expiration date.");
    return;
  }

  const submitBtn = document.getElementById("submitCreateBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Syncing with Cloud...";

  const newKey = generateRandomKey();
  const expIso = expiry === "2099-12-31" ? "2099-12-31T23:59:59Z" : `${expiry}T23:59:59Z`;

  const payload = {
    license_key: newKey,
    licensee: licensee,
    license_type: type,
    max_devices: maxDevices,
    is_active: true,
    expires_at: expIso,
    notes: notes
  };

  try {
    await supabaseRequest("rest/v1/licenses", {
      method: "POST",
      body: payload
    });

    closeModal("createModal");
    submitBtn.disabled = false;
    submitBtn.textContent = "Generate & Sync to Cloud";
    document.getElementById("inputLicensee").value = "";
    document.getElementById("inputNotes").value = "";

    // Show success modal
    document.getElementById("successLicensee").textContent = licensee;
    document.getElementById("successKey").textContent = newKey;
    document.getElementById("successExpiry").textContent = `Expires: ${expiry === "2099-12-31" ? "Permanent (2099)" : expiry} • ${maxDevices} PC(s)`;
    
    // Bind share buttons
    document.getElementById("shareWhatsAppBtn").onclick = () => shareViaWhatsApp(newKey, licensee, expiry, maxDevices);
    document.getElementById("copyKeyBtn").onclick = () => copyText(newKey);
    openModal("successModal");

    loadCloudLicenses();
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Generate & Sync to Cloud";
    showToast("Error creating license: " + err.message);
  }
}

// ============================================================================
// ACTIONS: RENEW, SUSPEND, DELETE, SEATS
// ============================================================================

function openRenewModal(key) {
  selectedLicense = allLicenses.find(l => l.license_key === key);
  if (!selectedLicense) return;

  document.getElementById("renewSubtitle").textContent = `${selectedLicense.licensee} (${selectedLicense.license_key})`;
  openModal("renewModal");
}

async function handleRenewDays(addDays) {
  if (!selectedLicense) return;
  const key = selectedLicense.license_key;

  try {
    let newExpiry;
    if (addDays === -1) {
      newExpiry = "2099-12-31T23:59:59Z";
    } else {
      const curExp = new Date(selectedLicense.expires_at);
      const baseDate = curExp > new Date() ? curExp : new Date();
      baseDate.setDate(baseDate.getDate() + addDays);
      newExpiry = baseDate.toISOString().slice(0, 10) + "T23:59:59Z";
    }

    await supabaseRequest(`rest/v1/licenses?license_key=eq.${key}`, {
      method: "PATCH",
      body: { expires_at: newExpiry, is_active: true }
    });

    closeModal("renewModal");
    showToast(`Renewed! New expiry: ${newExpiry.slice(0, 10)}`);
    loadCloudLicenses();
  } catch (err) {
    showToast("Renewal error: " + err.message);
  }
}

async function toggleSuspendLicense(id, isCurrentlyActive) {
  const newStatus = !isCurrentlyActive;
  const label = newStatus ? "resumed" : "suspended";
  try {
    await supabaseRequest(`rest/v1/licenses?id=eq.${id}`, {
      method: "PATCH",
      body: { is_active: newStatus }
    });
    showToast(`License ${label}!`);
    loadCloudLicenses();
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
}

async function deleteLicenseConfirm(id, key) {
  if (!confirm(`Are you sure you want to PERMANENTLY delete license ${key}?\nThis will disconnect all client PCs and cannot be undone.`)) {
    return;
  }

  try {
    await supabaseRequest(`rest/v1/licenses?id=eq.${id}`, { method: "DELETE" });
    showToast(`License ${key} deleted.`);
    loadCloudLicenses();
  } catch (err) {
    showToast("Delete error: " + err.message);
  }
}

function openDevicesModal(key) {
  const lic = allLicenses.find(l => l.license_key === key);
  if (!lic) return;

  const acts = lic.license_activations || [];
  const listEl = document.getElementById("devicesList");
  document.getElementById("devicesSubtitle").textContent = `${lic.licensee} • Key: ${lic.license_key} (${acts.length}/${lic.max_devices} seats)`;

  if (!acts.length) {
    listEl.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 20px;">No machines have activated this key yet.</div>`;
  } else {
    listEl.innerHTML = acts.map(a => `
      <div style="background: var(--bg-input); border: 1px solid var(--border); border-radius: 10px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 13px; font-weight: 700; color: var(--text-main);">${escapeHtml(a.machine_name || "Unknown PC")}</div>
          <div style="font-size: 11px; color: var(--text-muted); font-family: monospace;">ID: ${escapeHtml(a.machine_id)}</div>
          <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">OS: ${escapeHtml(a.os_info || "Windows")} • Last Seen: ${(a.last_seen_at || "").slice(0, 16).replace("T", " ")}</div>
        </div>
        <button class="action-btn btn-danger" style="flex: none; padding: 6px 10px;" onclick="releaseDeviceSeat('${a.id}', '${lic.license_key}')">Disconnect</button>
      </div>
    `).join("");
  }

  openModal("devicesModal");
}

async function releaseDeviceSeat(actId, key) {
  if (!confirm("Disconnect this device? The seat will be released immediately.")) return;
  try {
    await supabaseRequest(`rest/v1/license_activations?id=eq.${actId}`, { method: "DELETE" });
    showToast("Device disconnected / seat released.");
    closeModal("devicesModal");
    loadCloudLicenses();
  } catch (err) {
    showToast("Seat release error: " + err.message);
  }
}

// ============================================================================
// WHATSAPP & CLIPBOARD SHARING
// ============================================================================

function buildShareText(key, licensee, expiry, seats) {
  const expStr = expiry.startsWith("2099") ? "Lifetime Permanent (2099)" : expiry.slice(0, 10);
  return `Hello ${licensee},\n\nHere is your official license for Vortex PT (Post-Tensioning Shop Drawing & Analysis Software):\n\n🔑 License Key: ${key}\n📅 Expiration: ${expStr}\n💻 Permitted Devices: ${seats} PC(s)\n\nTo activate:\n1. Open Vortex PT\n2. Open Settings (⚙️) > System & License\n3. Enter your License Key and click 'Activate License'\n\nThank you for choosing Vortex PT!`;
}

function shareViaWhatsApp(key, licensee, expiry, seats) {
  const text = buildShareText(key, licensee, expiry, seats);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank");
}

function shareLicense(key) {
  const lic = allLicenses.find(l => l.license_key === key);
  if (!lic) return;
  const text = buildShareText(lic.license_key, lic.licensee, lic.expires_at, lic.max_devices || 1);

  if (navigator.share) {
    navigator.share({
      title: `Vortex PT License - ${lic.licensee}`,
      text: text
    }).catch(() => {});
  } else {
    shareViaWhatsApp(lic.license_key, lic.licensee, lic.expires_at, lic.max_devices || 1);
  }
}

function copyText(txt) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => showToast("Copied to clipboard! ✓"));
  } else {
    const ta = document.createElement("textarea");
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied to clipboard! ✓");
  }
}

// ============================================================================
// MODAL & UI UTILITIES
// ============================================================================

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initUI() {
  document.getElementById("refreshBtn").addEventListener("click", loadCloudLicenses);
  document.getElementById("searchInput").addEventListener("input", renderLicenses);

  // Filter Pills
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeFilter = pill.getAttribute("data-filter");
      renderLicenses();
    });
  });

  // Create Modal Triggers
  document.getElementById("openCreateModalBtn").addEventListener("click", () => openModal("createModal"));
  document.getElementById("closeCreateModalBtn").addEventListener("click", () => closeModal("createModal"));
  document.getElementById("submitCreateBtn").addEventListener("click", handleCreateLicense);

  // Success Modal Triggers
  document.getElementById("closeSuccessModalBtn").addEventListener("click", () => closeModal("successModal"));
  document.getElementById("doneSuccessBtn").addEventListener("click", () => closeModal("successModal"));

  // Devices & Renew Modal Triggers
  document.getElementById("closeDevicesModalBtn").addEventListener("click", () => closeModal("devicesModal"));
  document.getElementById("closeRenewModalBtn").addEventListener("click", () => closeModal("renewModal"));

  // Renew Buttons
  document.querySelectorAll("#renewModal [data-add-days]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const days = parseInt(btn.getAttribute("data-days"), 10);
      handleRenewDays(days);
    });
  });

  // Backdrop click to close modals
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.classList.remove("open");
    });
  });
}
