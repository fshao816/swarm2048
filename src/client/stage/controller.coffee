sw = angular.module 'swarm-2048'

class SwStageController
    grid = null
    constructor: (@$scope, @Tiles, @Utils, @$rootScope, socket)->
        socket.connect()
        tiles = new Tiles(40, 40)
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

        @$scope.$on 'socket:position', ->
            position = [0...tiles.rows].map -> []
            tiles.data.forEach (tile)->
                return if tile.reduced
                position[tile.m][tile.n] = tile.value
            socket.position position


        @$scope.$on 'keydown', (e, val)->
            console.log val.keyCode
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
            tiles.spawn(10) if status.changed
            $rootScope.$apply()


sw.controller 'swStageCtrl', [
    '$scope'
    'Tiles'
    'Utils'
    '$rootScope'
    'socket'
    SwStageController
]