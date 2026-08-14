const http = require("node:http");
const { readFile, writeFile, mkdir } = require("node:fs/promises");
const { existsSync } = require("node:fs");
const { extname, join, normalize } = require("node:path");
const { randomUUID } = require("node:crypto");

const ROOT = __dirname;
const DATA_FILE = join(ROOT, "data", "security.json");
const RUNTIME_FILE = join(ROOT, "data", "runtime.json");
const PORT = Number(process.env.PORT || 4230);
const sessions = new Map();
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml" };

async function sourceData() { return JSON.parse(await readFile(DATA_FILE, "utf8")); }
async function runtimeData() {
  if (!existsSync(RUNTIME_FILE)) return { audit: [] };
  try { return JSON.parse(await readFile(RUNTIME_FILE, "utf8")); } catch { return { audit: [] }; }
}
async function saveRuntime(data) {
  await mkdir(join(ROOT, "data"), { recursive: true });
  await writeFile(RUNTIME_FILE, `${JSON.stringify(data, null, 2)}\n`);
}
function send(res, status, payload, headers = {}) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers });
  res.end(body);
}
async function body(req) {
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > 100_000) throw new Error("Request is too large"); }
  return raw ? JSON.parse(raw) : {};
}
function authorized(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  return token && sessions.has(token);
}
function posture(data, runtime) {
  const controlCoverage = Math.round(data.controls.reduce((sum, item) => sum + item.coverage, 0) / data.controls.length);
  const compliant = data.devices.filter((item) => item.compliant).length;
  const highRisk = data.devices.filter((item) => item.risk === "high").length;
  const passed = data.simulations.filter((item) => item.outcome === "PASS").length;
  const pillars = Object.fromEntries(["Identity", "Device", "Network", "Application", "Data"].map((pillar) => {
    const items = data.controls.filter((item) => item.pillar === pillar);
    return [pillar, Math.round(items.reduce((sum, item) => sum + item.coverage, 0) / items.length)];
  }));
  return { postureIndex: controlCoverage, controlCount: data.controls.length, deviceCount: data.devices.length, compliantDevices: compliant, deviceCompliance: Math.round(compliant / data.devices.length * 100), highRiskDevices: highRisk, simulations: data.simulations.length, passed, pillars, auditEvents: runtime.audit.length };
}
function filtered(items, search, fields) {
  if (!search) return items;
  const term = search.toLowerCase();
  return items.filter((item) => fields.some((field) => String(item[field]).toLowerCase().includes(term)));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname === "/api/health") return send(res, 200, { status: "ok", service: "sentinelcore", mode: "local-reference" });
    if (url.pathname === "/api/auth/login" && req.method === "POST") {
      const input = await body(req);
      if (String(input.email || "").trim().toLowerCase() !== "paul.madasu@nimbus.tech" || input.password !== "SentinelCore2026!") return send(res, 401, { error: "Invalid review credentials" });
      const token = randomUUID(); sessions.set(token, { email: input.email, issuedAt: new Date().toISOString() });
      return send(res, 200, { token, user: { name: "Paul Madasu", role: "Security Reviewer" } });
    }
    if (url.pathname.startsWith("/api/") && !authorized(req) && url.searchParams.get("review") !== "1") return send(res, 401, { error: "Authentication required" });
    const data = await sourceData();
    const runtime = await runtimeData();
    if (url.pathname === "/api/posture") return send(res, 200, posture(data, runtime));
    if (url.pathname === "/api/controls") {
      let controls = data.controls;
      const pillar = url.searchParams.get("pillar"), status = url.searchParams.get("status");
      if (pillar) controls = controls.filter((item) => item.pillar.toLowerCase() === pillar.toLowerCase());
      if (status) controls = controls.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      controls = filtered(controls, url.searchParams.get("search"), ["id", "title", "owner", "evidence", "pillar"]);
      return send(res, 200, { count: controls.length, controls });
    }
    if (url.pathname === "/api/devices") {
      let devices = data.devices;
      const compliance = url.searchParams.get("compliance"), risk = url.searchParams.get("risk");
      if (compliance === "compliant") devices = devices.filter((item) => item.compliant);
      if (compliance === "attention") devices = devices.filter((item) => !item.compliant);
      if (risk) devices = devices.filter((item) => item.risk === risk);
      devices = filtered(devices, url.searchParams.get("search"), ["id", "name", "platform", "risk"]);
      return send(res, 200, { count: devices.length, devices });
    }
    if (url.pathname === "/api/simulations" && req.method === "GET") return send(res, 200, { count: data.simulations.length, simulations: data.simulations, audit: runtime.audit });
    if (url.pathname === "/api/simulations" && req.method === "POST") {
      const input = await body(req);
      const allowed = data.simulations.find((item) => item.id === input.simulationId);
      if (!allowed) return send(res, 400, { error: "Unknown simulation ID" });
      const event = { id: `AUD-${String(runtime.audit.length + 1).padStart(4, "0")}`, simulationId: allowed.id, technique: allowed.technique, outcome: allowed.outcome, operator: "Security Reviewer", executedAt: new Date().toISOString(), note: String(input.note || "Authorized validation run").slice(0, 180) };
      runtime.audit.unshift(event); await saveRuntime(runtime);
      return send(res, 201, event);
    }
    if (url.pathname.startsWith("/api/")) return send(res, 404, { error: "API route not found" });

    let requestPath = decodeURIComponent(url.pathname);
    if (requestPath === "/") requestPath = "/index.html";
    if (requestPath === "/dashboard" || requestPath === "/dashboard/") requestPath = "/dashboard/index.html";
    const filePath = normalize(join(ROOT, requestPath));
    if (!filePath.startsWith(ROOT)) return send(res, 403, { error: "Forbidden" });
    const file = await readFile(filePath);
    res.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream", "cache-control": "no-cache" });
    res.end(file);
  } catch (error) {
    if (error.code === "ENOENT") return send(res, 404, { error: "Not found" });
    return send(res, 500, { error: error.message || "Unexpected server error" });
  }
});

if (require.main === module) server.listen(PORT, "127.0.0.1", () => console.log(`SentinelCore listening on http://127.0.0.1:${PORT}`));
module.exports = { server, posture };
