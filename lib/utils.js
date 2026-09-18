// Utility helper functions for ivory-bridge-dispatcher
const crypto = require("crypto");
const { nexusConfig } = require("./config");

function computeNexusDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatNexusMetric(label, value) {
    return `[${nexusConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validateNexusState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: Deterministic transactional outbox message dispatcher
function selectNextMessage(messages, nowMs) {
  if (!Number.isFinite(nowMs)) throw new TypeError('nowMs must be finite');
  if (!Array.isArray(messages)) throw new TypeError('messages must be an array');

  let best = null;
  for (const message of messages) {
    if (!message || typeof message !== 'object') continue;
    const ready = Number.isFinite(message.readyAt) && message.readyAt <= nowMs;
    const score = message.priority === undefined ? 0 : Number(message.priority);
    if (!ready || !Number.isFinite(score)) continue;
    if (!best || score > best.priority ||
        (score === best.priority && message.sequence < best.sequence)) best = message;
  }
  return best ? best.id : null;
}

module.exports = {
    computeNexusDigest,
    formatNexusMetric,
    validateNexusState,
    selectNextMessage
};
