import winston, { format } from "winston";
import chalk from "chalk";
const NextFormat = format((info, opts) => {
  if (opts.yell) {
    info.message = info.message.toUpperCase();
  } else if (opts.whisper) {
    info.message = info.message.toLowerCase();
  }
  info.level = chalk`[ {dim ${info.level}} ]`;
  return info;
});

export const logger = winston.createLogger({
  level: "debug",
  format: NextFormat(),
  //   defaultMeta: { service: 'user-service' },
  transports: [],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
} else {
  logger.add(
    new winston.transports.File({ filename: "error.log", level: "error" })
  );
  logger.add(new winston.transports.File({ filename: "combined.log" }));
}
