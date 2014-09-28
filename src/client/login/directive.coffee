sw = angular.module 'swarm-2048'

sw.directive 'swLogin', ->
    scope: {}
    replace: true
    restrict: 'EA'
    templateUrl: 'login'
    controller: 'swLoginCtrl'
