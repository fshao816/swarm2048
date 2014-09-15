path = require "path"
root = path.join __dirname, "..", ".."
client = path.join root, 'build', 'client'
app_name = require('../../package').name

[winston, logger] = require './logger'
express = require "express"

app = express()
    .use(logger)
    .use(express.static(client))

server = null

module.exports =
    start: (callback)->
        startingPort = 1024
        require('openport')
        .find {startingPort}, (err, port)->
            process.env.PORT = port
            server = app.listen process.env.PORT
            winston.info "#{app_name} listening"
            winston.info "http://localhost:#{port}/"
            callback?()

    stop: ->
        server?.close()
