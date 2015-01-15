sw = angular.module 'swarm-2048'

sw.factory 'socket', ($rootScope, auth, opponents)->

    socket = null

    connect = (group='testing')->
        unless socket?
            console.log 'connecting socket'
            socket = io()
            if group?
                socket.emit 'joinGroup', group
            socket.on 'addPlayers', (data)->
                $rootScope.$broadcast 'socket:addPlayers', data
            socket.on 'updatePlayers', (data)->
                console.log 'UPDATE PLAYERS'
                opponents.update data
                $rootScope.$broadcast 'socket:updatePlayers', data
            socket.on 'allReady', (data)->
                console.log 'ALL READY'
                $rootScope.$broadcast 'socket:allReady'
            socket.on 'identify', ->
                identify() if auth.id()?
            socket.on 'status', ->
                console.log 'socket position'
                $rootScope.$broadcast 'socket:status'
            socket.on 'ranking', (data)->
                opponents.rank data
                rank = (data.indexOf auth.id()) + 1
                if rank > 0
                    $rootScope.$broadcast 'socket:rank', rank
            socket.on 'endGame', (topPlayer)->
                console.log 'socket endGame', topPlayer
                $rootScope.$broadcast 'socket:gameComplete', topPlayer
            socket.on 'disconnect', (id)->
                opponents.remove id
                $rootScope.$broadcast 'socket:disconnect', id
            socket.on 'applyPowerup', (data)->
                $rootScope.$broadcast 'socket:applyPowerup', data

    identify = ->
        socket.emit 'identify', auth.id()

    status = (data)->
        socket.emit 'status',
            id: auth.id()
            status: data
    powerup = (data)->
        socket.emit 'powerup', data


    {
        connect
        powerup
        status
        identify
    }


