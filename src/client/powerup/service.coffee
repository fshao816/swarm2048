sw = angular.module 'swarm-2048'

sw.factory 'powerup', ->
    type =
        REMOVE_MAX: 'remove_max'
        BLOCKER: 'blocker'

    create = (kind)->
        switch kind
            when type.REMOVE_MAX
                {
                    type: type.REMOVE_MAX
                }
            when type.BLOCKER
                {
                    type: type.BLOCKER
                }

    apply = (data, tiles)->
        return unless data.type?
        switch data.type
            when type.REMOVE_MAX
                valid = tiles.data.filter((tile)-> not tile.reduced)
                max = Math.max.apply(null, valid.map (tile)-> tile.value)
                maxes = valid.filter (tile)-> tile.value is max
                i = parseInt(Math.random() * maxes.length)
                removeIndex = tiles.data.indexOf maxes[i]
                tiles.remove removeIndex


    {
        apply
        type
        create
    }
