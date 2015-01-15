sw = angular.module 'swarm-2048'

MODE =
    NORMAL: (a, b)-> a is b
    NONE: (a, b)-> true

LEVELS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192]

tileId = 0


class Tile
    constructor: (@m, @n)->
        @id = tileId++
        @value = null
        @reducible = no
        @level = 0
        @powerup = null
        @meta = {}

class Tiles
    maxRows = 0
    maxCols = 0
    criteria = MODE.NORMAL



    getFree: =>
        result = []
        Array::forEach.call @freeSpace, (row, m)->
            row.forEach (free, n)->
                result.push {m, n} if free
        result

    resetFreeSpace: =>
        Array::forEach.call @freeSpace, (row)->
            [0...row.length].forEach (i)->
                row[i] = true

    constructor: (@rows, @cols, @status)->

        @data = []
        @freeSpace = []
        @maxTiles = @rows * @cols

        [0...rows].forEach =>
            @freeSpace.push([0...cols].map -> true)

        @freeSpace.reset = @resetFreeSpace
        @freeSpace.free = @getFree

    init: (values)->
        return unless values.length > 0
        @freeSpace.reset()
        @status.reset() if @status?

        values.forEach (row, m)=>
            return unless (row instanceof Array)
            row.forEach (value, n)=>
                return if m >= @rows or n >= @cols
                if value?
                    tile = new Tile m, n
                    tile.value = value
                    tile.level = @leveler tile.value
                    @data.push tile
                    @freeSpace[m][n] = false

                    @status.update tile if @status

    update: (values)=>
        @data = []
        @init values

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

    canCombine: (key)-> (tile, i)=>
        return false if i is 0
        prev = @data[i - 1]
        if criteria(prev.value, tile.value) and prev[key] is tile[key]
            true
        else
            false

    reducible: =>
        @data.sort @byRow
        if @data.some @canCombine('m')
            return true
        @data.sort @byColumn
        if @data.some @canCombine('n')
            return true
        return false

    remove: (tile)=>
        if tile instanceof Tile
            return
        else
            index = tile
            tile = @data[index]
            @data.splice index, 1
            if @status?
                @status.changed = true
                @status.position[tile.m][tile.n] = null
                @status.max =
                    Math.max.apply null, @data.map (tile)->tile.value

    spawn: (num = 1)->
        free = @freeSpace.free()
        tiles = []
        [0...num].forEach =>
            return if free.length is 0
            i = parseInt(Math.random() * free.length)
            {m, n} = free[i]
            free.splice i, 1
            tile = new Tile m, n
            tile.value = 2

            @status.update tile if @status?

            @data.push tile
            tiles.push tile

            @freeSpace[m][n] = false
        tiles

    attachPowerup: (powerup)->
        console.log 'attaching powerup'
        valid = @data.filter((tile)-> not tile.reduced)
        index = parseInt(Math.random() * valid.length)
        tile = valid[index]
        tile.powerup = powerup
        do (tile, @$rootScope)->
            remove = =>
                tile.powerup = null
                $rootScope.$apply() unless $rootScope.$$phase?
            setTimeout remove, tile.powerup.duration

    cleanReduced: =>
        reduced = @data.filter (d)-> d.reduced
        reduced.forEach (d)=>
            i = @data.indexOf d
            @data.splice i, 1

    combine: (direction)=>
        console.log 'tiles combine'
        @cleanReduced()
        if @data.length is @maxTiles
            if not @reducible()
                console.log 'gameover!!'
                if @status?
                    @status.changed = true
                    @status.gameover = true
                    @status.loser = true
                return
        config =
            switch direction
                when 'left'
                    sorter: @byRow
                    lineCount: @rows
                    lineKey: 'm'
                    tileKey: 'n'
                    reverse: false
                    start: 0
                    nextIndex: (val)-> val + 1
                when 'right'
                    sorter: @byRow
                    lineCount: @rows
                    lineKey: 'm'
                    tileKey: 'n'
                    reverse: true
                    start: @rows - 1
                    nextIndex: (val)-> val - 1
                when 'up'
                    sorter: @byColumn
                    lineCount: @cols
                    lineKey: 'n'
                    tileKey: 'm'
                    reverse: false
                    start: 0
                    nextIndex: (val)-> val + 1
                when 'down'
                    sorter: @byColumn
                    lineCount: @cols
                    lineKey: 'n'
                    tileKey: 'm'
                    reverse: true
                    start: @cols - 1
                    nextIndex: (val)-> val - 1
        @reducer config

    leveler: (val)->
        Math.max LEVELS.indexOf(val), 0

    reducer: (cfg)->
        {
            sorter
            lineCount
            lineKey
            tileKey
            reverse
            start
            nextIndex
        } = cfg

        @freeSpace.reset()

        sorted = @data.slice(0).sort sorter

        sorted.reverse() if reverse

        @status.reset() if @status?

        [0...lineCount].forEach (dimension)=>

            # Collect the tiles in the current line
            line = sorted.filter (tile)-> tile[lineKey] is dimension

            # Current position of tile in consideration
            lineCursor = start

            line.forEach (tile, i)=>

                # Skip this tile if already reduced
                return if tile.reduced

                # Set this tile to have current lineCursor index
                if tile[tileKey] isnt lineCursor
                    if tile.meta?.blocked
                        lineCursor = tile[tileKey]
                    else
                        tile[tileKey] = lineCursor

                ###
                Look ahead to next tile and see if it should
                be merged into the current one. If it IS eligible to be
                merged, than reduced=true and will be skipped when
                iterator reaches that tile
                ###
                next = line[i+1]
                if next? and criteria(tile.value, next.value) and
                not next.meta?.blocked and
                not tile.meta?.blocked
                    if @status?
                        if next.powerup?
                            @status.powerups.push next.powerup
                            next.powerup = null
                            console.log 'added powerup', @status.powerups
                        if tile.powerup?
                            @status.powerups.push tile.powerup
                            tile.powerup = null
                            console.log 'added powerup', @status.powerups
                        if @status.powerups.length > 10
                            @status.powerups.pop()

                    next.reduced = true
                    next[tileKey] = lineCursor
                    tile.value = tile.value + next.value

                    if tile.value is 2048 and @status?
                        @status.endGame = true

                    tile.level = @leveler tile.value
                    if @status?
                        @status.score = @status.score + tile.value

                @freeSpace[tile.m][tile.n] = false
                @status.update tile if @status?
                lineCursor = nextIndex lineCursor


# Contains main arithmetic logic
sw.factory 'Tiles', ($rootScope)->
    Tiles::$rootScope = $rootScope
    Tiles





