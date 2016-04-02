Phaser = require './phaser'
standingStones = require './standing-stones'
worshippers = require './worshippers'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()
TEMPO = 100

preload = ->
  # load standing stones
  game.load.image 'standing-stone.fire', 'img/red.png'
  game.load.image 'standing-stone.wood', 'img/green.png'
  game.load.image 'standing-stone.water', 'img/blue.png'
  game.load.image 'standing-stone.metal', 'img/silver.png'

  # load worshippers
  game.load.image 'worshipper', 'img/silver.png'
  game.load.image 'worshipper.elder', 'img/red.png'

create = ->
  #standingStones.create game
  worshippers.create game

i = 0
update = ->
  i += 0.002
  worshippers.move i

render = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update, render: render
