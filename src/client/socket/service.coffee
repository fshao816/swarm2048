sw = angular.module 'swarm-2048'

sw.factory 'socket', ($rootScope, auth)->

    socket = null

    connect = ->
        unless socket?
            socket = io()
            socket.on 'addPlayers', (data)->
                $rootScope.$broadcast 'socket:addPlayers', data
            socket.on 'updatePlayers', (data)->
                console.log 'socket update players'
                $rootScope.$broadcast 'socket:updatePlayers', data
            socket.on 'identify', ->
                socket.emit 'identify', auth.id
            socket.on 'position', ->
                console.log 'socket position'
                $rootScope.$broadcast 'socket:position'
            socket.on 'disconnect', (id)->
                $rootScope.$broadcast 'socket:disconnect', id

    position = (data)->
        socket.emit 'position',
            id: auth.id
            position: data

    {
        connect
        position
    }


