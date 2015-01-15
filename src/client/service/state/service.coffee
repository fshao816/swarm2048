sw = angular.module 'swarm-2048'

STATE =
    LOGIN: 'login'
    WAITFORPLAYERS: 'waitForPlayers'
    GAMEPLAY: 'gameplay'
    GAMEOVER: 'gameover'

sw.factory 'GameState', ($rootScope)->

    state =
        login: false
        waitForPlayers: false
        gameplay: false
        gameover: false

    set = (val)->
        state[key] = false for key of state
        state[val] = true

    get = ->
        for key, val of state
            return key if val

    {
        state
        STATE
        set
        get
    }