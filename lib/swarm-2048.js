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
    '<div class="app"><div ng-show="state.login" class="intro"><sw-login></sw-login></div><div ng-show="state.waitForPlayers" class="wait"><sw-waiting></sw-waiting></div><div ng-if="state.gameplay" class="stage"><div class="opponents"><div class="opponents-stage"><div ng-repeat="opponent in opponents" class="opponent"><sw-game-board sw-data="opponent.tiles"></sw-game-board><div class="status"><div class="stat rank">{{ opponent.rank }}</div><div class="stat name">{{ opponent.name }}</div></div><div ng-if="opponent.message" class="overlay"><div ng-if="opponent.status.gameover" class="game-over"><span>LOSER</span></div></div></div></div></div><div class="player"><div class="status"><div class="powerups section"><div class="label">Power-ups</div><div class="icons"><div ng-repeat="powerup in powerups" class="powerup-icon-wrap"><div class="{{powerup.class}}"><span class="label">{{powerup.label}}</span></div></div></div></div><div class="score section"><div class="label">Score</div><div class="text"><div class="wrap">{{ score }}</div></div></div><div class="rank section"><div class="label">Rank</div><div class="text">{{ rank }}</div></div></div><div class="board"><sw-game-board id="main-board" sw-data="tiles"></sw-game-board><div ng-if="gameover" class="board-status"><div ng-if="winner" class="winner">WINNER</div><div ng-if="loser" class="loser">LOSER</div></div></div><div class="identify"><div class="text">{{ name }}</div></div></div><div class="log"></div></div></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('tile',
    '<div ng-style="style()" class="tile"><div ng-class="{\'-reduced\': tile.reduced}" class="_inner -level-{{tile.level}}"><div ng-class="powerup()"></div><div class="_value">{{tile.value}}</div></div></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('waiting',
    '<div class="waiting"><div class="title">Waiting For Other Players...</div><div class="columns"><div class="ready">Ready</div><div class="name">User</div></div><div class="user"><div class="ready"><div ng-click="toggle()" class="button"><div ng-show="wait.ready" class="-ready"></div><div ng-show="!wait.ready" class="-not-ready"></div></div></div><div class="name"><div class="text">{{ username }}</div></div></div><div class="opponents"><div ng-repeat="opponent in opponents" class="opponent-status"><div class="status"><div ng-show="opponent.status.ready" class="-ready"></div><div ng-show="!opponent.status.ready" class="-not-ready"></div></div><div class="name">{{ opponent.name }}</div></div></div></div>'
  );
});
