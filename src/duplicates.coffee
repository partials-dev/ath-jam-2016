standingStones = require './standing-stones'
enemyModule = require './enemy'
attack = require './attack'

previousMeasure = [
  false
  false
  false
  false
]

currentMeasure = []

game = null
summonSignal = new Phaser.Signal()

load = (game) ->
  game.load.atlasJSONArray('duplicate.fire', 'img/player/dupe-fire.png', 'img/player/dupe-fire.json')
  game.load.atlasJSONArray('duplicate.water', 'img/player/dupe-water.png', 'img/player/dupe-water.json')
  game.load.atlasJSONArray('duplicate.earth', 'img/player/dupe-earth.png', 'img/player/dupe-earth.json')
  game.load.atlasJSONArray('duplicate.wind', 'img/player/dupe-wind.png', 'img/player/dupe-wind.json')
  game.load.spritesheet 'duplicate.attack-range', 'img/1x1.png', 1, 1

duplicates = null
attackRanges = null
create = (g) ->
  game = g
  attackRanges = game.add.physicsGroup Phaser.Physics.ARCADE
  duplicates = game.add.physicsGroup Phaser.Physics.ARCADE

measureMoved = false
moveMeasure = ->
  measureMoved = true
  previousMeasure = currentMeasure
  currentMeasure = [false, false, false, false]

onBeat = (beat) ->
  measureMoved = false if beat is 3
  # don't move measure if a cast already
  # triggered the move
  if beat is 0 and not measureMoved
    moveMeasure()

cast = (closestBeat, msToBeat) ->
  # go ahead and move the currentMeasure
  # to the previous measure if we're hitting
  # early on the first beat of the measure
  moveMeasure() if closestBeat is 0 and msToBeat < 0
  currentMeasure[closestBeat] = true
  if previousMeasure[closestBeat]
    element = standingStones.spriteKeys[closestBeat].split('.')[1]
    summon element

summon = (element) ->
  summonSignal.dispatch element

spawn = (element, position) ->
  # attack range
  attackRange = attackRanges.create position.x, position.y, "duplicate.attack-range", 1
  attackRange.scale.set 0.1, 0.1
  attackRange.anchor.set 0.5

  # actual image of duplicate
  dup = duplicates.create position.x, position.y, "duplicate.#{element}", 1
  dup.scale.set 0.1, 0.1
  dup.anchor.set 0.5
  dup.nextFire = 0

  dup.attackRange = attackRange
  attackRange.duplicate = dup

  dup.attack = (enemy) ->
    attack.attack dup, enemy, element

update = ->
  overlapHandler = (enemy, attackRange) ->
    attackRange.duplicate.attack enemy
  enemyModule.enemies().forEach (nme) ->
    duplicates.forEach (dup) ->
      game.physics.arcade.overlap nme, dup.attackRange, overlapHandler

module.exports =
  cast: cast
  onBeat: onBeat
  load: load
  create: create
  summonSignal: summonSignal
  spawn: spawn
  update: update
