Phaser = require './phaser'
metronome = require './metronome'
standingStones = require './standing-stones'
worshippers = require './worshippers'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()

preload = ->
  # load standing stones
  game.load.image 'standing-stone.fire', 'img/red.png'
  game.load.image 'standing-stone.wood', 'img/green.png'
  game.load.image 'standing-stone.water', 'img/blue.png'
  game.load.image 'standing-stone.metal', 'img/silver.png'

  # load worshippers
  game.load.image 'worshipper', 'img/silver.png'
  game.load.image 'worshipper.elder', 'img/red.png'

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
