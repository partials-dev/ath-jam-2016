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
  game.load.spritesheet 'duplicate.fire', 'img/red.bmp', 1, 1
  game.load.spritesheet 'duplicate.water', 'img/blue.bmp', 1, 1
  game.load.spritesheet 'duplicate.earth', 'img/green.bmp', 1, 1
  game.load.spritesheet 'duplicate.wind', 'img/silver.bmp', 1, 1
  game.load.spritesheet 'duplicate.attack-range', 'img/red.bmp', 1, 1

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
  attackRange.scale.set 50, 50
  attackRange.anchor.set 0.5

  # actual image of duplicate
  dup = duplicates.create position.x, position.y, "duplicate.#{element}", 1
  dup.scale.set 30, 30
  dup.anchor.set 0.5

  dup.attackRange = attackRange
  attackRange.duplicate = dup

  dup.attack = (enemy) ->
    attack[element](enemy)

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
