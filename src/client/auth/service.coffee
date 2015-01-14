sw = angular.module 'swarm-2048'

sw.factory 'auth', ->
    userId = null
    id = -> userId
    login = (user)->
        console.log 'login', user
        userId = user

    # 'user-' + parseInt(Math.random() * 10000000)

    {
        id
        login
    }