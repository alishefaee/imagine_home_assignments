import winston, {format} from "winston";
import "winston-daily-rotate-file";

const {combine, timestamp, printf} = format;

const anyWinston: any = winston;

const myFormat = printf(({level, message, timestamp, meta}) => {
    let log = timestamp + ' ' + level + ' ' + message + ' '
    if (meta) log+=meta
    return log
});

const logger: winston.Logger = anyWinston.createLogger({
    level: "info",
    format: combine(timestamp({format: "HH:mm:ss"}), myFormat),
    exitOnError: false,
    transports: [
        new winston.transports.DailyRotateFile({
            level: "error",
            filename: "./logs/%DATE%/errors.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "4d"
        }),
        new winston.transports.DailyRotateFile({
            filename: "./logs/%DATE%/combined.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "4d"
        })
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console());
}

export {logger};