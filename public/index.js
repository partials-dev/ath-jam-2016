(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GAME_HEIGHT, GAME_WIDTH, Phaser, TEMPO, create, game, i, preload, render, standingStones, update, worshippers;

Phaser = require('./phaser');

standingStones = require('./standing-stones');

worshippers = require('./worshippers');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

TEMPO = 100;

preload = function() {
  game.load.image('standing-stone.fire', 'img/red.png');
  game.load.image('standing-stone.wood', 'img/green.png');
  game.load.image('standing-stone.water', 'img/blue.png');
  game.load.image('standing-stone.metal', 'img/silver.png');
  game.load.image('worshipper', 'img/silver.png');
  return game.load.image('worshipper.elder', 'img/red.png');
};

create = function() {
  return worshippers.create(game);
};

i = 0;

update = function() {
  i += 0.002;
  return worshippers.move(i);
};

render = function() {};

game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});


},{"./phaser":2,"./standing-stones":3,"./worshippers":4}],2:[function(require,module,exports){
module.exports = Phaser;


},{}],3:[function(require,module,exports){
var create, params;

params = [
  {
    x: 0.5,
    y: 0,
    sprite: 'standing-stone.fire'
  }, {
    x: 1,
    y: 0.5,
    sprite: 'standing-stone.metal'
  }, {
    x: 0.5,
    y: 1,
    sprite: 'standing-stone.wood'
  }, {
    x: 0,
    y: 0.5,
    sprite: 'standing-stone.water'
  }
];

create = function(game) {
  var standingStones;
  standingStones = game.add.group();
  params.forEach(function(p) {
    var stone;
    stone = standingStones.create(p.x, p.y, p.sprite);
    return stone.scale.setTo(0.5, 0.5);
  });
  standingStones.scale.set(100, 100);
  return standingStones;
};

module.exports = {
  create: create
};


},{}],4:[function(require,module,exports){
var cast, create, i, move, params, positions, toX, whichSprite, worshippers;

whichSprite = function(i) {
  if (i === 0) {
    return 'worshipper.elder';
  } else {
    return 'worshipper';
  }
};

toX = function(i, period) {
  if (period == null) {
    period = 4;
  }
  return Math.PI * 2 * (i / period);
};

params = (function() {
  var j, results;
  results = [];
  for (i = j = 0; j <= 3; i = ++j) {
    results.push({
      x: Math.cos(toX(i)),
      y: Math.sin(toX(i)),
      sprite: whichSprite(i)
    });
  }
  return results;
})();

positions = (function() {
  var j, results;
  results = [];
  for (i = j = 0; j <= 100; i = ++j) {
    results.push({
      x: Math.cos(toX(i, 100)),
      y: Math.sin(toX(i, 100))
    });
  }
  return results;
})();

worshippers = null;

create = function(game) {
  worshippers = game.add.group();
  params.forEach(function(p) {
    var worshipper;
    worshipper = worshippers.create(p.x, p.y, p.sprite);
    worshipper.scale.set(0.5, 0.5);
    if (p.sprite === 'worshipper.elder') {
      return worshipper.animations.add('cast');
    }
  });
  worshippers.pivot.set(0, 0);
  worshippers.scale.set(100, 100);
  return worshippers.position.set(100, 100);
};

move = function(i) {
  var angle;
  angle = i * 360;
  worshippers.angle = angle;
  return worshippers.forEach(function(worshipper) {
    return worshipper.angle = -angle;
  });
};

cast = function() {
  var elder;
  elder = worshippers.children[0];
  return elder.animations.play('cast', 30, false);
};

module.exports = {
  create: create,
  move: move,
  cast: cast
};


},{}]},{},[1]);
