sw = angular.module 'swarm-2048'

sw.directive 'swGameBoard', ->
    scope:
        tiles: '=swData'
    replace: true
    restrict: 'EA'
    templateUrl: 'gameboard'
    controller: 'swGridCtrl'
