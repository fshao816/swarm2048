sw = angular.module 'swarm-2048'

sw.controller 'swLoginCtrl', ($scope, auth, socket)->
    $scope.username = ''
    $scope.$on 'keydown', (e, val)=>
        if val.keyCode is 13 and $scope.username isnt ''
            $scope.submit()

    $scope.submit = ->
        auth.login $scope.username