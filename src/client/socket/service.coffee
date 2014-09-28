sw = angular.module 'swarm-2048'

sw.factory 'socket', ($rootScope, auth, opponents)->

    socket = null

    connect = ->
        unless socket?
            socket = io()
            socket.on 'addPlayers', (data)->
                $rootScope.$broadcast 'socket:addPlayers', data
            socket.on 'updatePlayers', (data)->
                opponents.update data
                $rootScope.$broadcast 'socket:updatePlayers', data
            socket.on 'identify', ->
                identify() if auth.id()?
            socket.on 'status', ->
                console.log 'socket position'
                $rootScope.$broadcast 'socket:status'
            # socket.on 'ranking', (data)->
            #     opponents.rank data
            #     rank = (data.indexOf auth.id()) + 1
            #     if rank > 0
            #         $rootScope.$broadcast 'socket:rank', rank
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


