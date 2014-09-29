angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('gameboard',
    '<div class="grid"><sw-tile ng-repeat="tile in tiles.data track by tile.id" sw-data="tile" sw-size="size" class="animate-repeat"></sw-tile></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('login',
    '<div class="login"><div class="title">Swarm 2048</div><div class="content"><div class="username"><div class="label">Please enter your name:</div><input ng-model="username" sw-focus="true"/></div><div ng-click="submit()" class="button">Start</div></div></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('stage',
    '<div class="app"><div ng-if="!loggedIn" class="intro"><sw-login></sw-login></div><div ng-if="loggedIn" class="stage"><div class="opponents"><div class="opponents-stage"><div ng-repeat="opponent in opponents" class="opponent"><sw-game-board sw-data="opponent.tiles"></sw-game-board><div class="status"><div class="stat rank">{{ opponent.rank }}</div><div class="stat name">{{ opponent.name }}</div></div></div></div></div><div class="player"><div class="status"><div class="powerups section"></div><div class="score section"><div class="label">Score</div><div class="text"><div class="wrap">{{ score }}</div></div></div><div class="rank section"><div class="label">Rank</div><div class="text">{{ rank }}</div></div></div><div class="board"><sw-game-board id="main-board" sw-data="tiles"></sw-game-board></div><div class="identify"><div class="text">{{ name }}</div></div></div><div class="log"></div></div></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('tile',
    '<div ng-style="style()" class="tile"><div ng-class="{\'-reduced\': tile.reduced}" class="_inner -level-{{tile.level}}"><div class="_value">{{tile.value}}</div></div></div>'
  );
});
