sw = angular.module 'swarm-2048'

sw.factory 'opponents', ($rootScope, Tiles)->

    list = []
    dict = {}

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
        list.push opponent
        dict[data.id] = opponent
        console.log 'added', list

    rank = (data)->
        data.forEach (name, i)->
            return unless dict[name]?
            opponent = dict[name]
            j = list.indexOf opponent
            list.splice j, 1
            list.push opponent
            opponent.rank = i + 1
        $rootScope.$apply()

    update = (data)->
        console.log 'updating opponent', data
        console.log dict
        add data unless data.id of dict

        dict[data.id].tiles.update data.status.position

        $rootScope.$apply()
        console.log list

    powerup = (playerIndex, powerupData)->
        console.log 'making powerup for opponent', list[playerIndex].name
        id: list[playerIndex].name
        powerup: powerupData

    remove = (id)->
        console.log 'removing opponent', id
        opponent = dict[id]
        list.splice (list.indexOf opponent), 1
        console.log list
        delete dict[id]
        $rootScope.$apply()

    {
        list
        update
        remove
        add
        powerup
        rank
    }