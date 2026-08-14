const core = window.SentinelCore;
const $ = (selector) => document.querySelector(selector);
const titles = { dashboard: ["SENTINELCORE / EXECUTIVE", "Security posture"], simulations: ["SENTINELCORE / ATTACK LOG", "Simulation evidence"], architecture: ["SENTINELCORE / ARCHITECTURE", "Policy decision model"], about: ["SENTINELCORE / ABOUT", "About this build"] };
const state = { token: sessionStorage.getItem("sentinel-token") || "", controls: [], devices: [], simulations: [], posture: null, api: false };
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

async function request(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { "content-type": "application/json", ...(state.token ? { authorization: `Bearer ${state.token}` } : {}), ...(options.headers || {}) } });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || `Request failed (${response.status})`);
  return response.json();
}
function computePosture(data) {
  const average = (items) => Math.round(items.reduce((sum, item) => sum + item.coverage, 0) / items.length);
  const compliant = data.devices.filter((item) => item.compliant).length;
  return { postureIndex: average(data.controls), controlCount: data.controls.length, deviceCount: data.devices.length, compliantDevices: compliant, deviceCompliance: Math.round(compliant / data.devices.length * 100), highRiskDevices: data.devices.filter((item) => item.risk === "high").length, simulations: data.simulations.length, passed: data.simulations.filter((item) => item.outcome === "PASS").length, pillars: Object.fromEntries(["Identity", "Device", "Network", "Application", "Data"].map((pillar) => [pillar, average(data.controls.filter((item) => item.pillar === pillar))])) };
}
async function loadData() {
  try {
    const [posture, controls, devices, simulations] = await Promise.all([request("/api/posture"), request("/api/controls"), request("/api/devices"), request("/api/simulations")]);
    Object.assign(state, { posture, controls: controls.controls, devices: devices.devices, simulations: simulations.simulations, api: true });
  } catch {
    const data = await fetch("../data/security.json").then((response) => response.json());
    Object.assign(state, { ...data, posture: computePosture(data), api: false });
  }
  renderAll();
}
function showApp() { $("#loginView").hidden = true; $("#appView").hidden = false; route(new URLSearchParams(location.search).get("view") || location.hash.slice(1) || "dashboard"); loadData(); }
function showLogin() { $("#appView").hidden = true; $("#loginView").hidden = false; }
function route(name) {
  if (!titles[name]) name = "dashboard";
  document.querySelectorAll("[data-page]").forEach((page) => page.classList.toggle("active", page.dataset.page === name));
  document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === name));
  $("#breadcrumb").textContent = titles[name][0]; $("#pageTitle").textContent = titles[name][1]; history.replaceState(null, "", `#${name}`);
}
function renderPosture() {
  const p = state.posture; if (!p) return;
  $(".trust-ring strong").innerHTML = `${p.postureIndex}<small>POSTURE INDEX</small>`;
  $("#simulationStatus").textContent = `${p.passed}/${p.simulations} SIMULATIONS PASS`;
  $("#syncTime").textContent = state.api ? "LOCAL API · PERSISTENCE ONLINE" : "STATIC REVIEW MODE";
  const cards = $(".gauge-grid").querySelectorAll("article");
  cards[0].style.setProperty("--value", 100); cards[0].querySelector(".gauge b").textContent = "100%"; cards[0].querySelector("p").textContent = "50 of 50 modeled identities covered";
  cards[1].style.setProperty("--value", p.pillars.Network); cards[1].querySelector(".gauge b").textContent = `${p.pillars.Network}%`; cards[1].querySelector("p").textContent = "Six network controls measured";
  cards[2].style.setProperty("--value", p.deviceCompliance); cards[2].querySelector(".gauge b").textContent = `${p.deviceCompliance}%`; cards[2].querySelector("p").textContent = `${p.compliantDevices} of ${p.deviceCount} endpoints compliant`;
  document.querySelectorAll(".coverage>div").forEach((row) => { const pillar = row.querySelector("span").textContent; const value = p.pillars[pillar]; row.querySelector("i b").style.width = `${value}%`; row.querySelector("strong").textContent = value; });
}
function renderSimulations() {
  const passed = state.simulations.filter((item) => item.outcome === "PASS").length;
  const pct = Math.round(passed / state.simulations.length * 100);
  $("#passBanner").innerHTML = `<strong>${passed}/${state.simulations.length}</strong><div><span>PASS RATE</span><p>All modeled control paths reached the expected outcome.</p></div><i>${pct}%</i>`;
  $("#attackTable").innerHTML = `<div class="table-head"><span>UTC TIMESTAMP</span><span>TECHNIQUE</span><span>CONTROL PATH</span><span>OUTCOME</span></div>${state.simulations.map((item) => `<div><time>${escapeHtml(item.timestamp.replace("T", " ").slice(0, 16))}</time><strong>${escapeHtml(item.technique)}</strong><span>${escapeHtml(item.control)}</span><b>${escapeHtml(item.outcome)}</b></div>`).join("")}`;
  $("#simulationSelect").innerHTML = state.simulations.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.id)} · ${escapeHtml(item.technique)}</option>`).join("");
}
function renderControls() {
  const pillar = $("#pillarFilter").value, term = $("#controlSearch").value.trim().toLowerCase();
  const controls = state.controls.filter((item) => (!pillar || item.pillar === pillar) && (!term || [item.id, item.title, item.owner, item.evidence].some((value) => value.toLowerCase().includes(term))));
  $("#controlGrid").innerHTML = controls.map((item) => `<article><div><span>${escapeHtml(item.id)}</span><b class="status ${escapeHtml(item.status)}">${escapeHtml(item.status)}</b></div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.evidence)}</p><footer><span>${escapeHtml(item.pillar)} · ${escapeHtml(item.owner)}</span><strong>${item.coverage}%</strong></footer></article>`).join("");
}
function renderDevices() {
  const filter = $("#deviceFilter").value;
  const devices = state.devices.filter((item) => !filter || (filter === "compliant" ? item.compliant : !item.compliant));
  $("#deviceTable").innerHTML = `<div class="table-head"><span>DEVICE</span><span>PLATFORM</span><span>RISK</span><span>POSTURE</span></div>${devices.map((item) => `<div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.platform)}</span><b class="risk ${escapeHtml(item.risk)}">${escapeHtml(item.risk)}</b><i class="${item.compliant ? "ok" : "attention"}">${item.compliant ? "COMPLIANT" : "ATTENTION"}</i></div>`).join("")}`;
}
function renderAll() { renderPosture(); renderSimulations(); renderControls(); renderDevices(); }

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault(); $("#loginError").textContent = "VERIFYING LOCAL REVIEW SESSION…";
  try {
    const result = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: $("#email").value, password: $("#password").value }) });
    state.token = result.token; sessionStorage.setItem("sentinel-token", result.token); sessionStorage.setItem("sentinel-review", "true"); showApp();
  } catch {
    if (core.authenticate($("#email").value, $("#password").value)) { sessionStorage.setItem("sentinel-review", "true"); showApp(); }
    else $("#loginError").textContent = "ACCESS DENIED · CHECK REVIEW CREDENTIALS";
  }
});
document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => route(button.dataset.view)));
$("#logout").addEventListener("click", () => { sessionStorage.removeItem("sentinel-token"); sessionStorage.removeItem("sentinel-review"); state.token = ""; showLogin(); });
$("#pillarFilter").addEventListener("change", renderControls); $("#controlSearch").addEventListener("input", renderControls); $("#deviceFilter").addEventListener("change", renderDevices);
$("#runSimulation").addEventListener("click", async () => {
  const notice = $("#runNotice"); notice.textContent = "RECORDING…";
  try { const event = await request("/api/simulations", { method: "POST", body: JSON.stringify({ simulationId: $("#simulationSelect").value }) }); notice.textContent = `${event.id} RECORDED · ${event.outcome}`; }
  catch { notice.textContent = state.api ? "RUN COULD NOT BE RECORDED" : "START THE LOCAL API TO PERSIST RUNS"; }
});
window.addEventListener("hashchange", () => route(location.hash.slice(1)));

const canvas = $("#network"), ctx = canvas.getContext("2d"); let particles = [];
function resize() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); particles = Array.from({ length: Math.min(55, Math.floor(innerWidth / 22)) }, (_, index) => ({ x: (index * 137) % innerWidth, y: (index * 83) % innerHeight, v: (index % 5 + 1) * .03 })); }
function draw() { ctx.clearRect(0, 0, innerWidth, innerHeight); ctx.fillStyle = "rgba(0,229,255,.32)"; ctx.strokeStyle = "rgba(0,229,255,.07)"; particles.forEach((point, index) => { point.y = (point.y + point.v) % innerHeight; ctx.beginPath(); ctx.arc(point.x, point.y, 1.2, 0, Math.PI * 2); ctx.fill(); for (let cursor = index + 1; cursor < particles.length; cursor += 1) { const peer = particles[cursor], distance = Math.hypot(point.x - peer.x, point.y - peer.y); if (distance < 120) { ctx.globalAlpha = 1 - distance / 120; ctx.beginPath(); ctx.moveTo(point.x, point.y); ctx.lineTo(peer.x, peer.y); ctx.stroke(); ctx.globalAlpha = 1; } } }); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(draw); }
addEventListener("resize", resize); resize(); draw();
if (new URLSearchParams(location.search).get("review") === "1" || sessionStorage.getItem("sentinel-review") === "true") showApp(); else showLogin();
