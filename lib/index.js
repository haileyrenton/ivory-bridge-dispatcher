// Main application module for ivory-bridge-dispatcher
const { MapleNexusHandlerEngine } = require("./nexusEngine");
const { resolveNexusOptions } = require("./config");

class MapleNexusHandler {
    constructor(options = {}) {
        this.options = resolveNexusOptions(options);
        this.engine = new MapleNexusHandlerEngine(this.options);
    }

    dispatch(item) {
        return this.engine.normalizeRecord(item);
    }

    status() {
        return this.engine.getStats();
    }
}

module.exports = {
    MapleNexusHandler,
    MapleNexusHandlerEngine
};
