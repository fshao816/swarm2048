sw = angular.module 'swarm-2048'

class SwGridController
    grid = null
    constructor: (@$scope)->
        changeSize = ->
            $scope.size =
                rows: $scope.tiles.rows
                cols: $scope.tiles.cols
        $scope.$watch 'tiles.rows', changeSize
        $scope.$watch 'tiles.cols', changeSize

sw.controller 'swGridCtrl', [
    '$scope'
    SwGridController
]