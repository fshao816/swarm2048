sw = angular.module 'swarm-2048'

sw.controller 'swLoginCtrl', ($scope, auth, socket)->
    $scope.submit = ->
        auth.login $scope.username
        socket.identify()
