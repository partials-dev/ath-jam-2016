Phaser = require './phaser'
metronome = require './metronome'
standingStones = require './standing-stones'
worshippers = require './worshippers'
player = require './player'
#midi = require './midi'
music = require './music'
duplicates = require './duplicates'
spawnPoints = require './spawn-points'
moveEnemies = require './move-enemies'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()

preload = ->
  game.renderer.renderSession.roundPixels = true
  Phaser.Canvas.setImageRenderingCrisp this.game.canvas

  worshippers.load game
  player.load game
  standingStones.load game
  duplicates.load game
  moveEnemies.load game
  music.load game
  spawnPoints.load game

met = null

base =
  x: 0.3
  y: 1

create = ->
  # create modules
  standingStones.create game
  worshippers.create game
  music.create game
  met = metronome.create game
  player.create game
  duplicates.create game
  spawnPoints.create game
  moveEnemies.create game, base, spawnPoints.s1, spawnPoints.s2

  # wire up event listeners
  met.add standingStones.onBeat
  met.add music.onBeat
  
  met.add duplicates.onBeat
  player.onCast.add worshippers.cast
  player.onCast.add duplicates.cast
  duplicates.summonSignal.add player.summon

update = ->
  worshippers.move metronome.progressThroughMeasure()
  player.move()
  #moveEnemies.update()

render = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update, render: render
