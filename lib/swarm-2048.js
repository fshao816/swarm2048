angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('grid',
    '<div class="grid"><div ng-repeat="row in data" class="_row"><div ng-repeat="value in row" class="_cell"><sw-tile sw-value="value"></sw-tile></div></div></div>'
  );
});


angular.module('swarm-2048').run(function($templateCache) {
  $templateCache.put('tile',
    '<div class="tile"><div class="_inner"><div class="_value">{{value}}</div></div></div>'
  );
});
