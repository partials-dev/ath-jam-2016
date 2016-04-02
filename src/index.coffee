Phaser = require './phaser'
standingStones = require './standing-stones'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()
TEMPO = 100

preload = ->
  # load standing stones
  game.load.image 'standing-stones.fire', 'img/red.png'
  game.load.image 'standing-stones.wood', 'img/green.png'
  game.load.image 'standing-stones.water', 'img/blue.png'
  game.load.image 'standing-stones.metal', 'img/silver.png'

create = ->
  standingStones.create game

update = ->

render = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update, render: render

