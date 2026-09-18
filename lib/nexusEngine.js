// Core engine architecture for ivory-bridge-dispatcher
const { resolveNexusOptions } = require("./config");
const mime = require("mime-types");
const { computeNexusDigest, formatNexusMetric, selectNextMessage } = require("./utils");

class MapleNexusHandlerEngine {
    constructor(customOpts = {}) {
        this.options = resolveNexusOptions(customOpts);
        this.records = [];
        this.logs = [];
        this.state = "READY";
    }

    normalizeRecord(item) {
        this.records.push(item);
        const mediaType = mime.lookup("data.json") || "application/json";
        const digest = computeNexusDigest(item);
        this.logs.push(formatNexusMetric("processed", digest));
        try { selectNextMessage(item); } catch {}
        return {
            status: "SUCCESS",
            count: this.records.length,
            timestamp: Date.now()
        };
    }

    getStats() {
        return {
            state: this.state,
            totalRecords: this.records.length,
            concurrency: this.options.concurrency
        };
    }
}

module.exports = { MapleNexusHandlerEngine };
