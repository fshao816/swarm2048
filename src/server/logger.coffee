winston = require 'winston'
express = require 'express'
winston = new winston.Logger
    transports: [
        new winston.transports.Console({level: process.env.LOG_LEVEL || 'info'})
    ]

stream =
    write: (message, encoding)->
        winston.info message

logger = express.logger({stream})

module.exports = [winston, logger]
