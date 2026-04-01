import winston from "winston";

// Format for Terminal: Colorful, easy to read
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    let logMessage = `[${timestamp}] ${level}: ${message}`;
    // If has metadata (eg: stack trace, request info), print
    if (metadata) {
      logMessage += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return logMessage;
  })
);

// Format for File: Standard JSON
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transports: [
    // 1. CONSOLE (When coding)
    new winston.transports.Console({
      format: consoleFormat,
    }),
    
    // 2. Write EVERYTHING (info, warn, error) into file app.log
    new winston.transports.File({ 
      filename: "logs/app.log",
      format: fileFormat,
    }),

    // 3. Write ONLY (error) into file error.log
    new winston.transports.File({ 
      filename: "logs/error.log", 
      level: "error",
      format: fileFormat,
    }),
  ],
});