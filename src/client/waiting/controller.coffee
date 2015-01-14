sw = angular.module 'swarm-2048'

sw.controller 'swWaitingCtrl', ($scope, auth, socket, opponents, status)->

    $scope.$watch (->auth.id()), (val)->
        $scope.username = auth.id()

    $scope.opponents = opponents.list

    $scope.wait =
        ready: false

    $scope.$watch 'wait.ready', (val)->
        console.log 'ready', val
        status.ready = val
        status.changed = true
        status.broadcast()


    $scope.toggle = ->
        $scope.wait.ready =
            if $scope.wait.ready
                false
            else
                true
        # $scope.wait.ready = !$scope.wait.ready