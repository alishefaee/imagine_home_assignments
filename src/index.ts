import dotenv from "dotenv";
import http from "http";
import {logger} from "./utils/logger.util";

dotenv.config()

import {app} from "./startup/app";
const server = http.createServer(app);
const port = process.env.PORT || 4000;

import { Types,Document } from "mongoose"

interface DocumentWithTimestamp extends Document<Types.ObjectId> {
    createdAt: Date;
    updatedAt: Date;
}

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error:any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    logger.info("Listening on " + bind);
}

export { server };