sw = angular.module 'swarm-2048'

sw.directive 'swWaiting', ->
    scope: {}
    replace: true
    restrict: 'EA'
    templateUrl: 'waiting'
    controller: 'swWaitingCtrl'
