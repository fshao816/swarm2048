sw = angular.module 'swarm-2048'

sw.directive 'swStage', ->
    scope:
        model: '=nvData'
    replace: true
    restrict: 'EA'
    templateUrl: 'stage'
    controller: 'swStageCtrl'
