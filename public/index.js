(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DELAY, GAME_HEIGHT, GAME_WIDTH, Phaser, create, game, preload, update;

Phaser = require('./phaser');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

preload = function() {
  game.load.image('background', 'img/background.png');
  return game.load.image('bmo', 'img/bmo-sad.png');
};

DELAY = 100;

create = function() {
  var i, quarterNote, startTime;
  game.add.sprite(0, 0, 'bmo');
  i = 0;
  quarterNote = function() {
    var currentTime, difference, timeElapsed;
    i++;
    currentTime = performance.now();
    timeElapsed = currentTime - startTime;
    difference = timeElapsed - (i * DELAY);
    return console.log("Difference: " + difference);
  };
  game.time.events.loop(DELAY, quarterNote);
  return startTime = performance.now();
};

update = function() {};

game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});


},{"./phaser":2}],2:[function(require,module,exports){
module.exports = Phaser;


},{}]},{},[1]);
