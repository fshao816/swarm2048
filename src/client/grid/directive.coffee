sw = angular.module 'swarm-2048'

sw.directive 'sw-grid', ->
    scope:
        model: '=nvData'
    replace: true
    restrict: 'EA'
    templateUrl: 'grid'
    controller: 'swGridCtrl'
