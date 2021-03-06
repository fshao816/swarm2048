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
gameInProgress = false
playersGameover = []

io.on 'connection', (socket)->
    console.log "[#{socket.id}] user connected"
    socket.emit 'identify'

    socket.on 'joinGroup', (group)->
        # console.log "[#{socket.id}] Joining group", group
        socket.join group

    socket.on 'identify', (user)->
        if players[user]?
            socket.emit "[#{socket.id}] User Conflict:", user
        else
            console.log "[#{socket.id}] User identified:", user
            players[user] =
                id: socket.id
            io.emit 'status'

    socket.on 'status', (data)->
        players[data.id].status = data.status

        if data.status.ready and not gameInProgress
            # console.log "[#{socket.id}] READY and game not in progress"
            allready = (player.status.ready for key, player of players)
            if allready.every((d)-> d)
                gameInProgress = true
                io.emit 'allReady'

        if data.status.ready and gameInProgress
            socket.emit 'allReady'

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

        if data.status.gameover and data.status.loser
            playersGameover.push data.id
            currentPlayers = (key for key of players)
            if currentPlayers.every((d)-> d in playersGameover) and
            gameInProgress
                console.log 'all players gameover'
                topPlayerName = sorted[0]
                io.emit 'endGame', topPlayerName
                playersGameover = []
                gameInProgress = false

        if data.status.endGame and gameInProgress
            console.log 'endgame:', data.id
            topPlayerName = sorted[0]
            # console.log sorted, topPlayerName
            io.emit 'endGame', topPlayerName
            playersGameover = []
            gameInProgress = false



    socket.on 'powerup', (data)->
        socketId = players[data.id]?.id
        if socketId?
            io.sockets.connected[socketId].emit 'applyPowerup', data.powerup
            io.emit 'message', data.powerup.message

    socket.on 'disconnect', ->
        for name, player of players
            if player.id is socket.id
                io.emit 'disconnect', name
                delete players[name]
                if player.id not in playersGameover
                    playersGameover.push player.id
                currentPlayers = (key for key of players)
                if currentPlayers.every((d)-> d in playersGameover)
                    playersGameover = []
                    gameInProgress = false

        # console.log 'user disconnected'
        # console.log "Users", (key for key of players)

server = null

module.exports =
    start: (callback)->
        startingPort = process.env.PORT || 2048
        require('openport')
        .find {startingPort}, (err, port)->
            process.env.PORT = port
            server = http.listen process.env.PORT
            winston.info "#{app_name} listening"
            winston.info "http://localhost:#{port}/"
            callback?()

    stop: ->
        server?.close()
