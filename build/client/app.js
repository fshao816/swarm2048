(function() {
  var sw;

  sw = angular.module('swarm-2048', []);

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.controller('swGridCtrl', function() {});

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw = sw.controller('swTileCtrl', function() {});

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.directive('sw-grid', function() {
    return {
      scope: {
        model: '=nvData'
      },
      replace: true,
      restrict: 'EA',
      templateUrl: 'grid',
      controller: 'swGridCtrl'
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.directive('swTile', function() {
    return {
      scope: {
        value: '=swValue'
      },
      replace: true,
      restrict: 'EA',
      templateUrl: 'tile',
      controller: 'swTileCtrl'
    };
  });

}).call(this);
