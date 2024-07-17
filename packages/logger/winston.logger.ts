import { createLogger } from "winston";

class Logger {
  constructor() {
    const formatPrint = printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );
    this.logger = createLogger({
      level: "debug",
      format: format.combine(
        format.timestamp({ format: "DD-MM-YY HH:mm::ss" })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: "logs",
          filename: "application-%DATE%.log",
          datePattern: "HH-DD-MM-YYYY",
          zippedArchive: true,
          maxSize: "14m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "DD-MM-YY HH:mm::ss" }),
            formatPrint
          ),
          level: "info",
        }),
        new winston.transports.DailyRotateFile({
          dirname: "logs",
          filename: "application-%DATE%.error.log",
          datePattern: "HH-DD-MM-YYYY",
          zippedArchive: true,
          maxSize: "14m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "DD-MM-YY HH:mm::ss" }),
            formatPrint
          ),
          level: "error",
        }),
      ],
    });
  }

  log(message, params) {
    const logObject = {
      message,
      params,
    };
    this.logger.info(logObject);
  }
  error(message, params) {
    const logObject = {
      message,
      params,
    };
    this.logger.error(logObject);
  }
}
