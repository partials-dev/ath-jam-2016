standingStones = require './standing-stones'

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

duplicates = null
create = (g) ->
  game = g
  duplicates = game.add.group()

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
  dup = duplicates.create position.x, position.y, "duplicate.#{element}", 1
  dup.scale.set 50, 50

module.exports =
  cast: cast
  onBeat: onBeat
  load: load
  create: create
  summonSignal: summonSignal
  spawn: spawn
