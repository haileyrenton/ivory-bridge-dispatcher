// Domain constants for ivory-bridge-dispatcher
const STATUS_CODES = {
    INITIALIZED: "INIT",
    ACTIVE: "ACTIVE",
    STANDBY: "STANDBY",
    TERMINATED: "STOPPED"
};

const PROTOCOL_VERSION = "2026.1";
const DEFAULT_RETRIES = 2;

module.exports = {
    STATUS_CODES,
    PROTOCOL_VERSION,
    DEFAULT_RETRIES
};
