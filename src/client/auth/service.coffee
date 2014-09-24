sw = angular.module 'swarm-2048'

sw.factory 'auth', ->
    id = 'user-' + parseInt(Math.random() * 10000000)

    {id}