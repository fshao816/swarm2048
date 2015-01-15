sw = angular.module 'swarm-2048'

sw.factory 'opponents', ($rootScope, Tiles, powerup)->

    list = []
    map = {}

    powerupMessage = (type, id, opponentName)->
        switch type
            when powerup.type.REMOVE_MAX
                "#{id} removed #{opponentName}'s max tile!!!"
            when powerup.type.BLOCKER
                "#{id} blocked one of #{opponentName}'s tiles!!!"

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
        'winner'
        'loser'
    ]
    update = (data)->
        add data unless data.id of map

        opponent = map[data.id]
        opponent.tiles.update data.status.position
        statusKeys.forEach (d)->
            opponent.status[d] = data.status[d]

        opponent.message = opponent.status.gameover

        $rootScope.$apply()

    applyPowerup = (playerRank, powerupData)->
        # find player of rank
        player = null
        console.log list, playerRank
        for opponent in list
            if opponent.rank is playerRank
                player = opponent
                break
        return unless player?
        console.log 'making powerup for opponent', player.name

        powerupData.message =
            powerupMessage powerupData.type, powerupData.origin, player.name

        id: player.name
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
        applyPowerup
        rank
    }