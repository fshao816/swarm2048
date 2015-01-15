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
        GameState,
        @status,
        $window
    )->

        GameState.set GameState.STATE.LOGIN

        @status.init(4, 4)
        tiles = new Tiles(4, 4, @status)

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

        @$scope.powerups = @status.powerups
        @$scope.logs = []
        logCount = 0

        @$scope.$watch (-> auth.id()), (val)=>
            if val?
                console.log 'logging in', val
                GameState.set GameState.STATE.WAITFORPLAYERS
                socket.connect()
                socket.identify()
                @$scope.name = auth.id()

        @$scope.$on 'socket:allReady', ->
            GameState.set GameState.STATE.GAMEPLAY

        @$scope.$watch (=> @status.score), (val)=>
            @$scope.score = val

        @$scope.$watch (=> @status.gameover), (newVal, oldVal)=>
            if newVal and not oldVal and @status.loser
                @$scope.loser = true
                @$scope.gameover = true


        @$scope.$on 'socket:gameComplete', (e, playerName)=>
            GameState.set GameState.STATE.GAMEOVER

            @$scope.gameover = true

            if playerName is auth.id()
                @$scope.winner = true
                @status.loser = false
                @status.winner = true
            else
                @$scope.loser = true
                @status.loser = true
                @status.winner = false

            @status.gameover = true
            @status.endGame = false
            @status.broadcast()



            @$scope.$apply() unless @$scope.$$phase?


        @$scope.$on 'socket:applyPowerup', (e, data)=>
            # console.log 'applying powerup', data
            powerup.apply data, tiles
            # @$scope.logs.push
            #     id: logCount++
            #     text: data.message
            # if @$scope.logs.length > 20
            #     @$scope.logs.shift()
            @status.broadcast()
            $rootScope.$apply()

        @$scope.$on 'socket:message', (e, data)=>
            @$scope.logs.push
                id: logCount++
                text: data
            if @$scope.logs.length > 20
                @$scope.logs.shift()

        @$scope.$on 'socket:rank', (e, rank)=>
            @$scope.rank = rank

        uniformVar = -> (Math.random() * 2) - 1
        normalVar = uniformVar() + uniformVar() + uniformVar() + uniformVar()
        pause = (normalVar * 2000) + 6000

        randomSpawn = ->
            powerup.spawn tiles
            normalVar =
                uniformVar() + uniformVar() + uniformVar() + uniformVar()
            pause = (normalVar * 2000) + 6000
            setTimeout randomSpawn, pause

        setTimeout randomSpawn, pause


        @$scope.$on 'keydown', (e, val)=>
            keyCode = val.keyCode

            return unless GameState.get() is GameState.STATE.GAMEPLAY
            if keyCode > 47 and keyCode < 58
                index = keyCode - 48
                index = 10 if index < 1
                powerupData = @status.powerups.shift()
                if powerupData?
                    targetedPowerup = opponents.applyPowerup index, powerupData
                    console.log targetedPowerup
                    if targetedPowerup?
                        socket.powerup targetedPowerup
                return

            unless status.gameover
                switch val.keyCode
                    when 37
                        tiles.combine 'left'
                    when 38
                        tiles.combine 'up'
                    when 39
                        tiles.combine 'right'
                    when 40
                        tiles.combine 'down'
                console.log status
                if status.changed
                    console.log 'status changed'
                    newTiles = tiles.spawn(1)
                    newTiles.forEach (tile)->
                        console.log 'status position', status.position
                        status.position[tile.m][tile.n] = tile.value

                    # powerup.spawn tiles

                    status.broadcast()

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
    'status'
    '$window'
    SwStageController
]