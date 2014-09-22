sw = angular.module 'swarm-2048'

class SwStageController
    grid = null
    constructor: (@$scope, @Tiles, @$window, @Utils, $timeout)->
        tiles = new Tiles(5, 5)
        values = [
            [1, 2, 3, 4, 5]
            [6, 7, 8, 9, 10]
            [11, 12, 13, 14, 15]
            [16, 17, 18, 19, 20]
            [21, 22, 23, 24, 25]
        ]
        console.log tiles
        tiles.init values
        console.log tiles
        @$scope.tiles = tiles

        @$scope.keydown = ->
            console.log arguments
        @$scope.$on 'keydown', (e, val)->
            console.log val.keyCode
            switch val.keyCode
                when 37
                    tiles.combine 'left'
                when 38
                    tiles.combine 'up'
                when 39
                    tiles.combine 'right'
                when 40
                    tiles.combine 'down'
            $scope.$apply()

sw.controller 'swStageCtrl', [
    '$scope'
    'Tiles'
    '$window'
    'Utils'
    '$timeout'
    SwStageController
]