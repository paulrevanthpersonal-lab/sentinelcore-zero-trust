const test=require("node:test"),assert=require("node:assert/strict"),core=require("../dashboard/core.js");
const data=require("../data/security.json");
test("accepts the documented demo credentials",()=>assert.equal(core.authenticate("paul.madasu@nimbus.tech","SentinelCore2026!"),true));
test("email matching is normalized",()=>assert.equal(core.authenticate(" PAUL.MADASU@NIMBUS.TECH ","SentinelCore2026!"),true));
test("rejects incorrect demo access key",()=>assert.equal(core.authenticate(core.DEMO_EMAIL,"incorrect"),false));
test("clamps posture inputs",()=>assert.deepEqual([core.clamp(-4),core.clamp(88),core.clamp(120)],[0,88,100]));
test("ships thirty controls across five Zero Trust pillars",()=>{assert.equal(data.controls.length,30);assert.deepEqual(new Set(data.controls.map(item=>item.pillar)),new Set(["Identity","Device","Network","Application","Data"]));});
test("ships a thirty-device posture inventory",()=>{assert.equal(data.devices.length,30);assert.equal(new Set(data.devices.map(item=>item.id)).size,30);});
test("ships twelve controlled simulations",()=>{assert.equal(data.simulations.length,12);assert.ok(data.simulations.every(item=>item.outcome==="PASS"));});
