sw = angular.module 'swarm-2048'

sw.factory 'powerup', (auth, $rootScope)->
    type =
        REMOVE_MAX: 'remove_max'
        BLOCKER: 'blocker'
    types = (val for key, val of type)

    create = (kind)->
        switch kind
            when type.REMOVE_MAX
                {
                    type: type.REMOVE_MAX
                    class: '-powerup-icon -remove-max'
                    duration: 5000
                    origin: auth.id() || 'unknown'
                    message: "#{auth.id()} removed your max tile!!!"
                    label: 'D'
                }
            when type.BLOCKER
                {
                    type: type.BLOCKER
                    class: '-powerup-icon -blocker'
                    duration: 5000
                    origin: auth.id() || 'unknown'
                    message: "#{auth.id()} blocked one of your tiles!!!"
                    label: 'B'
                }

    spawn = (tiles)->
        generate = Math.random() * 100
        return if generate < 1

        index = parseInt(Math.random() * types.length)

        powerupType = types[index]
        powerup = create powerupType
        tiles.attachPowerup powerup

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
            when type.BLOCKER
                valid = tiles.data.filter((tile)-> not tile.reduced)
                index = parseInt(Math.random() * valid.length)
                tile = valid[index]
                tile.meta.blocked = true
                do (tile)->
                    setTimeout ->
                        delete tile.meta.blocked
                        $rootScope.$apply() unless $rootScope.$$phase?
                    , 10000


    {
        apply
        type
        create
        spawn
    }
