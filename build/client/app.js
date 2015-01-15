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
      console.log('login', user);
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
      this.powerup = null;
      this.meta = {};
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

    function Tiles(rows, cols, status) {
      var _i, _results,
        _this = this;
      this.rows = rows;
      this.cols = cols;
      this.status = status;
      this.combine = __bind(this.combine, this);
      this.cleanReduced = __bind(this.cleanReduced, this);
      this.remove = __bind(this.remove, this);
      this.reducible = __bind(this.reducible, this);
      this.update = __bind(this.update, this);
      this.resetFreeSpace = __bind(this.resetFreeSpace, this);
      this.getFree = __bind(this.getFree, this);
      this.data = [];
      this.freeSpace = [];
      this.maxTiles = this.rows * this.cols;
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
    }

    Tiles.prototype.init = function(values) {
      var _this = this;
      if (!(values.length > 0)) {
        return;
      }
      this.freeSpace.reset();
      if (this.status != null) {
        this.status.reset();
      }
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
            _this.data.push(tile);
            _this.freeSpace[m][n] = false;
            if (_this.status) {
              return _this.status.update(tile);
            }
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
      if (this.data.some(this.canCombine('m'))) {
        return true;
      }
      this.data.sort(this.byColumn);
      if (this.data.some(this.canCombine('n'))) {
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
        if (this.status != null) {
          this.status.changed = true;
          this.status.position[tile.m][tile.n] = null;
          return this.status.max = Math.max.apply(null, this.data.map(function(tile) {
            return tile.value;
          }));
        }
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
        tile = new Tile(m, n);
        tile.value = 2;
        if (_this.status != null) {
          _this.status.update(tile);
        }
        _this.data.push(tile);
        tiles.push(tile);
        return _this.freeSpace[m][n] = false;
      });
      return tiles;
    };

    Tiles.prototype.attachPowerup = function(powerup) {
      var index, tile, valid;
      console.log('attaching powerup');
      valid = this.data.filter(function(tile) {
        return !tile.reduced;
      });
      index = parseInt(Math.random() * valid.length);
      tile = valid[index];
      tile.powerup = powerup;
      return (function(tile, $rootScope) {
        var remove,
          _this = this;
        this.$rootScope = $rootScope;
        remove = function() {
          tile.powerup = null;
          if ($rootScope.$$phase == null) {
            return $rootScope.$apply();
          }
        };
        return setTimeout(remove, tile.powerup.duration);
      })(tile, this.$rootScope);
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
      console.log('tiles combine');
      this.cleanReduced();
      if (this.data.length === this.maxTiles) {
        if (!this.reducible()) {
          console.log('gameover!!');
          if (this.status != null) {
            this.status.changed = true;
            this.status.gameover = true;
          }
          return;
        }
      }
      config = (function() {
        switch (direction) {
          case 'left':
            return {
              sorter: this.byRow,
              lineCount: this.rows,
              lineKey: 'm',
              tileKey: 'n',
              reverse: false,
              start: 0,
              nextIndex: function(val) {
                return val + 1;
              }
            };
          case 'right':
            return {
              sorter: this.byRow,
              lineCount: this.rows,
              lineKey: 'm',
              tileKey: 'n',
              reverse: true,
              start: this.rows - 1,
              nextIndex: function(val) {
                return val - 1;
              }
            };
          case 'up':
            return {
              sorter: this.byColumn,
              lineCount: this.cols,
              lineKey: 'n',
              tileKey: 'm',
              reverse: false,
              start: 0,
              nextIndex: function(val) {
                return val + 1;
              }
            };
          case 'down':
            return {
              sorter: this.byColumn,
              lineCount: this.cols,
              lineKey: 'n',
              tileKey: 'm',
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
      var lineCount, lineKey, nextIndex, reverse, sorted, sorter, start, tileKey, _i, _results,
        _this = this;
      sorter = cfg.sorter, lineCount = cfg.lineCount, lineKey = cfg.lineKey, tileKey = cfg.tileKey, reverse = cfg.reverse, start = cfg.start, nextIndex = cfg.nextIndex;
      this.freeSpace.reset();
      sorted = this.data.slice(0).sort(sorter);
      if (reverse) {
        sorted.reverse();
      }
      if (this.status != null) {
        this.status.reset();
      }
      return (function() {
        _results = [];
        for (var _i = 0; 0 <= lineCount ? _i < lineCount : _i > lineCount; 0 <= lineCount ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function(dimension) {
        var line, lineCursor;
        line = sorted.filter(function(tile) {
          return tile[lineKey] === dimension;
        });
        lineCursor = start;
        return line.forEach(function(tile, i) {
          var next, _ref, _ref1, _ref2;
          if (tile.reduced) {
            return;
          }
          if (tile[tileKey] !== lineCursor) {
            if ((_ref = tile.meta) != null ? _ref.blocked : void 0) {
              lineCursor = tile[tileKey];
            } else {
              tile[tileKey] = lineCursor;
            }
          }
          /*
          Look ahead to next tile and see if it should
          be merged into the current one. If it IS eligible to be
          merged, than reduced=true and will be skipped when
          iterator reaches that tile
          */

          next = line[i + 1];
          if ((next != null) && criteria(tile.value, next.value) && !((_ref1 = next.meta) != null ? _ref1.blocked : void 0) && !((_ref2 = tile.meta) != null ? _ref2.blocked : void 0)) {
            if (_this.status != null) {
              if (next.powerup != null) {
                _this.status.powerups.push(next.powerup);
                next.powerup = null;
                console.log('added powerup', _this.status.powerups);
              }
              if (tile.powerup != null) {
                _this.status.powerups.push(tile.powerup);
                tile.powerup = null;
                console.log('added powerup', _this.status.powerups);
              }
            }
            next.reduced = true;
            next[tileKey] = lineCursor;
            tile.value = tile.value + next.value;
            tile.level = _this.leveler(tile.value);
            if (_this.status != null) {
              _this.status.score = _this.status.score + tile.value;
            }
          }
          _this.freeSpace[tile.m][tile.n] = false;
          if (_this.status != null) {
            _this.status.update(tile);
          }
          return lineCursor = nextIndex(lineCursor);
        });
      });
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
    var add, list, map, powerup, rank, remove, statusKeys, update;
    list = [];
    map = {};
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
        tiles: tiles,
        rank: '',
        message: false,
        status: {}
      };
      list.push(opponent);
      map[data.id] = opponent;
      return console.log('added', list);
    };
    rank = function(data) {
      data.forEach(function(name, i) {
        var j, opponent;
        if (map[name] == null) {
          return;
        }
        opponent = map[name];
        j = list.indexOf(opponent);
        list.splice(j, 1);
        list.push(opponent);
        return opponent.rank = i + 1;
      });
      return $rootScope.$apply();
    };
    statusKeys = ['gameover', 'ready'];
    update = function(data) {
      var opponent;
      console.log('updating opponent', data);
      console.log(map);
      if (!(data.id in map)) {
        add(data);
      }
      opponent = map[data.id];
      opponent.tiles.update(data.status.position);
      statusKeys.forEach(function(d) {
        return opponent.status[d] = data.status[d];
      });
      opponent.message = opponent.status.gameover;
      $rootScope.$apply();
      return console.log(list);
    };
    powerup = function(playerRank, powerupData) {
      var opponent, player, _i, _len;
      player = null;
      console.log(list, playerRank);
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        opponent = list[_i];
        if (opponent.rank === playerRank) {
          player = opponent;
          break;
        }
      }
      if (player == null) {
        return;
      }
      console.log('making powerup for opponent', player.name);
      return {
        id: player.name,
        powerup: powerupData
      };
    };
    remove = function(id) {
      var opponent;
      console.log('removing opponent', id);
      opponent = map[id];
      list.splice(list.indexOf(opponent), 1);
      console.log(list);
      delete map[id];
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

  sw.factory('powerup', function(auth, $rootScope) {
    var apply, create, key, spawn, type, types, val;
    type = {
      REMOVE_MAX: 'remove_max',
      BLOCKER: 'blocker'
    };
    types = (function() {
      var _results;
      _results = [];
      for (key in type) {
        val = type[key];
        _results.push(val);
      }
      return _results;
    })();
    create = function(kind) {
      switch (kind) {
        case type.REMOVE_MAX:
          return {
            type: type.REMOVE_MAX,
            "class": '-powerup-icon -remove-max',
            duration: 5000,
            origin: auth.id() || 'unknown',
            message: "" + (auth.id()) + " removed your max tile!!!",
            label: 'D'
          };
        case type.BLOCKER:
          return {
            type: type.BLOCKER,
            "class": '-powerup-icon -blocker',
            duration: 5000,
            origin: auth.id() || 'unknown',
            message: "" + (auth.id()) + " blocked one of your tiles!!!",
            label: 'B'
          };
      }
    };
    spawn = function(tiles) {
      var generate, index, powerup, powerupType;
      generate = Math.random() * 100;
      if (generate < 1) {
        return;
      }
      index = parseInt(Math.random() * types.length);
      powerupType = types[index];
      powerup = create(powerupType);
      return tiles.attachPowerup(powerup);
    };
    apply = function(data, tiles) {
      var i, index, max, maxes, removeIndex, tile, valid;
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
        case type.BLOCKER:
          valid = tiles.data.filter(function(tile) {
            return !tile.reduced;
          });
          index = parseInt(Math.random() * valid.length);
          tile = valid[index];
          tile.meta.blocked = true;
          return (function(tile) {
            return setTimeout(function() {
              delete tile.meta.blocked;
              if ($rootScope.$$phase == null) {
                return $rootScope.$apply();
              }
            }, 2000);
          })(tile);
      }
    };
    return {
      apply: apply,
      type: type,
      create: create,
      spawn: spawn
    };
  });

}).call(this);

(function() {
  var STATE, sw;

  sw = angular.module('swarm-2048');

  STATE = {
    LOGIN: 'login',
    WAITFORPLAYERS: 'waitForPlayers',
    GAMEPLAY: 'gameplay'
  };

  sw.factory('GameState', function($rootScope) {
    var get, set, state;
    state = {
      login: false,
      waitForPlayers: false,
      gameplay: false
    };
    set = function(val) {
      var key;
      for (key in state) {
        state[key] = false;
      }
      return state[val] = true;
    };
    get = function() {
      var key, val;
      for (key in state) {
        val = state[key];
        if (val) {
          return key;
        }
      }
    };
    return {
      state: state,
      STATE: STATE,
      set: set,
      get: get
    };
  });

}).call(this);

(function() {
  var Status, property, readonly, sw,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  sw = angular.module('swarm-2048');

  property = {
    changed: false,
    position: null,
    rows: null,
    cols: null,
    max: 0,
    high: 0,
    score: 0,
    gameover: false,
    ready: false
  };

  readonly = [];

  Status = (function() {
    function Status($rootScope, GameState, socket) {
      var key, _fn,
        _this = this;
      this.$rootScope = $rootScope;
      this.GameState = GameState;
      this.socket = socket;
      this.broadcast = __bind(this.broadcast, this);
      this.reset = __bind(this.reset, this);
      this.update = __bind(this.update, this);
      this.status = __bind(this.status, this);
      $rootScope.$on('status:set', function(e, options) {
        return console.log(options);
      });
      $rootScope.$on('socket:status', this.broadcast);
      this.powerups = [];
      _fn = function(key) {
        if (__indexOf.call(readonly, key) >= 0) {
          return Object.defineProperty(_this, key, {
            get: function() {
              return property[key];
            },
            enumerable: true
          });
        } else {
          return Object.defineProperty(_this, key, {
            get: function() {
              return property[key];
            },
            set: function(val) {
              return property[key] = val;
            },
            enumerable: true
          });
        }
      };
      for (key in property) {
        _fn(key);
      }
    }

    Status.prototype.status = function() {
      return this.socket.status(property);
    };

    Status.prototype.init = function(rows, cols) {
      property.rows = rows;
      property.cols = cols;
      return this.reset();
    };

    Status.prototype.update = function(tile) {
      if (tile.value == null) {
        return;
      }
      if (property.position[tile.m][tile.n] !== tile.value) {
        property.changed = true;
      }
      property.position[tile.m][tile.n] = tile.value;
      property.max = Math.max(property.max, tile.value);
      return property.high = Math.max(property.max, property.high);
    };

    Status.prototype.reset = function() {
      var _i, _ref, _results;
      property.position = (function() {
        _results = [];
        for (var _i = 0, _ref = property.rows; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(d) {
        return [];
      });
      console.log('reset', property);
      property.max = 0;
      return property.changed = false;
    };

    Status.prototype.broadcast = function() {
      if (this.GameState.get() !== this.GameState.STATE.LOGIN) {
        return this.socket.status(property);
      }
    };

    return Status;

  })();

  sw.factory('status', function($rootScope, GameState, socket) {
    return new Status($rootScope, GameState, socket);
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.factory('socket', function($rootScope, auth, opponents) {
    var connect, identify, powerup, socket, status;
    socket = null;
    connect = function(group) {
      if (group == null) {
        group = 'testing';
      }
      if (socket == null) {
        console.log('connecting socket');
        socket = io();
        if (group != null) {
          socket.emit('joinGroup', group);
        }
        socket.on('addPlayers', function(data) {
          return $rootScope.$broadcast('socket:addPlayers', data);
        });
        socket.on('updatePlayers', function(data) {
          console.log('UPDATE PLAYERS');
          opponents.update(data);
          return $rootScope.$broadcast('socket:updatePlayers', data);
        });
        socket.on('allReady', function(data) {
          console.log('ALL READY');
          return $rootScope.$broadcast('socket:allReady');
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
      return auth.login($scope.username);
    };
  });

}).call(this);

(function() {
  var SwStageController, sw;

  sw = angular.module('swarm-2048');

  SwStageController = (function() {
    var grid;

    grid = null;

    function SwStageController($scope, Tiles, Utils, $rootScope, socket, opponents, powerup, auth, GameState, status, $window) {
      var tiles, values,
        _this = this;
      this.$scope = $scope;
      this.Tiles = Tiles;
      this.Utils = Utils;
      this.$rootScope = $rootScope;
      this.status = status;
      GameState.set(GameState.STATE.LOGIN);
      this.status.init(4, 4);
      tiles = new Tiles(4, 4, this.status);
      values = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]];
      values = [[4, 4, 4, 4, 4], [4, 2, 2, 2, 4], [4, 2, 2, 2, 4], [4, 2, 2, 2, 4], [4, 4, 4, 4, 4]];
      tiles.init(values);
      this.$scope.tiles = tiles;
      this.$scope.opponents = opponents.list;
      this.$scope.state = GameState.state;
      this.$scope.wait = {
        ready: false
      };
      this.$scope.powerups = this.status.powerups;
      this.$scope.logs = [];
      this.$scope.$watch((function() {
        return auth.id();
      }), function(val) {
        if (val != null) {
          console.log('logging in', val);
          GameState.set(GameState.STATE.WAITFORPLAYERS);
          socket.connect();
          socket.identify();
          return _this.$scope.name = auth.id();
        }
      });
      this.$scope.$on('socket:allReady', function() {
        return GameState.set(GameState.STATE.GAMEPLAY);
      });
      this.$scope.$watch((function() {
        return _this.status.score;
      }), function(val) {
        return _this.$scope.score = val;
      });
      this.$scope.$on('socket:applyPowerup', function(e, data) {
        console.log('applying powerup', data);
        powerup.apply(data, tiles);
        _this.$scope.logs.push({
          id: _this.$scope.logs.length,
          text: data.message
        });
        _this.status.broadcast();
        return $rootScope.$apply();
      });
      this.$scope.$on('socket:rank', function(e, rank) {
        return _this.$scope.rank = rank;
      });
      this.$scope.$on((function() {
        return _this.status.gameover;
      }), function(val) {
        if (val) {
          this.$scope.gameover = true;
          return this.$scope.loser = true;
        }
      });
      this.$scope.$on('keydown', function(e, val) {
        var index, keyCode, newTiles, powerupData, targetedPowerup;
        keyCode = val.keyCode;
        if (GameState.get() !== GameState.STATE.GAMEPLAY) {
          return;
        }
        if (keyCode > 47 && keyCode < 58) {
          index = keyCode - 48;
          if (index < 1) {
            index = 10;
          }
          powerupData = powerup.create(powerup.type.BLOCKER);
          targetedPowerup = opponents.powerup(index, powerupData);
          console.log(targetedPowerup);
          if (targetedPowerup != null) {
            socket.powerup(targetedPowerup);
          }
          return;
        }
        if (!status.gameover) {
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
          console.log(status);
          if (status.changed) {
            console.log('status changed');
            newTiles = tiles.spawn(1);
            newTiles.forEach(function(tile) {
              console.log('status position', status.position);
              return status.position[tile.m][tile.n] = tile.value;
            });
            powerup.spawn(tiles);
            status.broadcast();
          }
        }
        return $rootScope.$apply();
      });
    }

    return SwStageController;

  })();

  sw.controller('swStageCtrl', ['$scope', 'Tiles', 'Utils', '$rootScope', 'socket', 'opponents', 'powerup', 'auth', 'GameState', 'status', '$window', SwStageController]);

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw = sw.controller('swTileCtrl', function($scope, $animate, powerup) {
    $scope.tile.$scope = $scope;
    $scope.style = function() {
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
    $scope.meta = function() {
      if ($scope.tile.meta == null) {
        return null;
      }
      if ($scope.tile.meta.blocked) {
        return ["_meta", "-blocked"];
      }
      return [];
    };
    return $scope.powerup = function() {
      if ($scope.tile.powerup == null) {
        return null;
      }
      switch ($scope.tile.powerup.type) {
        case powerup.type.REMOVE_MAX:
          return ["_powerup", "-remove-max"];
        case powerup.type.BLOCKER:
          return ["_powerup", "-blocker"];
      }
    };
  });

}).call(this);

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.controller('swWaitingCtrl', function($scope, auth, socket, opponents, status) {
    $scope.$watch((function() {
      return auth.id();
    }), function(val) {
      return $scope.username = auth.id();
    });
    $scope.opponents = opponents.list;
    $scope.wait = {
      ready: false
    };
    $scope.$watch('wait.ready', function(val) {
      console.log('ready', val);
      status.ready = val;
      status.changed = true;
      return status.broadcast();
    });
    return $scope.toggle = function() {
      return $scope.wait.ready = $scope.wait.ready ? false : true;
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

  sw.directive('swFocus', function($timeout) {
    return {
      scope: {
        trigger: '@swFocus'
      },
      restrict: 'A',
      link: function(scope, element) {
        return scope.$watch('trigger', function(val) {
          if (val === 'true') {
            return $timeout(function() {
              return element[0].focus();
            });
          }
        });
      }
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

(function() {
  var sw;

  sw = angular.module('swarm-2048');

  sw.directive('swWaiting', function() {
    return {
      scope: {},
      replace: true,
      restrict: 'EA',
      templateUrl: 'waiting',
      controller: 'swWaitingCtrl'
    };
  });

}).call(this);
