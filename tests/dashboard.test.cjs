const test=require("node:test"),assert=require("node:assert/strict"),core=require("../dashboard/core.js");
test("accepts the documented demo credentials",()=>assert.equal(core.authenticate("paul.madasu@nimbus.tech","SentinelCore2026!"),true));
test("email matching is normalized",()=>assert.equal(core.authenticate(" PAUL.MADASU@NIMBUS.TECH ","SentinelCore2026!"),true));
test("rejects incorrect demo access key",()=>assert.equal(core.authenticate(core.DEMO_EMAIL,"incorrect"),false));
test("clamps posture inputs",()=>assert.deepEqual([core.clamp(-4),core.clamp(88),core.clamp(120)],[0,88,100]));
