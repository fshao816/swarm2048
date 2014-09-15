sw = angular.module 'swarm-2048'

sw.directive 'swTile', ->
    scope:
        value: '=swValue'
    replace: true
    restrict: 'EA'
    templateUrl: 'tile'
    controller: 'swTileCtrl'
