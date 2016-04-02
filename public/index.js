(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var cast, create, currentMeasure, duplicates, game, load, measureMoved, moveMeasure, onBeat, player, previousMeasure, standingStones, summon;

standingStones = require('./standing-stones');

player = require('./player');

previousMeasure = [false, false, false, false];

currentMeasure = [];

game = null;

load = function(game) {
  game.load.spritesheet('duplicate.fire', 'img/red.bmp', 1, 1);
  game.load.spritesheet('duplicate.water', 'img/blue.bmp', 1, 1);
  game.load.spritesheet('duplicate.earth', 'img/green.bmp', 1, 1);
  return game.load.spritesheet('duplicate.wind', 'img/silver.bmp', 1, 1);
};

duplicates = null;

create = function(g) {
  game = g;
  return duplicates = game.add.group();
};

measureMoved = false;

moveMeasure = function() {
  measureMoved = true;
  previousMeasure = currentMeasure;
  return currentMeasure = [false, false, false, false];
};

onBeat = function(beat) {
  if (beat === 3) {
    measureMoved = false;
  }
  if (beat === 0 && !measureMoved) {
    return moveMeasure();
  }
};

cast = function(closestBeat, msToBeat) {
  var element;
  if (closestBeat === 0 && msToBeat < 0) {
    moveMeasure();
  }
  currentMeasure[closestBeat] = true;
  if (previousMeasure[closestBeat]) {
    element = standingStones.spriteKeys[closestBeat].split('.')[1];
    return summon(element);
  }
};

summon = function(element) {
  var dup, playerPosition;
  playerPosition = player.sprite().body.position;
  dup = duplicates.create(playerPosition.x, playerPosition.y, "duplicate." + element, 1);
  return dup.scale.set(50, 50);
};

module.exports = {
  cast: cast,
  onBeat: onBeat,
  load: load,
  create: create
};


},{"./player":7,"./standing-stones":8}],2:[function(require,module,exports){
var GAME_HEIGHT, GAME_WIDTH, Phaser, create, duplicates, game, met, metronome, midi, music, player, preload, render, standingStones, update, worshippers;

Phaser = require('./phaser');

metronome = require('./metronome');

standingStones = require('./standing-stones');

worshippers = require('./worshippers');

player = require('./player');

midi = require('./midi');

music = require('./music');

duplicates = require('./duplicates');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

preload = function() {
  game.load.spritesheet('worshipper', 'img/silver.bmp', 1, 1);
  game.load.spritesheet('worshipper.elder', 'img/red.bmp', 1, 1);
  standingStones.load(game);
  game.load.spritesheet('player', 'img/green.bmp', 1, 1);
  duplicates.load(game);
  return game.load.audio('background', 'sound/test.mp3');
};

met = null;

create = function() {
  standingStones.create(game);
  worshippers.create(game);
  music.create(game);
  met = metronome.create(game);
  player.create(game);
  duplicates.create(game);
  met.add(standingStones.onBeat);
  met.add(music.onBeat);
  met.add(duplicates.onBeat);
  player.onCast.add(worshippers.cast);
  return player.onCast.add(duplicates.cast);
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


},{"./duplicates":1,"./metronome":3,"./midi":4,"./music":5,"./phaser":6,"./player":7,"./standing-stones":8,"./worshippers":9}],3:[function(require,module,exports){
var beat, beatDuration, closestBeat, create, isHit, lastBeatAt, lastMeasureStartedAt, nextBeat, nextBeatAt, nextMeasureStartsAt, progressThroughMeasure, tempo;

tempo = 100;

beatDuration = 60000 / tempo;

lastBeatAt = null;

lastMeasureStartedAt = null;

beat = -1;

nextBeat = function() {
  if (beat === 3) {
    return 0;
  } else {
    return beat + 1;
  }
};

create = function(game) {
  var met, updateBeat;
  met = new Phaser.Signal();
  updateBeat = function() {
    beat = nextBeat();
    met.dispatch(beat);
    lastBeatAt = performance.now();
    if (beat === 0) {
      return lastMeasureStartedAt = lastBeatAt;
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

closestBeat = function(offset) {
  var now, toLast, toNext;
  if (offset == null) {
    offset = 0;
  }
  now = performance.now() + offset;
  toLast = now - lastBeatAt;
  toNext = now - nextBeatAt();
  if (Math.abs(toNext) < Math.abs(toLast)) {
    return {
      beat: nextBeat(),
      ms: toNext
    };
  } else {
    return {
      beat: beat,
      ms: toLast
    };
  }
};

isHit = function() {
  var closest;
  closest = closestBeat();
  if (Math.abs(closest.ms) < beatDuration / 6) {
    return [closest.beat, closest.ms];
  }
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
  closestBeat: closestBeat,
  isHit: isHit
};


},{}],4:[function(require,module,exports){
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
  data = event.data;
  cmd = data[0] >> 4;
  channel = data[0] & 0xf;
  type = data[0] & 0xf0;
  note = data[1];
  velocity = data[2];
  log('MIDI data', data);
  switch (type) {
    case 144:
      noteOn(note, velocity);
      break;
    case 128:
      noteOff(note, velocity);
  }
  log('data', data, 'cmd', cmd, 'channel', channel);
  logger(keyData, 'key data', data);
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

document.addEventListener('keydown', keyController);

document.addEventListener('keyup', keyController);

module.exports;


},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
module.exports = Phaser;


},{}],7:[function(require,module,exports){
var SPEED, cast, create, cursors, getPressedDirections, metronome, move, movementScheme, onCast, player,
  hasProp = {}.hasOwnProperty;

metronome = require('./metronome');

player = null;

cursors = null;

SPEED = 300;

onCast = new Phaser.Signal();

cast = function() {
  var hitInfo;
  hitInfo = metronome.isHit();
  if (hitInfo != null) {
    return onCast.dispatch.apply(onCast, hitInfo);
  }
};

create = function(game) {
  var space;
  player = game.add.sprite(200, 200, 'player');
  player.scale.set(50, 50);
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1, 2], 10, true);
  player.animations.add('right', [3, 4, 5], 10, true);
  cursors = game.input.keyboard.createCursorKeys();
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  return space.onDown.add(cast);
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
  sprite: function() {
    return player;
  },
  onCast: onCast
};


},{"./metronome":3}],8:[function(require,module,exports){
var create, load, metronome, onBeat, onCast, params, spriteKeys, standingStones;

metronome = require('./metronome');

params = [
  {
    x: 0.5,
    y: 0,
    sprite: 'standing-stone.fire',
    img: 'img/fire-stone.bmp'
  }, {
    x: 1,
    y: 0.5,
    sprite: 'standing-stone.wind',
    img: 'img/metal-stone.bmp'
  }, {
    x: 0.5,
    y: 1,
    sprite: 'standing-stone.earth',
    img: 'img/wood-stone.bmp'
  }, {
    x: 0,
    y: 0.5,
    sprite: 'standing-stone.water',
    img: 'img/water-stone.bmp'
  }
];

spriteKeys = params.map(function(p) {
  return p.sprite;
});

standingStones = null;

load = function(game) {
  return params.forEach(function(p) {
    return game.load.spritesheet(p.sprite, p.img, 8, 8);
  });
};

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
  load: load,
  onBeat: onBeat,
  onCast: onCast,
  spriteKeys: spriteKeys
};


},{"./metronome":3}],9:[function(require,module,exports){
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
  return worshippers.forEach(function(worshipper) {
    return worshipper.angle = -angle;
  });
};

embiggen = true;

cast = function(closestBeat, msToBeat) {
  var elder;
  elder = worshippers.children[2];
  return elder.animations.play('cast', false);
};

module.exports = {
  create: create,
  move: move,
  cast: cast
};


},{"./metronome":3}]},{},[2]);
