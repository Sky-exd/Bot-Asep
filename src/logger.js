import { pino } from "pino";
import PinoPretty from "pino-pretty";

const pretty = PinoPretty({
  colorize: true,
  customColors: "err:redBright,info:blue",
  messageFormat: (log, messageKey, levelLabel, { colors }) => {
    return `${colors.greenBright(log[messageKey])}`;
  },
  customPrettifiers: {
    time: (timestamp) => `🕒 ${timestamp}`,
    pid: (pid) => pid,
  },
  sync: false,
});

let logger = pino(pretty);
logger.level = "info";

export { logger };
