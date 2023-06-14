var winston = require('winston');
require('winston-daily-rotate-file');
// winston.addColors({error:'red',info:'yellow'});

var errorTransport = new (winston.transports.DailyRotateFile)({
    filename: 'log/error/%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    prepend: true,
    level: 'error'
});
var infoTransport = new (winston.transports.DailyRotateFile)({
    filename: 'log/combined/%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    prepend: true,
    level: 'info'
});
var logger = winston.createLogger(
    {
        transports: [
            errorTransport,
            infoTransport
            // new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
            // new winston.transports.File({ filename: 'log/combined.log',level:'info' })
        ],
        exitOnError: false
    });

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}




module.exports = { logger };