(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GAME_HEIGHT, GAME_WIDTH, Phaser, create, game, met, metronome, midi, music, player, preload, render, standingStones, tryHit, update, worshippers;

Phaser = require('./phaser');

metronome = require('./metronome');

standingStones = require('./standing-stones');

worshippers = require('./worshippers');

player = require('./player');

midi = require('./midi');

music = require('./music');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

preload = function() {
  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
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
  var drumPad, space;
  standingStones.create(game);
  worshippers.create(game);
  music.create(game);
  met = metronome.create(game);
  player.create(game);
  met.add(standingStones.onBeat);
  met.add(music.onBeat);
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  space.onDown.add(tryHit);
  drumPad = game.input.keyboard.addKey(midi.midi);
  return drumPad.onDown.add(midi.keyController);
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


},{"./metronome":2,"./midi":3,"./music":4,"./phaser":5,"./player":6,"./standing-stones":7,"./worshippers":8}],2:[function(require,module,exports){
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
var AudioContext, activeNotes, btn, btnBox, channel, cmd, context, data, deviceInfoInputs, deviceInfoOutputs, frequencyFromNoteNumber, keyController, keyData, listInputs, log, logger, midi, note, noteOff, noteOn, onMIDIFailure, onMIDIMessage, onMIDISuccess, onStateChange, randomRange, rangeMap, type, velocity;

log = console.log.bind(console);

keyData = document.getElementById('key_data');

deviceInfoInputs = document.getElementById('inputs');

deviceInfoOutputs = document.getElementById('outputs');

midi = void 0;

AudioContext = AudioContext || webkitAudioContext;

context = new AudioContext;

activeNotes = [];

btnBox = document.getElementById('content');

btn = document.getElementsByClassName('button');

data = void 0;

cmd = void 0;

channel = void 0;

type = void 0;

note = void 0;

velocity = void 0;

keyController = function(e) {
  if (e.type === 'keydown') {
    log(e.keycode);
    switch (e.keycode) {
      case 36:
        log("On!");
    }
  } else if (e.type === 'keyup') {
    switch (e.keyCode) {
      case 36:
        log("Off!");
    }
  }
};

onMIDISuccess = function(midiAccess) {
  var input, inputs;
  midi = midiAccess;
  inputs = midi.inputs.values();
  input = inputs.next();
  while (input && !input.done) {
    input.value.onmidimessage = onMIDIMessage;
    listInputs(input);
    input = inputs.next();
  }
  midi.onstatechange = onStateChange;
};

onMIDIMessage = function(event) {
  var gameData;
  data = event.data;
  cmd = data[0] >> 4;
  channel = data[0] & 0xf;
  type = data[0] & 0xf0;
  note = data[1];
  velocity = data[2];
  gameData = {
    note: note
  };
};

onStateChange = function(event) {
  var type;
  var name, port, state;
  port = event.port;
  state = port.state;
  name = port.name;
  type = port.type;
  if (type === 'input') {
    log('name', name, 'port', port, 'state', state);
  }
};

listInputs = function(inputs) {
  var input;
  input = inputs.value;
  log('Input port : [ type:\'' + input.type + '\' id: \'' + input.id + '\' manufacturer: \'' + input.manufacturer + '\' name: \'' + input.name + '\' version: \'' + input.version + '\']');
};

noteOn = function(midiNote, velocity) {};

noteOff = function(midiNote, velocity) {};

onMIDIFailure = function(e) {
  log('No access to MIDI devices or your browser doesn\'t support WebMIDI API. Please use WebMIDIAPIShim ' + e);
};


/* MIDI utility functions
showMIDIPorts = (midiAccess) ->
  inputs = midiAccess.inputs
  outputs = midiAccess.outputs
  html = undefined
  html = '<h4>MIDI Inputs:</h4><div class="info">'
  inputs.forEach (port) ->
    html += '<p>' + port.name + '<p>'
    html += '<p class="small">connection: ' + port.connection + '</p>'
    html += '<p class="small">state: ' + port.state + '</p>'
    html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>'
    if port.version
      html += '<p class="small">version: ' + port.version + '</p>'
    return
  deviceInfoInputs.innerHTML = html + '</div>'
  html = '<h4>MIDI Outputs:</h4><div class="info">'
  outputs.forEach (port) ->
    html += '<p>' + port.name + '<br>'
    html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>'
    if port.version
      html += '<p class="small">version: ' + port.version + '</p>'
    return
  deviceInfoOutputs.innerHTML = html + '</div>'
  return
 */

randomRange = function(min, max) {
  return Math.random() * (max + min) + min;
};

rangeMap = function(x, a1, a2, b1, b2) {
  return (x - a1) / (a2 - a1) * (b2 - b1) + b1;
};

frequencyFromNoteNumber = function(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
};

logger = function(container, label, data) {
  var messages;
  messages = label + ' [channel: ' + (data[0] & 0xf) + ', cmd: ' + (data[0] >> 4) + ', type: ' + (data[0] & 0xf0) + ' , note: ' + data[1] + ' , velocity: ' + data[2] + ']';
};

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert('No MIDI support in your browser.');
}

module.exports = {
  midi: midi,
  keyController: keyController
};


},{}],4:[function(require,module,exports){
var create, game, onBeat;

game = null;

create = function(g) {
  return game = g;
};

onBeat = function(beat) {
  if (beat === 0) {
    return game.sound.play('background');
  }
};

module.exports = {
  create: create,
  onBeat: onBeat
};


},{}],5:[function(require,module,exports){
module.exports = Phaser;


},{}],6:[function(require,module,exports){
var SPEED, create, cursors, getPressedDirections, move, movementScheme, player,
  hasProp = {}.hasOwnProperty;

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

movementScheme = {
  left: {
    dimension: 'x',
    speed: -SPEED
  },
  right: {
    dimension: 'x',
    speed: SPEED
  },
  up: {
    dimension: 'y',
    speed: -SPEED
  },
  down: {
    dimension: 'y',
    speed: SPEED
  }
};

getPressedDirections = function(keys) {
  var direction, key, pressed;
  pressed = (function() {
    var results;
    results = [];
    for (direction in keys) {
      if (!hasProp.call(keys, direction)) continue;
      key = keys[direction];
      if (key.isDown) {
        results.push(direction);
      }
    }
    return results;
  })();
  return pressed;
};

move = function() {
  var divisor, pressed;
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  pressed = getPressedDirections(cursors);
  divisor = pressed.length + 1;
  pressed.forEach(function(direction) {
    var scheme;
    scheme = movementScheme[direction];
    player.body.velocity[scheme.dimension] = scheme.speed / divisor;
    return player.animations.play(direction);
  });
  if (pressed.length === 0) {
    player.animations.stop();
    return player.frame = 4;
  }
};

module.exports = {
  create: create,
  move: move,
  sprite: player
};


},{}],7:[function(require,module,exports){
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


},{"./metronome":2}],8:[function(require,module,exports){
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
