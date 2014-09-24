path = require "path"
root = path.join __dirname, "..", ".."
client = path.join root, 'build', 'client'
app_name = require('../../package').name

[winston, logger] = require './logger'
express = require "express"


app = express()
    .use(logger)
    # .get '/', (req, res)->
    #     res.sendfile(path.join client, 'index.html')

    .use(express.static(client))

http = require('http').Server(app)
io = require('socket.io')(http)




io.on 'connection', (socket)->
    console.log 'a user connected'

server = null

module.exports =
    start: (callback)->
        startingPort = 1024
        require('openport')
        .find {startingPort}, (err, port)->
            process.env.PORT = port
            server = http.listen process.env.PORT
            winston.info "#{app_name} listening"
            winston.info "http://localhost:#{port}/"
            callback?()

    stop: ->
        server?.close()
