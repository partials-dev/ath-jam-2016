(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GAME_HEIGHT, GAME_WIDTH, Phaser, TEMPO, create, game, preload, render, standingStones, update;

Phaser = require('./phaser');

standingStones = require('./standing-stones');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

TEMPO = 100;

preload = function() {
  game.load.image('standing-stones.fire', 'img/red.png');
  game.load.image('standing-stones.wood', 'img/green.png');
  game.load.image('standing-stones.water', 'img/blue.png');
  return game.load.image('standing-stones.metal', 'img/silver.png');
};

create = function() {
  return standingStones.create(game);
};

update = function() {};

render = function() {};

game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});


},{"./phaser":2,"./standing-stones":3}],2:[function(require,module,exports){
module.exports = Phaser;


},{}],3:[function(require,module,exports){
var create, params;

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


},{}]},{},[1]);
