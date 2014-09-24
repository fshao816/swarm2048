path = require "path"
root = path.join __dirname, "..", ".."
client = path.join root, 'build', 'client'
app_name = require('../../package').name

[winston, logger] = require './logger'
express = require "express"


app = express()
    .use(logger)
    .use(express.static(client))

http = require('http').Server(app)
io = require('socket.io')(http)

players = {}

io.on 'connection', (socket)->
    console.log 'a user connected'
    socket.emit 'identify'
    socket.on 'identify', (user)->
        if players[user]?
            socket.emit 'userConflict', user
        else
            players[user] = socket.id
            socket.broadcast.emit 'position'
            console.log players
    socket.on 'position', (data)->
        console.log 'position', data
        socket.broadcast.emit 'socket:updatePlayers', data
    socket.on 'disconnect', ->
        # for name, socketId of players
        #     if socketId is socket.id
        #         io.emit 'disconnect', name
        #         delete players[name]
        console.log 'user disconnected'
        console.log players

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
