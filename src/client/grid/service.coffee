sw = angular.module 'swarm-2048'

MODE =
    NORMAL: (a, b)-> a is b
    NONE: (a, b)-> true

class Tile
    constructor: (@m, @n)->
        @value = null
        @reducible = no

class Tiles
    tiles = []
    maxRows = 0
    maxCols = 0
    criteria = MODE.NONE

    constructor: (@rows, @cols)->
        for key, method of @
            if tiles[key]?
                console.warn "Cannot redefine #{key}!"
                continue
            do (key, method)->
                tiles[key] =
                    if angular.isFunction method
                        -> method.apply(tiles, arguments)
                    else
                        method

        return tiles

    init: (values)->
        return unless values.length > 0
        values.forEach (row, m)->
            return unless (row instanceof Array) and row.length > 0
            row.forEach (value, n)->
                if value?
                    tile = new Tile m, n
                    tile.value = value
                    tiles.push tile

    byRow: (a, b)->
        if a.m < b.m then -1
        else if a.m > b.m then 1
        else if a.n < b.n then -1
        else if a.n > b.n then 1
        else -1

    byColumn: (a, b)->
        if a.n < b.n then -1
        else if a.n > b.n then 1
        else if a.m < b.m then -1
        else if a.m > b.m then 1
        else -1

    canCombine: (key)-> (tile, i)->
        return false if i is 0
        prev = tiles[i - 1]
        if criteria(prev.value, tile.value) and prev[key] is tile[key]
            true
        else
            false

    reducible: ->
        tiles.sort @byRow
        if tiles.some canCombine('m')
            return true
        tiles.sort @byColumn
        if tiles.some canCombine('n')
            return true
        return false

    combine: (direction)=>
        tiles = tiles.filter (d)-> not d.reduced
        config =
            switch direction
                when 'left'
                    sorter: @byRow
                    lines: @rows
                    lineProperty: 'm'
                    tileProperty: 'n'
                    reverse: false
                    start: 0
                    nextIndex: (val)-> val + 1
                when 'right'
                    sorter: @byRow
                    lines: @rows
                    lineProperty: 'm'
                    tileProperty: 'n'
                    reverse: true
                    start: @rows - 1
                    nextIndex: (val)-> val - 1
                when 'up'
                    sorter: @byColumn
                    lines: @cols
                    lineProperty: 'n'
                    tileProperty: 'm'
                    reverse: false
                    start: 0
                    nextIndex: (val)-> val + 1
                when 'down'
                    sorter: @byColumn
                    lines: @cols
                    lineProperty: 'n'
                    tileProperty: 'm'
                    reverse: true
                    start: @cols - 1
                    nextIndex: (val)-> val - 1
        @reducer config

    reducer: (cfg)->
        {
            sorter
            lines
            lineProperty
            tileProperty
            reverse
            start
            nextIndex
        } = cfg

        tiles.sort sorter

        tiles.reverse() if reverse
        console.log tiles
        [0...lines].forEach (dimension)->
            line = tiles.filter (tile)-> tile[lineProperty] is dimension
            current = start
            line.forEach (tile, i)->
                return if tile.reduced
                tile[tileProperty] = current
                next = line[i+1]
                if next? and criteria(tile.value, next.value)
                    next.reduced = true
                    next[tileProperty] = current
                    tile.value = tile.value + next.value
                    tile.$scope.$digest() unless tile.$scope.$$phase
                current = nextIndex current
        @$rootScope.$broadcast 'update'



# Contains main arithmetic logic
sw.factory 'Tiles', ($rootScope)->
    Tiles::$rootScope = $rootScope
    Tiles





