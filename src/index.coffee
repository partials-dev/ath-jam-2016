Phaser = require './phaser'
metronome = require './metronome'
standingStones = require './standing-stones'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()

  

preload = ->
  # load standing stones
  game.load.image 'standing-stones.fire', 'img/red.png'
  game.load.image 'standing-stones.wood', 'img/green.png'
  game.load.image 'standing-stones.water', 'img/blue.png'
  game.load.image 'standing-stones.metal', 'img/silver.png'

create = ->
  standingStones.create game

  met = metronome.metronome game

  met.add(metronome.shoutBeat)
  met.add(standingStones.onBeat)

update = ->

render = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update, render: render

