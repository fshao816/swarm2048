angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('gameboard',
    '<div class="grid"><sw-tile ng-repeat="tile in tiles.data track by tile.id" sw-data="tile" sw-size="size" class="animate-repeat"></sw-tile></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('stage',
    '<div class="stage"><div class="opponents"><div ng-repeat="opponent in opponents" class="opponent"><sw-game-board sw-data="opponent.tiles"></sw-game-board><div class="name">{{ opponent.name }}</div></div></div><div class="player"><sw-game-board id="main-board" sw-data="tiles"></sw-game-board></div><div class="log"></div></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('tile',
    '<div ng-style="style()" class="tile"><div ng-class="{\'-reduced\': tile.reduced}" class="_inner -level-{{tile.level}}"><div class="_value">{{tile.value}}</div></div></div>'
  );
});
