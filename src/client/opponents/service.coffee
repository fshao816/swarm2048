sw = angular.module 'swarm-2048'

sw.factory 'opponents', ($rootScope, Tiles)->


    # list = []
    # currentOpponents = []

    # add = (data)->
    #     rows = data.position.length
    #     cols = data.position[0].length
    #     tiles = new Tiles rows, cols
    #     tiles.init data.position
    #     list.push(
    #         name: data.id
    #         tiles: tiles
    #     )
    # update = (data)->
    #     add data unless data.id in currentOpponents
    #     if currentOpponents

    # remove = (id)->
    #     i = currentOpponents.indexOf id
    #     currentOpponents.splice(i, 1)
    #     for opponent, i in list
    #         if opponent.name is id
    #             list.splice i, 1
    #             break

    {
        list
    }