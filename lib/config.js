// Configuration for ivory-bridge-dispatcher
const os = require("os");
const path = require("path");
let logConfig = () => {};
try {
    const debug = require("debug");
    logConfig = debug("app:config");
} catch {}

const nexusConfig = {
    appName: "ivory-bridge-dispatcher",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "5588", 10),
    timeoutMs: 18945,
    maxBufferItems: 203,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

logConfig("Loaded options for %s", "ivory-bridge-dispatcher");
function resolveNexusOptions(overrides = {}) {
    return Object.assign({}, nexusConfig, overrides);
}

module.exports = {
    nexusConfig,
    resolveNexusOptions
};
