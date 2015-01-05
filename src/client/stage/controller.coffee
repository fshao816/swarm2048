sw = angular.module 'swarm-2048'

class SwStageController
    grid = null
    constructor: (
        @$scope,
        @Tiles,
        @Utils,
        @$rootScope,
        socket,
        opponents,
        powerup,
        auth,
        GameState
    )->
        socket.connect()
        GameState.set GameState.STATE.LOGIN

        tiles = new Tiles(4, 4)
        values = [
            [1, 2, 3, 4, 5]
            [6, 7, 8, 9, 10]
            [11, 12, 13, 14, 15]
            [16, 17, 18, 19, 20]
            [21, 22, 23, 24, 25]
        ]
        values = [
            [4, 4, 4, 4, 4]
            [4, 2, 2, 2, 4]
            [4, 2, 2, 2, 4]
            [4, 2, 2, 2, 4]
            [4, 4, 4, 4, 4]
        ]
        tiles.init values
        @$scope.tiles = tiles
        @$scope.opponents = opponents.list
        @$scope.state = GameState.state
        @$scope.wait =
            ready: false

        broadcastStatus = ->
            console.log 'sending status:', tiles.status
            unless GameState.get() is GameState.STATE.LOGIN
                socket.status tiles.status

        @$scope.$watch (-> auth.id()), (val)=>
            if val?
                GameState.set GameState.STATE.WAITFORPLAYERS
                @$scope.name = auth.id()

        @$scope.$watch (-> tiles.status.score), (val)=>
            @$scope.score = val

        @$scope.$watch 'wait.ready', (val)->
            console.log 'ready', val

        @$scope.$on 'socket:status', broadcastStatus


        @$scope.$on 'socket:applyPowerup', (e, data)->
            console.log 'applying powerup', data
            powerup.apply data, tiles
            broadcastStatus()
            $rootScope.$apply()

        @$scope.$on 'socket:rank', (e, rank)=>
            @$scope.rank = rank

        status = null
        @$scope.$on 'keydown', (e, val)=>
            keyCode = val.keyCode
            if keyCode > 47 and keyCode < 58
                index = keyCode - 49
                index = 10 if index < 0
                powerupData = powerup.create powerup.type.REMOVE_MAX
                socket.powerup opponents.powerup index, powerupData

            unless status?.gameover
                status =
                    switch val.keyCode
                        when 37
                            tiles.combine 'left'
                        when 38
                            tiles.combine 'up'
                        when 39
                            tiles.combine 'right'
                        when 40
                            tiles.combine 'down'
                if status?.changed
                    newTiles = tiles.spawn(1)
                    newTiles.forEach (tile)->
                        status.position[tile.m][tile.n] = tile.value
                    socket.status status
                    if status.gameover
                        console.log 'gameover!'
                        @$scope.gameover = true
                        @$scope.loser = true
            $rootScope.$apply()


sw.controller 'swStageCtrl', [
    '$scope'
    'Tiles'
    'Utils'
    '$rootScope'
    'socket'
    'opponents'
    'powerup'
    'auth'
    'GameState'
    SwStageController
]