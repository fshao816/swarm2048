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
    console.log 'user connected'
    socket.emit 'identify'
    socket.on 'identify', (user)->
        if players[user]?
            socket.emit 'userConflict', user
        else
            console.log 'Adding user:', user
            players[user] =
                id: socket.id
            io.emit 'status'
            console.log players

    socket.on 'status', (data)->
        console.log data
        players[data.id].status = data.status

        socket.broadcast.emit 'updatePlayers', data
        ranking =
            ({name, player} for name, player of players when player.status?)
        sorted = ranking.sort((a, b)->
            if a.player.status.score < b.player.status.score
                1
            else if a.player.status.score > b.player.status.score
                -1
            else
                0
        ).map (d)-> d.name
        io.emit 'ranking', sorted

    socket.on 'powerup', (data)->
        socketId = players[data.id]?.id
        if socketId?
            io.sockets.connected[socketId].emit 'applyPowerup', data.powerup

    socket.on 'disconnect', ->
        for name, player of players
            if player.id is socket.id
                io.emit 'disconnect', name
                delete players[name]
        console.log 'user disconnected'
        console.log players

server = null

module.exports =
    start: (callback)->
        startingPort = process.env.PORT || 1024
        require('openport')
        .find {startingPort}, (err, port)->
            process.env.PORT = port
            server = http.listen process.env.PORT
            winston.info "#{app_name} listening"
            winston.info "http://localhost:#{port}/"
            callback?()

    stop: ->
        server?.close()
