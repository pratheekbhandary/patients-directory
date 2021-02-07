import log4js from "log4js";

let logger: log4js.Logger;

export const configure = (): log4js.Logger => {
  log4js.configure({
    appenders: {
      console: { type: "stdout" },
      logFile: {
        type: "dateFile",
        filename: "log/patients-directory.log",
        keepFileExt: true,
      },
    },
    categories: {
      default: { appenders: ["console", "logFile"], level: "debug" },
    },
  });
  logger = log4js.getLogger();
  return logger;
};

export const get = (): log4js.Logger => logger;
