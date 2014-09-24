(function() {
  var sw;

  sw = angular.module('swarm-2048', ['ngAnimate']);

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.factory('auth', function() {
    var id;
    id = 'user-' + parseInt(Math.random() * 10000000);
    return {
      id: id
    };
  });

}).call(this);

(function() {
  var LEVELS, MODE, Tile, Tiles, sw, tileId,
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

  LEVELS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];

  tileId = 0;

  Tile = (function() {
    function Tile(m, n) {
      this.m = m;
      this.n = n;
      this.id = tileId++;
      this.value = null;
      this.reducible = false;
      this.level = 0;
    }

    return Tile;

  })();

  Tiles = (function() {
    var criteria, freeSpace, maxCols, maxRows;

    maxRows = 0;

    maxCols = 0;

    criteria = MODE.NORMAL;

    freeSpace = [];

    freeSpace.reset = function() {
      return Array.prototype.forEach.call(freeSpace, function(row) {
        var _i, _ref, _results;
        return (function() {
          _results = [];
          for (var _i = 0, _ref = row.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).forEach(function(i) {
          return row[i] = true;
        });
      });
    };

    freeSpace.free = function() {
      var result;
      result = [];
      Array.prototype.forEach.call(freeSpace, function(row, m) {
        return row.forEach(function(free, n) {
          if (free) {
            return result.push({
              m: m,
              n: n
            });
          }
        });
      });
      return result;
    };

    function Tiles(rows, cols) {
      var _i, _results;
      this.rows = rows;
      this.cols = cols;
      this.combine = __bind(this.combine, this);
      this.cleanReduced = __bind(this.cleanReduced, this);
      this.reducible = __bind(this.reducible, this);
      this.update = __bind(this.update, this);
      (function() {
        _results = [];
        for (var _i = 0; 0 <= rows ? _i < rows : _i > rows; 0 <= rows ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function() {
        var _i, _results;
        return freeSpace.push((function() {
          _results = [];
          for (var _i = 0; 0 <= cols ? _i < cols : _i > cols; 0 <= cols ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function() {
          return true;
        }));
      });
      this.data = [];
    }

    Tiles.prototype.init = function(values) {
      var _this = this;
      if (!(values.length > 0)) {
        return;
      }
      freeSpace.reset();
      return values.forEach(function(row, m) {
        if (!((row instanceof Array) && row.length > 0)) {
          return;
        }
        return row.forEach(function(value, n) {
          var tile;
          if (m >= _this.rows || n >= _this.cols) {
            return;
          }
          if (value != null) {
            tile = new Tile(m, n);
            tile.value = value;
            tile.level = _this.leveler(tile.value);
            _this.data.push(tile);
            return freeSpace[m][n] = false;
          }
        });
      });
    };

    Tiles.prototype.update = function(values) {
      return this.data.forEach(function(tile) {
        var _ref;
        if (tile.reduced) {
          return;
        }
        if (((_ref = values[tile.m]) != null ? _ref[tile.n] : void 0) != null) {
          tile.value = values[tile.m][tile.n];
          return tile.level = this.leveler(tile.value);
        }
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
      var _this = this;
      return function(tile, i) {
        var prev;
        if (i === 0) {
          return false;
        }
        prev = _this.data[i - 1];
        if (criteria(prev.value, tile.value) && prev[key] === tile[key]) {
          return true;
        } else {
          return false;
        }
      };
    };

    Tiles.prototype.reducible = function() {
      this.data.sort(this.byRow);
      if (this.data.some(canCombine('m'))) {
        return true;
      }
      this.data.sort(this.byColumn);
      if (this.data.some(canCombine('n'))) {
        return true;
      }
      return false;
    };

    Tiles.prototype.spawn = function(num) {
      var free, _i, _results,
        _this = this;
      if (num == null) {
        num = 1;
      }
      free = freeSpace.free();
      return (function() {
        _results = [];
        for (var _i = 0; 0 <= num ? _i < num : _i > num; 0 <= num ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function() {
        var i, m, n, tile, _ref;
        if (free.length === 0) {
          return;
        }
        i = parseInt(Math.random() * free.length);
        _ref = free[i], m = _ref.m, n = _ref.n;
        free.splice(i, 1);
        tile = new Tile(m, n);
        tile.value = 2;
        _this.data.push(tile);
        return freeSpace[m][n] = false;
      });
    };

    Tiles.prototype.cleanReduced = function() {
      var reduced,
        _this = this;
      reduced = this.data.filter(function(d) {
        return d.reduced;
      });
      return reduced.forEach(function(d) {
        var i;
        i = _this.data.indexOf(d);
        return _this.data.splice(i, 1);
      });
    };

    Tiles.prototype.combine = function(direction) {
      var config;
      this.cleanReduced();
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

    Tiles.prototype.leveler = function(val) {
      return Math.max(LEVELS.indexOf(val), 0);
    };

    Tiles.prototype.reducer = function(cfg) {
      var changed, lineProperty, lines, nextIndex, reverse, sorted, sorter, start, status, tileProperty, _i, _j, _ref, _results, _results1,
        _this = this;
      sorter = cfg.sorter, lines = cfg.lines, lineProperty = cfg.lineProperty, tileProperty = cfg.tileProperty, reverse = cfg.reverse, start = cfg.start, nextIndex = cfg.nextIndex;
      freeSpace.reset();
      sorted = this.data.slice(0).sort(sorter);
      if (reverse) {
        sorted.reverse();
      }
      status = {
        changed: false,
        position: (function() {
          _results = [];
          for (var _i = 0, _ref = this.rows; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function(d) {
          return [];
        })
      };
      changed = false;
      (function() {
        _results1 = [];
        for (var _j = 0; 0 <= lines ? _j < lines : _j > lines; 0 <= lines ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this).forEach(function(dimension) {
        var current, line;
        line = sorted.filter(function(tile) {
          return tile[lineProperty] === dimension;
        });
        current = start;
        return line.forEach(function(tile, i) {
          var next;
          if (tile.reduced) {
            return;
          }
          if (tile[tileProperty] !== current) {
            status.changed = true;
            tile[tileProperty] = current;
          }
          freeSpace[tile.m][tile.n] = false;
          next = line[i + 1];
          if ((next != null) && criteria(tile.value, next.value)) {
            next.reduced = true;
            next[tileProperty] = current;
            tile.value = tile.value + next.value;
            tile.level = _this.leveler(tile.value);
            status.position[tile.m][tile.n] = tile.value;
          }
          return current = nextIndex(current);
        });
      });
      return status;
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

  sw.factory('opponents', function($rootScope, Tiles) {
    return {
      list: list
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.factory('socket', function($rootScope, auth) {
    var connect, position, socket;
    socket = null;
    connect = function() {
      if (socket == null) {
        socket = io();
        socket.on('addPlayers', function(data) {
          return $rootScope.$broadcast('socket:addPlayers', data);
        });
        socket.on('updatePlayers', function(data) {
          console.log('socket update players');
          return $rootScope.$broadcast('socket:updatePlayers', data);
        });
        socket.on('identify', function() {
          return socket.emit('identify', auth.id);
        });
        socket.on('position', function() {
          console.log('socket position');
          return $rootScope.$broadcast('socket:position');
        });
        return socket.on('disconnect', function(id) {
          return $rootScope.$broadcast('socket:disconnect', id);
        });
      }
    };
    position = function(data) {
      return socket.emit('position', {
        id: auth.id,
        position: data
      });
    };
    return {
      connect: connect,
      position: position
    };
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

    function SwStageController($scope, Tiles, Utils, $rootScope, socket) {
      var tiles, values;
      this.$scope = $scope;
      this.Tiles = Tiles;
      this.Utils = Utils;
      this.$rootScope = $rootScope;
      socket.connect();
      tiles = new Tiles(40, 40);
      values = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]];
      values = [[4, 4, 4, 4, 4], [4, 2, 2, 2, 4], [4, 2, 2, 2, 4], [4, 2, 2, 2, 4], [4, 4, 4, 4, 4]];
      tiles.init(values);
      this.$scope.tiles = tiles;
      this.$scope.$on('socket:position', function() {
        var position, _i, _ref, _results;
        position = (function() {
          _results = [];
          for (var _i = 0, _ref = tiles.rows; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function() {
          return [];
        });
        tiles.data.forEach(function(tile) {
          if (tile.reduced) {
            return;
          }
          return position[tile.m][tile.n] = tile.value;
        });
        return socket.position(position);
      });
      this.$scope.$on('keydown', function(e, val) {
        var status;
        console.log(val.keyCode);
        status = (function() {
          switch (val.keyCode) {
            case 37:
              return tiles.combine('left');
            case 38:
              return tiles.combine('up');
            case 39:
              return tiles.combine('right');
            case 40:
              return tiles.combine('down');
          }
        })();
        if (status.changed) {
          tiles.spawn(10);
        }
        return $rootScope.$apply();
      });
    }

    return SwStageController;

  })();

  sw.controller('swStageCtrl', ['$scope', 'Tiles', 'Utils', '$rootScope', 'socket', SwStageController]);

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
