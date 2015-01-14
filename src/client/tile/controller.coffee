sw = angular.module 'swarm-2048'

sw = sw.controller 'swTileCtrl', ($scope, $animate, powerup)->

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
    $scope.powerup = ->
        return null unless $scope.tile.powerup?
        switch $scope.tile.powerup.type
            when powerup.type.REMOVE_MAX
                ["_powerup", "-remove-max"]
            when powerup.type.BLOCKER
                ["_powerup", "-blocker"]
