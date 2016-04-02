(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GAME_HEIGHT, GAME_WIDTH, Phaser, create, game, met, metronome, player, preload, render, standingStones, tryHit, update, worshippers;

Phaser = require('./phaser');

metronome = require('./metronome');

standingStones = require('./standing-stones');

worshippers = require('./worshippers');

player = require('./player');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

preload = function() {
  game.load.spritesheet('worshipper', 'img/silver.bmp', 1, 1);
  game.load.spritesheet('worshipper.elder', 'img/red.bmp', 1, 1);
  game.load.spritesheet('standing-stone.fire', 'img/fire-stone.bmp', 8, 8);
  game.load.spritesheet('standing-stone.wood', 'img/wood-stone.bmp', 8, 8);
  game.load.spritesheet('standing-stone.water', 'img/water-stone.bmp', 8, 8);
  game.load.spritesheet('standing-stone.metal', 'img/metal-stone.bmp', 8, 8);
  game.load.spritesheet('player', 'img/green.bmp', 1, 1);
  return game.load.audio('background', 'sound/test.mp3');
};

met = null;

tryHit = function() {
  if (metronome.isHit()) {
    return worshippers.cast();
  }
};

create = function() {
  var space;
  standingStones.create(game);
  worshippers.create(game);
  met = metronome.create(game);
  met.add(standingStones.onBeat);
  met.add(function(beat) {
    if (beat === 0) {
      return game.sound.play('background');
    }
  });
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  space.onDown.add(tryHit);
  return player.create(game);
};

update = function() {
  worshippers.move(metronome.progressThroughMeasure());
  return player.move();
};

render = function() {};

game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});


},{"./metronome":2,"./phaser":3,"./player":4,"./standing-stones":5,"./worshippers":6}],2:[function(require,module,exports){
var beat, beatDuration, create, isHit, lastBeatAt, lastMeasureStartedAt, msToClosestBeat, nextBeatAt, nextMeasureStartsAt, progressThroughMeasure, tempo;

tempo = 100;

beatDuration = 60000 / tempo;

lastBeatAt = null;

lastMeasureStartedAt = null;

beat = 0;

create = function(game) {
  var met, updateBeat;
  met = new Phaser.Signal();
  updateBeat = function() {
    met.dispatch(beat);
    lastBeatAt = performance.now();
    if (beat === 0) {
      lastMeasureStartedAt = performance.now();
    }
    if (beat === 3) {
      return beat = 0;
    } else {
      return beat++;
    }
  };
  game.time.events.loop(beatDuration, updateBeat);
  return met;
};

nextBeatAt = function() {
  return lastBeatAt + beatDuration;
};

nextMeasureStartsAt = function() {
  return lastMeasureStartedAt + (beatDuration * 4);
};

progressThroughMeasure = function() {
  var measureDuration, positionInMeasure;
  measureDuration = nextMeasureStartsAt() - lastMeasureStartedAt;
  positionInMeasure = performance.now() - lastMeasureStartedAt;
  return positionInMeasure / measureDuration;
};

msToClosestBeat = function(offset) {
  var now, toLast, toNext;
  now = performance.now() + offset;
  toLast = now - lastBeatAt;
  toNext = now - nextBeatAt();
  if (Math.abs(toNext) < Math.abs(toLast)) {
    return toNext;
  } else {
    return toLast;
  }
};

isHit = function() {
  var ms;
  ms = msToClosestBeat(0);
  return Math.abs(ms) < beatDuration / 6;
};

module.exports = {
  create: create,
  beatDuration: beatDuration,
  nextBeatAt: nextBeatAt,
  lastBeatAt: function() {
    return lastBeatAt;
  },
  lastMeasureStartedAt: function() {
    return lastMeasureStartedAt;
  },
  nextMeasureStartsAt: nextMeasureStartsAt,
  progressThroughMeasure: progressThroughMeasure,
  msToClosestBeat: msToClosestBeat,
  isHit: isHit
};


},{}],3:[function(require,module,exports){
module.exports = Phaser;


},{}],4:[function(require,module,exports){
var SPEED, create, cursors, move, player;

player = null;

cursors = null;

SPEED = 300;

create = function(game) {
  player = game.add.sprite(200, 200, 'player');
  player.scale.set(50, 50);
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1, 2], 10, true);
  player.animations.add('right', [3, 4, 5], 10, true);
  return cursors = game.input.keyboard.createCursorKeys();
};

move = function() {
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  if (cursors.left.isDown) {
    player.body.velocity.x = -SPEED;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = SPEED;
    player.animations.play('right');
  } else if (cursors.up.isDown) {
    player.body.velocity.y = -SPEED;
    player.animations.play('up');
  } else if (cursors.down.isDown) {
    player.body.velocity.y = SPEED;
    player.animations.play('down');
  } else {
    player.animations.stop();
    player.frame = 4;
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -350;
  }
  return console.log('created player');
};

module.exports = {
  create: create,
  move: move
};


},{}],5:[function(require,module,exports){
var create, metronome, onBeat, onCast, params, standingStones;

metronome = require('./metronome');

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

standingStones = null;

create = function(game) {
  standingStones = game.add.group();
  params.forEach(function(p) {
    var stone;
    stone = standingStones.create(p.x, p.y, p.sprite, 1);
    stone.scale.setTo(0.025, 0.025);
    stone.animations.add('beat', [2, 1], 4, false);
    return stone.animations.add('cast', [3, 1], 4, false);
  });
  standingStones.scale.set(300, 300);
  return standingStones;
};

onBeat = function(beat) {
  return standingStones.children[beat].animations.play('beat');
};

onCast = function(beat) {
  return standingStones.children[beat].animation.play('cast');
};

module.exports = {
  create: create,
  onBeat: onBeat,
  onCast: onCast
};


},{"./metronome":2}],6:[function(require,module,exports){
var cast, create, embiggen, i, metronome, move, params, toX, whichSprite, worshippers;

metronome = require('./metronome');

whichSprite = function(i) {
  if (i === 2) {
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
      x: Math.sin(toX(i)),
      y: Math.cos(toX(i)),
      sprite: whichSprite(i)
    });
  }
  return results;
})();

worshippers = null;

create = function(game) {
  worshippers = game.add.group();
  params.forEach(function(p) {
    var worshipper;
    worshipper = worshippers.create(p.x, p.y, p.sprite, 1);
    worshipper.scale.set(0.5, 0.5);
    if (p.sprite === 'worshipper.elder') {
      return worshipper.animations.add('cast', [3, 1], 5, false);
    }
  });
  worshippers.pivot.set(0, 0);
  worshippers.scale.set(100, 100);
  return worshippers.position.set(170, 160);
};

move = function(i) {
  var angle;
  angle = i * 360;
  worshippers.angle = angle;
  if (metronome.isHit()) {
    worshippers.scale.set(110, 110);
  } else {
    worshippers.scale.set(90, 90);
  }
  return worshippers.forEach(function(worshipper) {
    return worshipper.angle = -angle;
  });
};

embiggen = true;

cast = function() {
  var elder;
  elder = worshippers.children[2];
  return elder.animations.play('cast', false);
};

module.exports = {
  create: create,
  move: move,
  cast: cast
};


},{"./metronome":2}]},{},[1]);
