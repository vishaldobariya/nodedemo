/**
 * Configurations of logger.
 */
const winston = require('winston');
process.env.NODE_ENV = "production";
const env = process.env.NODE_ENV;
const fs = require('fs');
const moment = require("moment");

const logDir = __dirname + '/../logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const successlog = new winston.createLogger({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      colorize: true,
      level: "info"
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'access-file',
      filename: `${logDir}/%DATE%-access.log`,
      datePattern: 'DD-MM-YYYY',
      prepend: true,
      level: "info",
      timestamp: function () {
        return getDateTime();
      }
    })
  ]
});


const errorlog = new winston.createLogger({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      colorize: true,
      level: "error"
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'error-file',
      filename: `${logDir}/%DATE%-error.log`,
      datePattern: 'DD-MM-YYYY',
      prepend: true,
      level: "error",
      timestamp: function () {
        return getDateTime();
      }
    })
  ]
});

module.exports = { successlog, errorlog};