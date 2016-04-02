Phaser = require './phaser'
metronome = require './metronome'
standingStones = require './standing-stones'
worshippers = require './worshippers'
player = require './player'
midi = require './midi'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()

preload = ->
  # load worshippers
  game.load.spritesheet 'worshipper', 'img/silver.bmp', 1, 1
  game.load.spritesheet 'worshipper.elder', 'img/red.bmp', 1, 1

  # load standing stones
  game.load.spritesheet 'standing-stone.fire', 'img/fire-stone.bmp', 8, 8
  game.load.spritesheet 'standing-stone.wood', 'img/wood-stone.bmp', 8, 8
  game.load.spritesheet 'standing-stone.water', 'img/water-stone.bmp', 8, 8
  game.load.spritesheet 'standing-stone.metal', 'img/metal-stone.bmp', 8, 8

  # load player
  game.load.spritesheet 'player', 'img/green.bmp', 1, 1

  # load audio
  game.load.audio 'background', 'sound/test.mp3'

met = null
tryHit = ->
  if metronome.isHit()
    worshippers.cast()
    #standingStones.onCast()

create = ->
  standingStones.create game
  worshippers.create game
  met = metronome.create game
  met.add(standingStones.onBeat)
  met.add (beat) ->
    if beat is 0
      game.sound.play 'background'
  space = game.input.keyboard.addKey Phaser.Keyboard.SPACEBAR
  space.onDown.add tryHit
  player.create game

update = ->
  worshippers.move metronome.progressThroughMeasure()
  player.move()

render = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update, render: render
