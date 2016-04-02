(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GAME_HEIGHT, GAME_WIDTH, Phaser, create, game, metronome, preload, render, standingStones, update;

Phaser = require('./phaser');

metronome = require('./metronome');

standingStones = require('./standing-stones');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

preload = function() {
  game.load.spritesheet('standing-stones.fire', 'img/red.bmp', 1, 1);
  game.load.spritesheet('standing-stones.wood', 'img/green.bmp', 1, 1);
  game.load.spritesheet('standing-stones.water', 'img/blue.bmp', 1, 1);
  return game.load.spritesheet('standing-stones.metal', 'img/silver.bmp', 1, 1);
};

create = function() {
  var met;
  standingStones.create(game);
  met = metronome.metronome(game);
  met.add(metronome.shoutBeat);
  return met.add(standingStones.onBeat);
};

update = function() {};

render = function() {};

game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});


},{"./metronome":2,"./phaser":3,"./standing-stones":4}],2:[function(require,module,exports){
var metronome, shoutBeat, tempo, tempoMilliseconds;

tempo = 120;

tempoMilliseconds = 60000 / tempo;

metronome = function(game) {
  var beat, met, updateBeat;
  beat = 0;
  met = new Phaser.Signal();
  updateBeat = function() {
    met.dispatch(beat);
    if (beat === 3) {
      return beat = 0;
    } else {
      return beat++;
    }
  };
  game.time.events.loop(tempoMilliseconds, updateBeat);
  return met;
};

shoutBeat = function(beat) {
  return console.log(beat + 1);
};

module.exports = {
  metronome: metronome,
  shoutBeat: shoutBeat
};


},{}],3:[function(require,module,exports){
module.exports = Phaser;


},{}],4:[function(require,module,exports){
var create, onBeat, onCast, params, standingStones;

params = [
  {
    x: 0.5,
    y: 0,
    sprite: 'standing-stones.fire'
  }, {
    x: 1,
    y: 0.5,
    sprite: 'standing-stones.metal'
  }, {
    x: 0.5,
    y: 1,
    sprite: 'standing-stones.wood'
  }, {
    x: 0,
    y: 0.5,
    sprite: 'standing-stones.water'
  }
];

standingStones = null;

create = function(game) {
  standingStones = game.add.group();
  params.forEach(function(p) {
    var stone;
    stone = standingStones.create(p.x, p.y, p.sprite, 1);
    stone.scale.setTo(0.5, 0.5);
    stone.animations.add('beat', [2, 1], 4, false);
    return stone.animations.add('cast', [3, 1], 4, false);
  });
  standingStones.scale.set(100, 100);
  return standingStones;
};

onBeat = function(beat) {
  return standingStones.children[beat].animations.play('beat');
};

onCast = function() {
  return standingStones.children[beat].animation.play('cast');
};

module.exports = {
  create: create,
  onBeat: onBeat,
  onCast: onCast
};


},{}]},{},[1]);
