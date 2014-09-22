sw = angular.module 'swarm-2048'

sw = sw.controller 'swTileCtrl', ($scope, $animate)->

    $scope.tile.$scope = $scope
    $scope.style = ->
        height = 100 / ($scope.size.rows || 10)
        width = 100 / ($scope.size.cols || 10)
        top = $scope.tile.m * height
        left = $scope.tile.n * width
        top: "#{top}%"
        left: "#{left}%"
        width: "#{width}%"
        height: "#{height}%"
