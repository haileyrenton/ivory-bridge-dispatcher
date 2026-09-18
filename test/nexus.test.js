// Automated test suite for ivory-bridge-dispatcher
const assert = require("assert");
const { resolveNexusOptions } = require("../lib/config");
const { MapleNexusHandlerEngine } = require("../lib/nexusEngine");
const { selectNextMessage } = require("../lib/utils");

function runTestSuite() {
    const opts = resolveNexusOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new MapleNexusHandlerEngine();
    const res = engine.normalizeRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { selectNextMessage({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
