(function() {
  var sw;

  sw = angular.module('swarm-2048', ['ngAnimate']);

}).call(this);

(function() {
  var MODE, Tile, Tiles, sw,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  sw = angular.module('swarm-2048');

  MODE = {
    NORMAL: function(a, b) {
      return a === b;
    },
    NONE: function(a, b) {
      return true;
    }
  };

  Tile = (function() {
    function Tile(m, n) {
      this.m = m;
      this.n = n;
      this.value = null;
      this.reducible = false;
    }

    return Tile;

  })();

  Tiles = (function() {
    var criteria, maxCols, maxRows, tiles;

    tiles = [];

    maxRows = 0;

    maxCols = 0;

    criteria = MODE.NONE;

    function Tiles(rows, cols) {
      var key, method, _fn;
      this.rows = rows;
      this.cols = cols;
      this.combineLeft = __bind(this.combineLeft, this);
      this.combine = __bind(this.combine, this);
      _fn = function(key, method) {
        return tiles[key] = angular.isFunction(method) ? function() {
          return method.apply(tiles, arguments);
        } : method;
      };
      for (key in this) {
        method = this[key];
        if (tiles[key] != null) {
          console.warn("Cannot redefine " + key + "!");
          continue;
        }
        _fn(key, method);
      }
      return tiles;
    }

    Tiles.prototype.init = function(values) {
      if (!(values.length > 0)) {
        return;
      }
      return values.forEach(function(row, m) {
        if (!((row instanceof Array) && row.length > 0)) {
          return;
        }
        return row.forEach(function(value, n) {
          var tile;
          if (value != null) {
            tile = new Tile(m, n);
            tile.value = value;
            return tiles.push(tile);
          }
        });
      });
    };

    Tiles.prototype.byRow = function(a, b) {
      if (a.m < b.m) {
        return -1;
      } else if (a.m > b.m) {
        return 1;
      } else if (a.n < b.n) {
        return -1;
      } else if (a.n > b.n) {
        return 1;
      } else {
        return -1;
      }
    };

    Tiles.prototype.byColumn = function(a, b) {
      if (a.n < b.n) {
        return -1;
      } else if (a.n > b.n) {
        return 1;
      } else if (a.m < b.m) {
        return -1;
      } else if (a.m > b.m) {
        return 1;
      } else {
        return -1;
      }
    };

    Tiles.prototype.canCombine = function(key) {
      return function(tile, i) {
        var prev;
        if (i === 0) {
          return false;
        }
        prev = tiles[i - 1];
        if (criteria(prev.value, tile.value) && prev[key] === tile[key]) {
          return true;
        } else {
          return false;
        }
      };
    };

    Tiles.prototype.reducible = function() {
      tiles.sort(this.byRow);
      if (tiles.some(canCombine('m'))) {
        return true;
      }
      tiles.sort(this.byColumn);
      if (tiles.some(canCombine('n'))) {
        return true;
      }
      return false;
    };

    Tiles.prototype.combine = function(direction) {
      var config;
      tiles = tiles.filter(function(d) {
        return !d.reduced;
      });
      config = (function() {
        switch (direction) {
          case 'left':
            return {
              sorter: this.byRow,
              lines: this.rows,
              lineProperty: 'm',
              tileProperty: 'n',
              reverse: false,
              start: 0,
              nextIndex: function(val) {
                return val + 1;
              }
            };
          case 'right':
            return {
              sorter: this.byRow,
              lines: this.rows,
              lineProperty: 'm',
              tileProperty: 'n',
              reverse: true,
              start: this.rows - 1,
              nextIndex: function(val) {
                return val - 1;
              }
            };
          case 'up':
            return {
              sorter: this.byColumn,
              lines: this.cols,
              lineProperty: 'n',
              tileProperty: 'm',
              reverse: false,
              start: 0,
              nextIndex: function(val) {
                return val + 1;
              }
            };
          case 'down':
            return {
              sorter: this.byColumn,
              lines: this.cols,
              lineProperty: 'n',
              tileProperty: 'm',
              reverse: true,
              start: this.cols - 1,
              nextIndex: function(val) {
                return val - 1;
              }
            };
        }
      }).call(this);
      return this.reducer(config);
    };

    Tiles.prototype.reducer = function(cfg) {
      var lineProperty, lines, nextIndex, reverse, sorter, start, tileProperty, _i, _results;
      sorter = cfg.sorter, lines = cfg.lines, lineProperty = cfg.lineProperty, tileProperty = cfg.tileProperty, reverse = cfg.reverse, start = cfg.start, nextIndex = cfg.nextIndex;
      tiles.sort(sorter);
      if (reverse) {
        tiles.reverse();
      }
      console.log(tiles);
      (function() {
        _results = [];
        for (var _i = 0; 0 <= lines ? _i < lines : _i > lines; 0 <= lines ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function(dimension) {
        var current, line;
        line = tiles.filter(function(tile) {
          return tile[lineProperty] === dimension;
        });
        current = start;
        return line.forEach(function(tile, i) {
          var next;
          if (tile.reduced) {
            return;
          }
          tile[tileProperty] = current;
          next = line[i + 1];
          if ((next != null) && criteria(tile.value, next.value)) {
            next.reduced = true;
            next[tileProperty] = current;
            tile.value = tile.value + next.value;
            if (!tile.$scope.$$phase) {
              tile.$scope.$digest();
            }
          }
          return current = nextIndex(current);
        });
      });
      return this.$rootScope.$broadcast('update');
    };

    Tiles.prototype.combineLeft = function() {
      var previousRow, _i, _ref, _results;
      tiles.sort(this.byRow);
      tiles = tiles.filter(function(d) {
        return !d.reduced;
      });
      previousRow = -1;
      (function() {
        _results = [];
        for (var _i = 0, _ref = this.rows; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function(m) {
        var col, row;
        row = tiles.filter(function(tile) {
          return tile.m === m;
        });
        col = 0;
        return row.forEach(function(tile, i) {
          var next;
          if (tile.reduced) {
            return;
          }
          tile.n = col++;
          if (row[i + 1] == null) {
            return;
          }
          next = row[i + 1];
          if (criteria(tile.value, next.value)) {
            next.reduced = true;
            next.n = col - 1;
            tile.value = tile.value + next.value;
            if (!next.$scope.$$phase) {
              return tile.$scope.$digest();
            }
          }
        });
      });
      return this.$rootScope.$broadcast('update');
    };

    return Tiles;

  })();

  sw.factory('Tiles', function($rootScope) {
    Tiles.prototype.$rootScope = $rootScope;
    return Tiles;
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.factory('Utils', function($rootScope) {
    var environment;
    angular.element(window).on('keydown', function(val) {
      return $rootScope.$broadcast('keydown', val);
    });
    environment = {
      size: 0
    };
    return {
      environment: environment
    };
  });

}).call(this);

(function() {
  var SwGridController, sw;

  sw = angular.module('swarm-2048');

  SwGridController = (function() {
    var grid;

    grid = null;

    function SwGridController($scope) {
      var changeSize;
      this.$scope = $scope;
      changeSize = function() {
        return $scope.size = {
          rows: $scope.tiles.rows,
          cols: $scope.tiles.cols
        };
      };
      $scope.$watch('tiles.rows', changeSize);
      $scope.$watch('tiles.cols', changeSize);
    }

    return SwGridController;

  })();

  sw.controller('swGridCtrl', ['$scope', SwGridController]);

}).call(this);

(function() {
  var SwStageController, sw;

  sw = angular.module('swarm-2048');

  SwStageController = (function() {
    var grid;

    grid = null;

    function SwStageController($scope, Tiles, $window, Utils, $timeout) {
      var tiles, values;
      this.$scope = $scope;
      this.Tiles = Tiles;
      this.$window = $window;
      this.Utils = Utils;
      tiles = new Tiles(5, 5);
      values = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]];
      console.log(tiles);
      tiles.init(values);
      console.log(tiles);
      this.$scope.tiles = tiles;
      this.$scope.keydown = function() {
        return console.log(arguments);
      };
      this.$scope.$on('keydown', function(e, val) {
        console.log(val.keyCode);
        switch (val.keyCode) {
          case 37:
            tiles.combine('left');
            break;
          case 38:
            tiles.combine('up');
            break;
          case 39:
            tiles.combine('right');
            break;
          case 40:
            tiles.combine('down');
        }
        return $scope.$apply();
      });
    }

    return SwStageController;

  })();

  sw.controller('swStageCtrl', ['$scope', 'Tiles', '$window', 'Utils', '$timeout', SwStageController]);

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw = sw.controller('swTileCtrl', function($scope, $animate) {
    $scope.tile.$scope = $scope;
    return $scope.style = function() {
      var height, left, top, width;
      height = 100 / ($scope.size.rows || 10);
      width = 100 / ($scope.size.cols || 10);
      top = $scope.tile.m * height;
      left = $scope.tile.n * width;
      return {
        top: "" + top + "%",
        left: "" + left + "%",
        width: "" + width + "%",
        height: "" + height + "%"
      };
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.directive('swGameBoard', function() {
    return {
      scope: {
        tiles: '=swData'
      },
      replace: true,
      restrict: 'EA',
      templateUrl: 'gameboard',
      controller: 'swGridCtrl'
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.directive('swStage', function() {
    return {
      scope: {
        model: '=nvData'
      },
      replace: true,
      restrict: 'EA',
      templateUrl: 'stage',
      controller: 'swStageCtrl'
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.directive('swTile', function($animate) {
    return {
      scope: {
        tile: '=swData',
        size: '=swSize'
      },
      replace: true,
      restrict: 'EA',
      templateUrl: 'tile',
      controller: 'swTileCtrl'
    };
  });

}).call(this);
