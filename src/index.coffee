Phaser = require './phaser'
metronome = require './metronome'
standingStones = require './standing-stones'
worshippers = require './worshippers'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()

preload = ->
  # load worshippers
  game.load.spritesheet 'worshipper', 'img/silver.bmp', 1, 1
  game.load.spritesheet 'worshipper.elder', 'img/red.bmp', 1, 1

  # load standing stones
  game.load.spritesheet 'standing-stone.fire', 'img/red.bmp', 1, 1
  game.load.spritesheet 'standing-stone.wood', 'img/green.bmp', 1, 1
  game.load.spritesheet 'standing-stone.water', 'img/blue.bmp', 1, 1
  game.load.spritesheet 'standing-stone.metal', 'img/silver.bmp', 1, 1

met = null
tryHit = ->
  ms = metronome.msToClosestBeat()
  distance = Math.abs ms + 450
  console.log "======= #{distance}"
  if distance < metronome.beatDuration / 2
    console.log 'casting'
    worshippers.cast()

create = ->
  standingStones.create game
  worshippers.create game
  met = metronome.create game
  met.add(standingStones.onBeat)
  space = game.input.keyboard.addKey Phaser.Keyboard.SPACEBAR
  space.onDown.add tryHit

update = ->
  worshippers.move metronome.progressThroughMeasure()

render = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update, render: render
