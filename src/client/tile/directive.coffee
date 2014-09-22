sw = angular.module 'swarm-2048'

sw.directive 'swTile', ($animate)->
    scope:
        tile: '=swData'
        size: '=swSize'
    replace: true
    restrict: 'EA'
    templateUrl: 'tile'
    controller: 'swTileCtrl'
