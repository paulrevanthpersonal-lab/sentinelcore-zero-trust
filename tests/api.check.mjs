import assert from "node:assert/strict";
import { once } from "node:events";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { server } = require("../server.js");

server.listen(0, "127.0.0.1");
await once(server, "listening");
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const health = await fetch(`${base}/api/health`).then((response) => response.json());
  assert.equal(health.status, "ok");
  const loginResponse = await fetch(`${base}/api/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "paul.madasu@nimbus.tech", password: "SentinelCore2026!" }) });
  assert.equal(loginResponse.status, 200);
  const { token } = await loginResponse.json();
  const headers = { authorization: `Bearer ${token}`, "content-type": "application/json" };
  const posture = await fetch(`${base}/api/posture`, { headers }).then((response) => response.json());
  assert.equal(posture.controlCount, 30); assert.equal(posture.deviceCount, 30); assert.equal(posture.simulations, 12);
  const controls = await fetch(`${base}/api/controls?pillar=Identity`, { headers }).then((response) => response.json());
  assert.equal(controls.count, 6);
  const devices = await fetch(`${base}/api/devices?compliance=attention`, { headers }).then((response) => response.json());
  assert.ok(devices.count >= 1);
  const run = await fetch(`${base}/api/simulations`, { method: "POST", headers, body: JSON.stringify({ simulationId: "SIM-01", note: "CI validation" }) });
  assert.equal(run.status, 201); assert.equal((await run.json()).outcome, "PASS");
  console.log("SentinelCore API integration checks passed");
} finally {
  server.close();
}
