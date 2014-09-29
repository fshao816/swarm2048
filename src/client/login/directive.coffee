sw = angular.module 'swarm-2048'

sw.directive 'swLogin', ->
    scope: {}
    replace: true
    restrict: 'EA'
    templateUrl: 'login'
    controller: 'swLoginCtrl'

sw.directive 'swFocus', ($timeout)->
    scope:
        trigger: '@swFocus'
    restrict: 'A'
    link: (scope, element)->
        scope.$watch 'trigger', (val)->
            if val is 'true'
                $timeout -> element[0].focus()