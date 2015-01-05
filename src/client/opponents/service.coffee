sw = angular.module 'swarm-2048'

sw.factory 'opponents', ($rootScope, Tiles)->

    list = []
    map = {}

    add = (data)->
        console.log 'adding opponent', data
        position = data.status.position
        rows = data.status.rows || 5
        cols = data.status.cols || 5
        tiles = new Tiles rows, cols
        tiles.init position
        opponent =
            name: data.id
            tiles: tiles
            rank: ''
            message: false
            status: {}
        list.push opponent
        map[data.id] = opponent
        console.log 'added', list

    rank = (data)->
        data.forEach (name, i)->
            return unless map[name]?
            opponent = map[name]
            j = list.indexOf opponent
            list.splice j, 1
            list.push opponent
            opponent.rank = i + 1
        $rootScope.$apply()

    statusKeys = [
        'gameover'
        'ready'
    ]
    update = (data)->
        console.log 'updating opponent', data
        console.log map
        add data unless data.id of map

        opponent = map[data.id]
        opponent.tiles.update data.status.position
        statusKeys.forEach (d)->
            opponent.status[d] = data.status[d]

        opponent.message = opponent.status.gameover

        $rootScope.$apply()
        console.log list

    powerup = (playerIndex, powerupData)->
        console.log 'making powerup for opponent', list[playerIndex].name
        id: list[playerIndex].name
        powerup: powerupData

    remove = (id)->
        console.log 'removing opponent', id
        opponent = map[id]
        list.splice (list.indexOf opponent), 1
        console.log list
        delete map[id]
        $rootScope.$apply()

    {
        list
        update
        remove
        add
        powerup
        rank
    }