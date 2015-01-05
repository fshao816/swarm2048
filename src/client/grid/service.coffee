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

    constructor: (@rows, @cols)->

        @data = []
        @freeSpace = []
        @maxTiles = @rows * @cols

        [0...rows].forEach =>
            @freeSpace.push([0...cols].map -> true)

        @freeSpace.reset = @resetFreeSpace
        @freeSpace.free = @getFree
        @status =
            changed: false
            position: [0...@rows].map (d)-> []
            rows: @rows
            cols: @cols
            max: 0
            high: 0
            score: 0
            gameover: false
            ready: false

    updateStatus: (tile)=>
        return unless tile.value?
        @status.position[tile.m][tile.n] = tile.value
        @status.changed = true
        @status.max = Math.max @status.max, tile.value
        @status.high = Math.max @status.max, @status.high


    resetStatus: =>
        @status.position = [0...@rows].map (d)-> []
        @status.max = 0
        @status.changed = false

    init: (values)->
        return unless values.length > 0
        @freeSpace.reset()
        @resetStatus()
        values.forEach (row, m)=>
            return unless (row instanceof Array)
            row.forEach (value, n)=>
                return if m >= @rows or n >= @cols
                if value?
                    tile = new Tile m, n
                    tile.value = value
                    tile.level = @leveler tile.value
                    @updateStatus tile
                    @data.push tile
                    @freeSpace[m][n] = false

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
            console.log 'spawn', m, n
            tile = new Tile m, n
            tile.value = 2

            @updateStatus tile

            @data.push tile
            tiles.push tile

            @freeSpace[m][n] = false
        tiles

    cleanReduced: =>
        reduced = @data.filter (d)-> d.reduced
        reduced.forEach (d)=>
            i = @data.indexOf d
            @data.splice i, 1

    combine: (direction)=>
        @cleanReduced()
        if @data.length is @maxTiles
            if not @reducible()
                console.log 'gameover!!'
                @status.changed = true
                @status.gameover = true
                return @status
        # @data = @data.filter (d)-> not d.reduced
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

    leveler: (val)->
        Math.max LEVELS.indexOf(val), 0


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

        @freeSpace.reset()

        sorted = @data.slice(0).sort sorter

        sorted.reverse() if reverse

        @resetStatus()

        [0...lines].forEach (dimension)=>
            line = sorted.filter (tile)-> tile[lineProperty] is dimension
            current = start
            line.forEach (tile, i)=>
                return if tile.reduced
                if tile[tileProperty] isnt current
                    @status.changed = true

                    tile[tileProperty] = current

                next = line[i+1]
                if next? and criteria(tile.value, next.value)
                    @status.changed = true

                    next.reduced = true
                    next[tileProperty] = current
                    tile.value = tile.value + next.value
                    tile.level = @leveler tile.value
                    @status.score = @status.score + tile.value

                @freeSpace[tile.m][tile.n] = false
                @status.position[tile.m][tile.n] = tile.value
                @status.max = Math.max @status.max, tile.value
                @status.high = Math.max @status.high, @status.max
                current = nextIndex current

        # status.high = @high
        @status



# Contains main arithmetic logic
sw.factory 'Tiles', ($rootScope)->
    Tiles::$rootScope = $rootScope
    Tiles





