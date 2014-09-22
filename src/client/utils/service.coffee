sw = angular.module 'swarm-2048'

sw.factory 'Utils', ($rootScope)->

    angular.element(window).on 'keydown', (val)->
        $rootScope.$broadcast 'keydown', val

    environment =
        size: 0

    {environment}