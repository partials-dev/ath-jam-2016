(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var cast, create, currentMeasure, duplicates, game, load, measureMoved, moveMeasure, onBeat, previousMeasure, spawn, standingStones, summon, summonSignal;

standingStones = require('./standing-stones');

previousMeasure = [false, false, false, false];

currentMeasure = [];

game = null;

summonSignal = new Phaser.Signal();

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
  return summonSignal.dispatch(element);
};

spawn = function(element, position) {
  var dup;
  dup = duplicates.create(position.x, position.y, "duplicate." + element, 1);
  return dup.scale.set(50, 50);
};

module.exports = {
  cast: cast,
  onBeat: onBeat,
  load: load,
  create: create,
  summonSignal: summonSignal,
  spawn: spawn
};


},{"./standing-stones":11}],2:[function(require,module,exports){
var GAME_HEIGHT, GAME_WIDTH, Phaser, create, duplicates, game, met, metronome, moveEnemies, music, player, preload, render, spawnPoints, standingStones, update, worshippers;

Phaser = require('./phaser');

metronome = require('./metronome');

standingStones = require('./standing-stones');

worshippers = require('./worshippers');

player = require('./player');

music = require('./music');

duplicates = require('./duplicates');

spawnPoints = require('./spawn-points');

moveEnemies = require('./move-enemies');

GAME_WIDTH = $(window).width();

GAME_HEIGHT = $(window).height();

preload = function() {
  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  worshippers.load(game);
  player.load(game);
  standingStones.load(game);
  duplicates.load(game);
  moveEnemies.load(game);
  music.load(game);
  return spawnPoints.load(game);
};

met = null;

create = function() {
  standingStones.create(game);
  worshippers.create(game);
  music.create(game);
  met = metronome.create(game);
  player.create(game);
  duplicates.create(game);
  spawnPoints.create(game);
  moveEnemies.create(game);
  met.add(standingStones.onBeat);
  met.add(music.onBeat);
  met.add(duplicates.onBeat);
  player.onCast.add(worshippers.cast);
  player.onCast.add(duplicates.cast);
  return duplicates.summonSignal.add(player.summon);
};

update = function() {
  worshippers.move(metronome.progressThroughMeasure());
  player.move();
  return moveEnemies.update();
};

render = function() {};

game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});


},{"./duplicates":1,"./metronome":4,"./move-enemies":6,"./music":7,"./phaser":8,"./player":9,"./spawn-points":10,"./standing-stones":11,"./worshippers":12}],3:[function(require,module,exports){
var STARTING_BAR_WIDTH, STARTING_MANA, create, currentMana, manaBar, spend, updateBar;

STARTING_BAR_WIDTH = 50;

STARTING_MANA = 100;

currentMana = STARTING_MANA;

manaBar = null;

create = function(game) {
  manaBar = game.add.graphics(50, 50);
  return updateBar(1);
};

updateBar = function(proportion) {
  manaBar.clear();
  manaBar.lineStyle(10, 0x0000ff, 1);
  manaBar.moveTo(0, 0);
  return manaBar.lineTo(STARTING_BAR_WIDTH * proportion, 0);
};

spend = function(amount) {
  var proportion;
  currentMana -= amount;
  if (currentMana < 0) {
    currentMana = 0;
  }
  proportion = currentMana / STARTING_MANA;
  return updateBar(proportion);
};

module.exports = {
  create: create,
  current: function() {
    return currentMana;
  },
  spend: spend
};


},{}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
var AudioContext, activeNotes, btn, btnBox, channel, cmd, context, data, deviceInfoInputs, deviceInfoOutputs, frequencyFromNoteNumber, keyData, listInputs, log, logger, midi, midiMovementState, note, noteOff, noteOn, onMIDIFailure, onMIDIMessage, onMIDISuccess, onStateChange, randomRange, rangeMap, signal, type, velocity;

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

signal = new Phaser.Signal();

midiMovementState = {
  up: {
    isDown: false
  },
  down: {
    isDown: false
  },
  left: {
    isDown: false
  },
  right: {
    isDown: false
  }
};

onMIDIMessage = function(event) {
  var direction, hasKey, noteToDirection;
  data = event.data;
  cmd = data[0] >> 4;
  channel = data[0] & 0xf;
  type = data[0] & 0xf0;
  note = data[1];
  velocity = data[2];
  noteToDirection = {
    49: 'up',
    45: 'down',
    44: 'left',
    46: 'right'
  };
  hasKey = function(obj, key) {
    return Object.keys(obj).indexOf(key) !== -1;
  };
  switch (type) {
    case 144:
      signal.dispatch(note);
      if (hasKey(noteToDirection, JSON.stringify(note))) {
        direction = noteToDirection[note];
        midiMovementState[direction].isDown = true;
        return console.log(direction + midiMovementState[direction].isDown);
      }
      break;
    case 128:
      if (hasKey(noteToDirection, JSON.stringify(note))) {
        direction = noteToDirection[note];
        midiMovementState[direction].isDown = false;
        return console.log(direction + midiMovementState[direction].isDown);
      }
  }
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
  signal: signal,
  movementState: midiMovementState
};


},{}],6:[function(require,module,exports){
var base, bmd, create, enemy, enemyAlive, game, getPath1, getPath2, health, load, path, path1, path2, pathIsVisible, pi, plot, scaleLane, spawn1, spawn2, update;

bmd = null;

enemy = null;

pi = 0;

path = [];

game = null;

health = 10;

pathIsVisible = 1;

base = {
  x: 0.3,
  y: 1
};

spawn1 = {
  x: 0.2,
  y: 0.0
};

spawn2 = {
  x: 1.0,
  y: 0.3
};

path1 = {
  x: [spawn1.x, 0.2, 0.3, 0.3, base.x],
  y: [spawn1.y, 0.3, 0.4, 0.7, base.y]
};

path2 = {
  x: [spawn2.x, 0.3, base.x],
  y: [spawn2.y, 0.3, base.y]
};

getPath1 = function(spawnPosition) {
  return path1;
};

getPath2 = function(spawnPosition) {
  return path2;
};

scaleLane = function(lane) {
  var n;
  lane.x = (function() {
    var j, len, ref, results;
    ref = lane.x;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      n = ref[j];
      results.push(n * game.width);
    }
    return results;
  })();
  lane.y = (function() {
    var j, len, ref, results;
    ref = lane.y;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      n = ref[j];
      results.push(n * game.height);
    }
    return results;
  })();
  return lane;
};

load = function(game) {
  return game.load.spritesheet('enemy', 'img/blue.bmp', 1, 1);
};

create = function(g, s1, s2) {
  game = g;
  bmd = game.add.bitmapData(game.width, game.height);
  spawn1 = s1;
  spawn2 = s2;
  bmd.addToWorld();
  enemy = game.add.sprite(0, 0, 'enemy');
  enemy.scale.set(50, 50);
  enemy.anchor.set(0.5);
  enemy.damage = 2;
  enemy.speed = 10;
  plot(path1);
  return plot(path2);
};

plot = function(lane) {
  var i, p, px, py, x;
  bmd.clear();
  path = [];
  x = 1 / game.width;
  i = 0;
  scaleLane(lane);
  while (i <= 1) {
    px = game.math.catmullRomInterpolation(lane.x, i);
    py = game.math.catmullRomInterpolation(lane.y, i);
    path.push({
      x: px,
      y: py
    });
    bmd.rect(px, py, 1, 1, "rgba(255, 255, 255, " + pathIsVisible + ")");
    i += x;
  }
  p = 0;
  while (p < lane.x.length) {
    bmd.rect(lane.x[p] - 3, lane.y[p] - 3, 6, 6, "rgba(255, 0, 0, " + pathIsVisible + ")");
    p++;
  }
  return lane;
};

enemyAlive = true;

update = function() {
  if (pi < path.length) {
    enemy.x = path[pi].x;
    enemy.y = path[pi].y;
    return pi += enemy.speed;
  } else if (enemyAlive) {
    health -= enemy.damage;
    enemyAlive = false;
    enemy.kill();
    return console.log(health);
  }
};

module.exports = {
  update: update,
  load: load,
  create: create
};


},{}],7:[function(require,module,exports){
var background, cast, castFail, castSucceed, create, duplicateSummoned, duplicates, game, load, metronome, onBeat,
  hasProp = {}.hasOwnProperty;

metronome = require('./metronome');

game = null;

duplicates = {};

cast = {};

background = null;

create = function(g) {
  game = g;
  background = game.add.audio('background');
  duplicates.fire = game.add.audio('duplicate.fire', 0);
  duplicates.water = game.add.audio('duplicate.water', 0);
  duplicates.wind = game.add.audio('duplicate.wind', 0);
  duplicates.earth = game.add.audio('duplicate.earth', 0);
  cast.succeed = game.add.audio('cast.succeed');
  return cast.fail = game.add.audio('cast.fail');
};

onBeat = function(beat) {
  var element, results, sound;
  if (beat === 0) {
    background.play();
    results = [];
    for (element in duplicates) {
      if (!hasProp.call(duplicates, element)) continue;
      sound = duplicates[element];
      results.push(sound.play());
    }
    return results;
  }
};

load = function(game) {
  game.load.audio('background', 'sound/test.mp3');
  game.load.audio('duplicate.fire', 'sound/dup-1.mp3');
  game.load.audio('duplicate.wind', 'sound/dup-2.mp3');
  game.load.audio('duplicate.earth', 'sound/dup-3.mp3');
  game.load.audio('duplicate.water', 'sound/dup-4.mp3');
  game.load.audio('cast.succeed', 'sound/cast.mp3');
  return game.load.audio('cast.fail', 'sound/cast-fail.mp3');
};

duplicateSummoned = function(element) {
  return duplicates[element].fadeIn(50);
};

castSucceed = function() {
  return cast.succeed.play();
};

castFail = function() {
  return cast.fail.play();
};

module.exports = {
  load: load,
  create: create,
  onBeat: onBeat,
  duplicateSummoned: duplicateSummoned,
  cast: {
    succeed: castSucceed,
    fail: castFail
  }
};


},{"./metronome":4}],8:[function(require,module,exports){
module.exports = Phaser;


},{}],9:[function(require,module,exports){
var SPEED, cast, create, cursors, duplicates, getPressedDirections, load, mana, manaCosts, metronome, midi, move, movementScheme, music, onCast, player, summon,
  hasProp = {}.hasOwnProperty;

metronome = require('./metronome');

duplicates = require('./duplicates');

mana = require('./mana');

music = require('./music');

midi = require('./midi');

player = null;

cursors = null;

SPEED = 300;

onCast = new Phaser.Signal();

manaCosts = {
  fire: 10,
  water: 10,
  earth: 10,
  wind: 10
};

cast = function() {
  var hitInfo;
  hitInfo = metronome.isHit();
  if (hitInfo != null) {
    onCast.dispatch.apply(onCast, hitInfo);
    return music.cast.succeed();
  } else {
    return music.cast.fail();
  }
};

load = function(game) {
  return game.load.spritesheet('player', 'img/green.bmp', 1, 1);
};

create = function(game) {
  var space;
  player = game.add.sprite(200, 200, 'player');
  player.scale.set(50, 50);
  mana.create(game);
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1, 2], 10, true);
  player.animations.add('right', [3, 4, 5], 10, true);
  player.animations.add('up', [0, 1, 2], 10, true);
  player.animations.add('down', [0, 1, 2], 10, true);
  player.animations.add('summon.fire', [3, 4, 5], 10, false);
  player.animations.add('summon.water', [3, 4, 5], 10, false);
  player.animations.add('summon.wind', [3, 4, 5], 10, false);
  player.animations.add('summon.earth', [3, 4, 5], 10, false);
  cursors = game.input.keyboard.createCursorKeys();
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  space.onDown.add(cast);
  return midi.signal.add(function(pitch) {
    switch (pitch) {
      case 48:
        return cast();
    }
  });
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
  var direction, key, midiPressed, pressed;
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
  midiPressed = (function() {
    var ref, results;
    ref = midi.movementState;
    results = [];
    for (direction in ref) {
      if (!hasProp.call(ref, direction)) continue;
      key = ref[direction];
      if (key.isDown) {
        results.push(direction);
      }
    }
    return results;
  })();
  return pressed.concat(midiPressed);
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

summon = function(element) {
  var cost;
  cost = manaCosts[element];
  if ((mana.current() - cost) > 0) {
    player.animations.play("summon." + element);
    mana.spend(cost);
    duplicates.spawn(element, player.body.position);
    return music.duplicateSummoned(element);
  }
};

module.exports = {
  load: load,
  create: create,
  move: move,
  sprite: function() {
    return player;
  },
  onCast: onCast,
  summon: summon
};


},{"./duplicates":1,"./mana":3,"./metronome":4,"./midi":5,"./music":7}],10:[function(require,module,exports){
var SPAWN_DELAY, create, enemies, game, load, scheduleSpawnPoint, scheduleSpawnPoints, spawnGroup, spawnGroups, spawnPoints,
  hasProp = {}.hasOwnProperty;

spawnPoints = [
  {
    location: {
      x: 200,
      y: 200
    },
    waves: [
      {
        time: 1000 * 10,
        enemies: {
          fire: 5,
          wind: 3
        }
      }, {
        time: 1000 * 20,
        enemies: {
          fire: 5,
          wind: 3
        }
      }
    ]
  }, {
    location: {
      x: 100,
      y: 100
    },
    waves: [
      {
        time: 1000 * 10,
        enemies: {
          fire: 5,
          wind: 3
        }
      }, {
        time: 1000 * 20,
        enemies: {
          fire: 5,
          wind: 3
        }
      }
    ]
  }
];

game = null;

enemies = null;

SPAWN_DELAY = 200;

load = function(game) {
  game.load.spritesheet('enemy.fire', 'img/red.bmp', 1, 1);
  game.load.spritesheet('enemy.water', 'img/blue.bmp', 1, 1);
  game.load.spritesheet('enemy.wind', 'img/silver.bmp', 1, 1);
  return game.load.spritesheet('enemy.earth', 'img/green.bmp', 1, 1);
};

spawnGroup = function(type, position, number) {
  var results, spawn;
  spawn = function() {
    var enemy;
    enemy = enemies.create(position.x, position.y, "enemy." + type);
    return enemy.scale.set(100, 100);
  };
  results = [];
  while (number >= 0) {
    setTimeout(spawn, number * SPAWN_DELAY);
    results.push(number -= 1);
  }
  return results;
};

spawnGroups = function(position, wave) {
  var number, ref, results, type;
  ref = wave.enemies;
  results = [];
  for (type in ref) {
    if (!hasProp.call(ref, type)) continue;
    number = ref[type];
    results.push(spawnGroup(type, position, number));
  }
  return results;
};

scheduleSpawnPoint = function(spawnPoint) {
  return spawnPoint.waves.forEach(function(wave) {
    var c;
    c = function() {
      return spawnGroups(spawnPoint.location, wave);
    };
    return setTimeout(c, wave.time);
  });
};

scheduleSpawnPoints = function() {
  return spawnPoints.forEach(function(spawnPoint) {
    return scheduleSpawnPoint(spawnPoint);
  });
};

create = function(g) {
  game = g;
  enemies = game.add.group();
  return scheduleSpawnPoints();
};

module.exports = {
  load: load,
  create: create
};


},{}],11:[function(require,module,exports){
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


},{"./metronome":4}],12:[function(require,module,exports){
var cast, create, embiggen, i, load, metronome, move, params, toX, whichSprite, worshippers;

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

load = function(game) {
  game.load.spritesheet('worshipper', 'img/silver.bmp', 1, 1);
  return game.load.spritesheet('worshipper.elder', 'img/red.bmp', 1, 1);
};

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
  load: load,
  create: create,
  move: move,
  cast: cast
};


},{"./metronome":4}]},{},[2]);
