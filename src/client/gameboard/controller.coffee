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

        # console.log 'grid model', $scope.model.length
        # $scope.$watch 'model.length', (val)->
        #     height = 100 / val
        #     $scope.rowStyle = (row)->
        #         row.forEach (tile)-> tile.height = height
        #         height: "#{height}%"

        # $scope.$watch 'model[0].length', (val)->
        #     width = 100 / val
        #     $scope.cellStyle = (tile)->
        #         left = tile.n * width
        #         tile.width = width
        #         left: "#{left}%"



sw.controller 'swGridCtrl', [
    '$scope'
    SwGridController
]