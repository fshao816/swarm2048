(function() {
  var sw;

  sw = angular.module('swarm-2048', ['ngAnimate']);

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.factory('auth', function() {
    var id, login, userId;
    userId = null;
    id = function() {
      return userId;
    };
    login = function(user) {
      return userId = user;
    };
    return {
      id: id,
      login: login
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
    var criteria, maxCols, maxRows;

    maxRows = 0;

    maxCols = 0;

    criteria = MODE.NORMAL;

    Tiles.prototype.getFree = function() {
      var result;
      result = [];
      Array.prototype.forEach.call(this.freeSpace, function(row, m) {
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

    Tiles.prototype.resetFreeSpace = function() {
      return Array.prototype.forEach.call(this.freeSpace, function(row) {
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

    function Tiles(rows, cols) {
      var _i, _j, _ref, _results, _results1,
        _this = this;
      this.rows = rows;
      this.cols = cols;
      this.combine = __bind(this.combine, this);
      this.cleanReduced = __bind(this.cleanReduced, this);
      this.remove = __bind(this.remove, this);
      this.reducible = __bind(this.reducible, this);
      this.update = __bind(this.update, this);
      this.resetStatus = __bind(this.resetStatus, this);
      this.updateStatus = __bind(this.updateStatus, this);
      this.resetFreeSpace = __bind(this.resetFreeSpace, this);
      this.getFree = __bind(this.getFree, this);
      this.data = [];
      this.freeSpace = [];
      (function() {
        _results = [];
        for (var _i = 0; 0 <= rows ? _i < rows : _i > rows; 0 <= rows ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function() {
        var _i, _results;
        return _this.freeSpace.push((function() {
          _results = [];
          for (var _i = 0; 0 <= cols ? _i < cols : _i > cols; 0 <= cols ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function() {
          return true;
        }));
      });
      this.freeSpace.reset = this.resetFreeSpace;
      this.freeSpace.free = this.getFree;
      this.status = {
        changed: false,
        position: (function() {
          _results1 = [];
          for (var _j = 0, _ref = this.rows; 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
          return _results1;
        }).apply(this).map(function(d) {
          return [];
        }),
        rows: this.rows,
        cols: this.cols,
        max: 0,
        high: 0
      };
    }

    Tiles.prototype.updateStatus = function(tile) {
      if (tile.value == null) {
        return;
      }
      this.status.position[tile.m][tile.n] = tile.value;
      this.status.changed = true;
      this.status.max = Math.max(this.status.max, tile.value);
      return this.status.high = Math.max(this.status.max, this.status.high);
    };

    Tiles.prototype.resetStatus = function() {
      var _i, _ref, _results;
      this.status.position = (function() {
        _results = [];
        for (var _i = 0, _ref = this.rows; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(d) {
        return [];
      });
      this.status.max = 0;
      return this.status.changed = false;
    };

    Tiles.prototype.init = function(values) {
      var _this = this;
      if (!(values.length > 0)) {
        return;
      }
      this.freeSpace.reset();
      this.resetStatus();
      return values.forEach(function(row, m) {
        if (!(row instanceof Array)) {
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
            _this.updateStatus(tile);
            _this.data.push(tile);
            return _this.freeSpace[m][n] = false;
          }
        });
      });
    };

    Tiles.prototype.update = function(values) {
      this.data = [];
      return this.init(values);
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

    Tiles.prototype.remove = function(tile) {
      var index;
      if (tile instanceof Tile) {

      } else {
        index = tile;
        tile = this.data[index];
        this.data.splice(index, 1);
        this.status.changed = true;
        this.status.position[tile.m][tile.n] = null;
        return this.status.max = Math.max.apply(null, this.data.map(function(tile) {
          return tile.value;
        }));
      }
    };

    Tiles.prototype.spawn = function(num) {
      var free, tiles, _i, _results,
        _this = this;
      if (num == null) {
        num = 1;
      }
      free = this.freeSpace.free();
      tiles = [];
      (function() {
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
        console.log('spawn', m, n);
        tile = new Tile(m, n);
        tile.value = 2;
        _this.updateStatus(tile);
        _this.data.push(tile);
        tiles.push(tile);
        return _this.freeSpace[m][n] = false;
      });
      return tiles;
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
      var lineProperty, lines, nextIndex, reverse, sorted, sorter, start, tileProperty, _i, _results,
        _this = this;
      sorter = cfg.sorter, lines = cfg.lines, lineProperty = cfg.lineProperty, tileProperty = cfg.tileProperty, reverse = cfg.reverse, start = cfg.start, nextIndex = cfg.nextIndex;
      this.freeSpace.reset();
      sorted = this.data.slice(0).sort(sorter);
      if (reverse) {
        sorted.reverse();
      }
      this.resetStatus();
      (function() {
        _results = [];
        for (var _i = 0; 0 <= lines ? _i < lines : _i > lines; 0 <= lines ? _i++ : _i--){ _results.push(_i); }
        return _results;
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
            _this.status.changed = true;
            tile[tileProperty] = current;
          }
          next = line[i + 1];
          if ((next != null) && criteria(tile.value, next.value)) {
            _this.status.changed = true;
            next.reduced = true;
            next[tileProperty] = current;
            tile.value = tile.value + next.value;
            tile.level = _this.leveler(tile.value);
          }
          _this.freeSpace[tile.m][tile.n] = false;
          _this.status.position[tile.m][tile.n] = tile.value;
          _this.status.max = Math.max(_this.status.max, tile.value);
          _this.status.high = Math.max(_this.status.high, _this.status.max);
          return current = nextIndex(current);
        });
      });
      return this.status;
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
    var add, dict, list, powerup, rank, remove, update;
    list = [];
    dict = {};
    add = function(data) {
      var cols, opponent, position, rows, tiles;
      console.log('adding opponent', data);
      position = data.status.position;
      rows = data.status.rows || 5;
      cols = data.status.cols || 5;
      tiles = new Tiles(rows, cols);
      tiles.init(position);
      opponent = {
        name: data.id,
        tiles: tiles
      };
      list.push(opponent);
      dict[data.id] = opponent;
      return console.log('added', list);
    };
    rank = function(data) {
      data.forEach(function(name) {
        var i, opponent;
        if (dict[name] == null) {
          return;
        }
        opponent = dict[name];
        i = list.indexOf(opponent);
        list.splice(i, 1);
        return list.push(opponent);
      });
      return $rootScope.$apply();
    };
    update = function(data) {
      console.log('updating opponent', data);
      console.log(dict);
      if (!(data.id in dict)) {
        add(data);
      }
      dict[data.id].tiles.update(data.status.position);
      $rootScope.$apply();
      return console.log(list);
    };
    powerup = function(playerIndex, powerupData) {
      console.log('making powerup for opponent', list[playerIndex].name);
      return {
        id: list[playerIndex].name,
        powerup: powerupData
      };
    };
    remove = function(id) {
      var opponent;
      console.log('removing opponent', id);
      opponent = dict[id];
      list.splice(list.indexOf(opponent), 1);
      console.log(list);
      delete dict[id];
      return $rootScope.$apply();
    };
    return {
      list: list,
      update: update,
      remove: remove,
      add: add,
      powerup: powerup,
      rank: rank
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.factory('powerup', function() {
    var apply, create, type;
    type = {
      REMOVE_MAX: 'remove_max',
      BLOCKER: 'blocker'
    };
    create = function(kind) {
      switch (kind) {
        case type.REMOVE_MAX:
          return {
            type: type.REMOVE_MAX
          };
        case type.BLOCKER:
          return {
            type: type.BLOCKER
          };
      }
    };
    apply = function(data, tiles) {
      var i, max, maxes, removeIndex, valid;
      if (data.type == null) {
        return;
      }
      switch (data.type) {
        case type.REMOVE_MAX:
          valid = tiles.data.filter(function(tile) {
            return !tile.reduced;
          });
          max = Math.max.apply(null, valid.map(function(tile) {
            return tile.value;
          }));
          maxes = valid.filter(function(tile) {
            return tile.value === max;
          });
          i = parseInt(Math.random() * maxes.length);
          removeIndex = tiles.data.indexOf(maxes[i]);
          return tiles.remove(removeIndex);
      }
    };
    return {
      apply: apply,
      type: type,
      create: create
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.factory('socket', function($rootScope, auth, opponents) {
    var connect, identify, powerup, socket, status;
    socket = null;
    connect = function() {
      if (socket == null) {
        socket = io();
        socket.on('addPlayers', function(data) {
          return $rootScope.$broadcast('socket:addPlayers', data);
        });
        socket.on('updatePlayers', function(data) {
          opponents.update(data);
          return $rootScope.$broadcast('socket:updatePlayers', data);
        });
        socket.on('identify', function() {
          if (auth.id() != null) {
            return identify();
          }
        });
        socket.on('status', function() {
          console.log('socket position');
          return $rootScope.$broadcast('socket:status');
        });
        socket.on('ranking', function(data) {
          var rank;
          opponents.rank(data);
          rank = (data.indexOf(auth.id())) + 1;
          if (rank > 0) {
            return $rootScope.$broadcast('socket:rank', rank);
          }
        });
        socket.on('disconnect', function(id) {
          opponents.remove(id);
          return $rootScope.$broadcast('socket:disconnect', id);
        });
        return socket.on('applyPowerup', function(data) {
          return $rootScope.$broadcast('socket:applyPowerup', data);
        });
      }
    };
    identify = function() {
      return socket.emit('identify', auth.id());
    };
    status = function(data) {
      return socket.emit('status', {
        id: auth.id(),
        status: data
      });
    };
    powerup = function(data) {
      return socket.emit('powerup', data);
    };
    return {
      connect: connect,
      powerup: powerup,
      status: status,
      identify: identify
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
  var sw;

  sw = angular.module('swarm-2048');

  sw.controller('swLoginCtrl', function($scope, auth, socket) {
    var _this = this;
    $scope.username = '';
    $scope.$on('keydown', function(e, val) {
      if (val.keyCode === 13 && $scope.username !== '') {
        return $scope.submit();
      }
    });
    return $scope.submit = function() {
      auth.login($scope.username);
      return socket.identify();
    };
  });

}).call(this);

(function() {
  var SwStageController, sw;

  sw = angular.module('swarm-2048');

  SwStageController = (function() {
    var grid;

    grid = null;

    function SwStageController($scope, Tiles, Utils, $rootScope, socket, opponents, powerup, auth) {
      var broadcastStatus, tiles, values,
        _this = this;
      this.$scope = $scope;
      this.Tiles = Tiles;
      this.Utils = Utils;
      this.$rootScope = $rootScope;
      socket.connect();
      tiles = new Tiles(4, 4);
      values = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]];
      values = [[4, 4, 4, 4, 4], [4, 2, 2, 2, 4], [4, 2, 2, 2, 4], [4, 2, 2, 2, 4], [4, 4, 4, 4, 4]];
      tiles.init(values);
      this.$scope.tiles = tiles;
      this.$scope.opponents = opponents.list;
      broadcastStatus = function() {
        console.log('sending status:', tiles.status);
        return socket.status(tiles.status);
      };
      this.$scope.$watch((function() {
        return auth.id();
      }), function(val) {
        if (val != null) {
          _this.$scope.loggedIn = true;
          return _this.$scope.name = auth.id();
        }
      });
      this.$scope.$on('socket:status', broadcastStatus);
      this.$scope.$on('socket:applyPowerup', function(e, data) {
        console.log('applying powerup', data);
        powerup.apply(data, tiles);
        broadcastStatus();
        return $rootScope.$apply();
      });
      this.$scope.$on('socket:rank', function(e, rank) {
        return _this.$scope.rank = rank;
      });
      this.$scope.$on('keydown', function(e, val) {
        var index, keyCode, newTiles, powerupData, status;
        console.log(val.keyCode);
        keyCode = val.keyCode;
        if (keyCode > 47 && keyCode < 58) {
          index = keyCode - 49;
          if (index < 0) {
            index = 10;
          }
          powerupData = powerup.create(powerup.type.REMOVE_MAX);
          socket.powerup(opponents.powerup(index, powerupData));
        }
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
        if (status != null ? status.changed : void 0) {
          console.log('status change');
          newTiles = tiles.spawn(1);
          newTiles.forEach(function(tile) {
            return status.position[tile.m][tile.n] = tile.value;
          });
          socket.status(status);
        }
        return $rootScope.$apply();
      });
    }

    return SwStageController;

  })();

  sw.controller('swStageCtrl', ['$scope', 'Tiles', 'Utils', '$rootScope', 'socket', 'opponents', 'powerup', 'auth', SwStageController]);

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

  sw.directive('swLogin', function() {
    return {
      scope: {},
      replace: true,
      restrict: 'EA',
      templateUrl: 'login',
      controller: 'swLoginCtrl'
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
