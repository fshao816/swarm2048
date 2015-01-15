sw = angular.module 'swarm-2048'

property =
    changed: false
    position: null
    rows: null
    cols: null
    max: 0
    high: 0
    score: 0
    gameover: false
    ready: false
    endGame: false
    loser: false
    winner: false

readonly = []

class Status

    constructor: (@$rootScope, @GameState, @socket)->
        $rootScope.$on 'status:set', (e, options)->
            console.log options

        $rootScope.$on 'socket:status', @broadcast

        @powerups = []
        @previousPosition = []

        for key of property
            do (key)=>
                if key in readonly
                    Object.defineProperty @, key,
                        get: -> property[key]
                        enumerable: true
                else
                    Object.defineProperty @, key,
                        get: ->
                            property[key]
                        set: (val)->
                            property[key] = val
                        enumerable: true

    status: =>
        @socket.status property

    init: (rows, cols)->
        property.rows = rows
        property.cols = cols
        @previousPosition = [0...property.rows].map (d)-> []
        @reset()

    update: (tile)=>
        return unless tile.value?
        if @previousPosition[tile.m][tile.n] isnt tile.value
            property.changed = true
        property.position[tile.m][tile.n] = tile.value
        property.max = Math.max property.max, tile.value
        property.high = Math.max property.max, property.high

    reset: =>
        @previousPosition = property.position
        property.position = [0...property.rows].map (d)-> []
        console.log 'reset', property
        property.max = 0
        property.changed = false

    broadcast: =>
        unless @GameState.get() is @GameState.STATE.LOGIN
            @socket.status property


sw.factory 'status', ($rootScope, GameState, socket)->
    new Status($rootScope, GameState, socket)
