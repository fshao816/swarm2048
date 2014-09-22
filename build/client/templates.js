angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('gameboard',
    '<div class="grid"><sw-tile ng-repeat="tile in tiles" sw-data="tile" sw-size="size" class="animate-repeat"></sw-tile></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('stage',
    '<div class="stage"><sw-game-board id="main-board" sw-data="tiles"></sw-game-board></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('tile',
    '<div ng-style="style()" class="tile"><div ng-class="{\'-reduced\': tile.reduced}" class="_inner"><div class="_value">{{tile.value}}</div></div></div>'
  );
});
