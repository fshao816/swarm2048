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

    combineLeft: =>
        tiles.sort @byRow
        tiles = tiles.filter (d)-> not d.reduced
        previousRow = -1
        [0...@rows].forEach (m)->
            row = tiles.filter (tile)->
                tile.m is m
            col = -1
            row.forEach (tile, i)->
                col++
                if tile.reduced
                    col--
                    return
                unless row[i+1]?
                    tile.n = col
                    return
                next = row[i+1]
                if criteria(tile.value, next.value)
                    next.reduced = true
                    next.n = col
                    tile.n = col
                    # tiles.splice tiles.indexOf(next), 1
                    tile.value = tile.value + next.value
                    tile.$scope.$digest() unless next.$scope.$$phase
                else
                    tile.n = col
        @$rootScope.$broadcast 'update'




# Contains main arithmetic logic
sw.factory 'Tiles', ($rootScope)->
    Tiles::$rootScope = $rootScope
    Tiles





